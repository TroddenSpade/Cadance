import type { SupabaseClient } from '@supabase/supabase-js';

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

/**
 * True when the build has credentials. The Supabase client itself is loaded on
 * demand so local-only builds do not pay for it on first paint.
 */
export const supabaseConfigured = Boolean(url && anonKey);

let clientPromise: Promise<SupabaseClient | null> | null = null;

/** Loads the client once. Resolves to null for local-only builds. */
export function loadSupabase(): Promise<SupabaseClient | null> {
  if (!supabaseConfigured) return Promise.resolve(null);
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js')
      .then(({ createClient }) => {
        try {
          return createClient(url!, anonKey!, {
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
      })
      .catch(() => null);
  }
  return clientPromise;
}
