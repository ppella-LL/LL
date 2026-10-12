import { supabase } from './supabase';
import type { Profile, Trip } from '@/types';

/**
 * Thin data-access layer over Supabase.
 *
 * Everything the UI needs for persistence goes through this module, so
 * swapping the backend later (or adding caching) touches only this file.
 *
 * Expected tables (see README / supabase-schema.sql):
 *   profiles(user_id uuid PK, data jsonb)
 *   trips(id uuid PK, user_id uuid, data jsonb, created_at timestamptz)
 * Both protected by row-level security scoped to auth.uid().
 */

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return (data?.data as Profile) ?? null;
}

export async function saveProfile(userId: string, profile: Profile): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .upsert({ user_id: userId, data: profile }, { onConflict: 'user_id' });

  if (error) throw error;
}

export async function fetchTrips(userId: string): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select('id, data')
    .eq('user_id', userId);

  if (error) throw error;

  const trips = (data ?? []).map((row) => ({ ...(row.data as Trip), id: row.id as string }));
  return trips.sort(
    (a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime(),
  );
}

export async function createTrip(
  userId: string,
  trip: Omit<Trip, 'id'>,
): Promise<Trip> {
  const { data, error } = await supabase
    .from('trips')
    .insert({ user_id: userId, data: trip })
    .select('id, data')
    .single();

  if (error) throw error;
  return { ...(data.data as Trip), id: data.id as string };
}

export async function updateTrip(userId: string, trip: Trip): Promise<Trip> {
  const { id, ...rest } = trip;
  const { data, error } = await supabase
    .from('trips')
    .update({ data: rest })
    .eq('id', id)
    .eq('user_id', userId)
    .select('id, data')
    .single();

  if (error) throw error;
  return { ...(data.data as Trip), id: data.id as string };
}

export async function deleteTrip(userId: string, tripId: string): Promise<void> {
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', tripId)
    .eq('user_id', userId);

  if (error) throw error;
}
