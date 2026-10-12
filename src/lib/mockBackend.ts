import type { Profile, Trip } from '@/types';

/**
 * In-browser mock backend used ONLY for quick testing when no Supabase
 * credentials are provided. Data is persisted to localStorage so a refresh
 * keeps you logged in and keeps your trips.
 *
 * This is NOT the production database: the real backend is Supabase
 * (see supabase.ts / db.ts). The mock lets you run the full UI flow with
 * zero setup. It intentionally stores passwords in plain text in
 * localStorage — acceptable for a local demo, never for real accounts.
 */

const USERS_KEY = 'll_mock_users';
const SESSION_KEY = 'll_mock_session';
const PROFILE_KEY = (uid: string) => `ll_mock_profile_${uid}`;
const TRIPS_KEY = (uid: string) => `ll_mock_trips_${uid}`;

export interface MockUser {
  id: string;
  email: string;
}

interface StoredUser extends MockUser {
  password: string;
}

type Listener = (user: MockUser | null) => void;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `mock-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

const listeners = new Set<Listener>();

function emit(user: MockUser | null): void {
  listeners.forEach((l) => l(user));
}

export const mockBackend = {
  onAuthChange(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getUser(): MockUser | null {
    return read<MockUser | null>(SESSION_KEY, null);
  },

  async signUp(email: string, password: string): Promise<void> {
    const users = read<StoredUser[]>(USERS_KEY, []);
    const normalized = email.toLowerCase();
    if (users.some((u) => u.email === normalized)) {
      throw new Error('User already registered');
    }
    if (password.length < 6) {
      throw new Error('Password should be at least 6 characters');
    }
    const user: StoredUser = { id: uid(), email: normalized, password };
    write(USERS_KEY, [...users, user]);
    const session: MockUser = { id: user.id, email: user.email };
    write(SESSION_KEY, session);
    emit(session);
  },

  async signIn(email: string, password: string): Promise<void> {
    const users = read<StoredUser[]>(USERS_KEY, []);
    const normalized = email.toLowerCase();
    const user = users.find((u) => u.email === normalized);
    if (!user || user.password !== password) {
      throw new Error('Invalid login credentials');
    }
    const session: MockUser = { id: user.id, email: user.email };
    write(SESSION_KEY, session);
    emit(session);
  },

  async signOut(): Promise<void> {
    localStorage.removeItem(SESSION_KEY);
    emit(null);
  },

  async fetchProfile(userId: string): Promise<Profile | null> {
    return read<Profile | null>(PROFILE_KEY(userId), null);
  },

  async saveProfile(userId: string, profile: Profile): Promise<void> {
    write(PROFILE_KEY(userId), profile);
  },

  async fetchTrips(userId: string): Promise<Trip[]> {
    const trips = read<Trip[]>(TRIPS_KEY(userId), []);
    return [...trips].sort(
      (a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime(),
    );
  },

  async createTrip(userId: string, trip: Omit<Trip, 'id'>): Promise<Trip> {
    const trips = read<Trip[]>(TRIPS_KEY(userId), []);
    const created: Trip = { ...trip, id: uid() };
    write(TRIPS_KEY(userId), [...trips, created]);
    return created;
  },

  async updateTrip(userId: string, trip: Trip): Promise<Trip> {
    const trips = read<Trip[]>(TRIPS_KEY(userId), []);
    write(
      TRIPS_KEY(userId),
      trips.map((t) => (t.id === trip.id ? trip : t)),
    );
    return trip;
  },

  async deleteTrip(userId: string, tripId: string): Promise<void> {
    const trips = read<Trip[]>(TRIPS_KEY(userId), []);
    write(
      TRIPS_KEY(userId),
      trips.filter((t) => t.id !== tripId),
    );
  },
};
