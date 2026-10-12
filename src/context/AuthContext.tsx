import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { backend, useMock, type AppUser } from '@/lib/backend';
import type { Profile, Trip } from '@/types';

interface AuthContextValue {
  /** True when running on the localStorage mock backend (no Supabase). */
  mock: boolean;
  loading: boolean;
  user: AppUser | null;
  profile: Profile | null;
  trips: Trip[];
  signUp: (
    email: string,
    password: string,
    initialProfile?: Profile,
  ) => Promise<{ needsConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  saveProfile: (profile: Profile) => Promise<void>;
  addTrip: (trip: Omit<Trip, 'id'>) => Promise<void>;
  updateTrip: (trip: Trip) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);

  const loadUserData = useCallback(async (currentUser: AppUser) => {
    try {
      let [p, t] = await Promise.all([
        backend.fetchProfile(currentUser.id),
        backend.fetchTrips(currentUser.id),
      ]);
      // First login after email confirmation: write the profile captured at signup.
      if (!p) {
        try {
          const pending = localStorage.getItem('ll_pending_profile');
          if (pending) {
            const parsed = JSON.parse(pending) as Profile;
            await backend.saveProfile(currentUser.id, parsed);
            localStorage.removeItem('ll_pending_profile');
            p = parsed;
          }
        } catch {
          /* ignore */
        }
      }
      setProfile(p);
      setTrips(t);
    } catch (err) {
      console.error('Failed to load user data', err);
      setProfile(null);
      setTrips([]);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const applyUser = async (currentUser: AppUser | null) => {
      if (!active) return;
      setUser(currentUser);
      if (currentUser) {
        await loadUserData(currentUser);
      } else {
        setProfile(null);
        setTrips([]);
      }
      if (active) setLoading(false);
    };

    backend.getCurrentUser().then(applyUser);
    const unsubscribe = backend.onAuthChange(applyUser);

    return () => {
      active = false;
      unsubscribe();
    };
  }, [loadUserData]);

  // Signup also captures the initial profile (signup wizard = account + onboarding).
  // Returns needsConfirmation so the UI can show a "check your email" screen.
  const signUp = useCallback(
    async (email: string, password: string, initialProfile?: Profile) => {
      const { needsConfirmation } = await backend.signUp(email, password);
      if (initialProfile) {
        const current = await backend.getCurrentUser();
        if (current) {
          // Session exists (mock, or confirmation disabled): save now.
          await backend.saveProfile(current.id, initialProfile);
          setProfile(initialProfile);
        } else {
          // No session yet (email confirmation): stash it, write after login.
          try {
            localStorage.setItem('ll_pending_profile', JSON.stringify(initialProfile));
          } catch {
            /* ignore */
          }
        }
      }
      return { needsConfirmation };
    },
    [],
  );

  const signIn = useCallback((email: string, password: string) => {
    return backend.signIn(email, password);
  }, []);

  const signOut = useCallback(async () => {
    await backend.signOut();
    setUser(null);
    setProfile(null);
    setTrips([]);
  }, []);

  const saveProfile = useCallback(
    async (next: Profile) => {
      if (!user) throw new Error('Not authenticated');
      await backend.saveProfile(user.id, next);
      setProfile(next);
    },
    [user],
  );

  const sortByCheckIn = (list: Trip[]) =>
    [...list].sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

  const addTrip = useCallback(
    async (trip: Omit<Trip, 'id'>) => {
      if (!user) throw new Error('Not authenticated');
      const created = await backend.createTrip(user.id, trip);
      setTrips((prev) => sortByCheckIn([...prev, created]));
    },
    [user],
  );

  const updateTrip = useCallback(
    async (trip: Trip) => {
      if (!user) throw new Error('Not authenticated');
      const updated = await backend.updateTrip(user.id, trip);
      setTrips((prev) => sortByCheckIn(prev.map((t) => (t.id === updated.id ? updated : t))));
    },
    [user],
  );

  const deleteTrip = useCallback(
    async (tripId: string) => {
      if (!user) throw new Error('Not authenticated');
      await backend.deleteTrip(user.id, tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      mock: useMock,
      loading,
      user,
      profile,
      trips,
      signUp,
      signIn,
      signOut,
      saveProfile,
      addTrip,
      updateTrip,
      deleteTrip,
    }),
    [
      loading,
      user,
      profile,
      trips,
      signUp,
      signIn,
      signOut,
      saveProfile,
      addTrip,
      updateTrip,
      deleteTrip,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
