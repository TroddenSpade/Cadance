import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * People often paste the REST endpoint from the Supabase dashboard instead of
 * the project root. createClient appends `/auth/v1` and `/rest/v1` itself, so
 * strip those suffixes and any trailing slash.
 */
export function normalizeSupabaseUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim().replace(/\/+$/, '');
  if (!trimmed) return undefined;
  const root = trimmed.replace(/\/rest\/v1$/i, '').replace(/\/auth\/v1$/i, '');
  try {
    const parsed = new URL(root);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return undefined;
    return root;
  } catch {
    return undefined;
  }
}

const url = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

function createSupabaseClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  try {
    return createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    });
  } catch {
    return null;
  }
}

/**
 * Null when the build has no (valid) Supabase credentials. The app then
 * behaves exactly as before: local-only progress, with a note in Settings
 * explaining how to enable sync.
 */
export const supabase: SupabaseClient | null = createSupabaseClient();

export const supabaseConfigured = supabase !== null;
