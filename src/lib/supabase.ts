import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * True when both Supabase env vars are present and non-placeholder.
 * When false the app shows a clear setup message instead of crashing.
 */
export const isSupabaseConfigured =
  Boolean(url) &&
  Boolean(anonKey) &&
  !url.includes('YOUR-PROJECT') &&
  !anonKey.includes('YOUR-anon');

// Create the client even with placeholder values so imports never throw;
// calls simply fail until real credentials are provided.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
