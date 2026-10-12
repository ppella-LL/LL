import { supabase, isSupabaseConfigured } from './supabase';
import {
  fetchProfile as sbFetchProfile,
  saveProfile as sbSaveProfile,
  fetchTrips as sbFetchTrips,
  createTrip as sbCreateTrip,
  updateTrip as sbUpdateTrip,
  deleteTrip as sbDeleteTrip,
} from './db';
import { mockBackend, type MockUser } from './mockBackend';
import type { Profile, Trip } from '@/types';

/**
 * Single entry point the app uses for auth + data.
 *
 * - If Supabase env vars are present -> real Supabase backend.
 * - Otherwise -> in-browser mock backend (localStorage) for zero-setup testing.
 *
 * `useMock` lets the UI show a small "test mode" hint.
 */
export const useMock = !isSupabaseConfigured;

/** Minimal user shape the app needs, common to both backends. */
export interface AppUser {
  id: string;
  email: string;
}

function toAppUser(u: { id: string; email?: string | null } | MockUser | null): AppUser | null {
  if (!u) return null;
  return { id: u.id, email: u.email ?? '' };
}

export const backend = {
  useMock,

  /** Subscribe to auth changes; returns an unsubscribe function. */
  onAuthChange(cb: (user: AppUser | null) => void): () => void {
    if (useMock) {
      return mockBackend.onAuthChange((u) => cb(toAppUser(u)));
    }
    const { data } = supabase.auth.onAuthStateChange((_e, session) =>
      cb(toAppUser(session?.user ?? null)),
    );
    return () => data.subscription.unsubscribe();
  },

  /** Resolve the current user once at startup. */
  async getCurrentUser(): Promise<AppUser | null> {
    if (useMock) return toAppUser(mockBackend.getUser());
    const { data } = await supabase.auth.getSession();
    return toAppUser(data.session?.user ?? null);
  },

  async signUp(email: string, password: string): Promise<void> {
    if (useMock) return mockBackend.signUp(email, password);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  },

  async signIn(email: string, password: string): Promise<void> {
    if (useMock) return mockBackend.signIn(email, password);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  async signOut(): Promise<void> {
    if (useMock) return mockBackend.signOut();
    await supabase.auth.signOut();
  },

  fetchProfile(userId: string): Promise<Profile | null> {
    return useMock ? mockBackend.fetchProfile(userId) : sbFetchProfile(userId);
  },

  saveProfile(userId: string, profile: Profile): Promise<void> {
    return useMock
      ? mockBackend.saveProfile(userId, profile)
      : sbSaveProfile(userId, profile);
  },

  fetchTrips(userId: string): Promise<Trip[]> {
    return useMock ? mockBackend.fetchTrips(userId) : sbFetchTrips(userId);
  },

  createTrip(userId: string, trip: Omit<Trip, 'id'>): Promise<Trip> {
    return useMock
      ? mockBackend.createTrip(userId, trip)
      : sbCreateTrip(userId, trip);
  },

  updateTrip(userId: string, trip: Trip): Promise<Trip> {
    return useMock ? mockBackend.updateTrip(userId, trip) : sbUpdateTrip(userId, trip);
  },

  deleteTrip(userId: string, tripId: string): Promise<void> {
    return useMock ? mockBackend.deleteTrip(userId, tripId) : sbDeleteTrip(userId, tripId);
  },
};
