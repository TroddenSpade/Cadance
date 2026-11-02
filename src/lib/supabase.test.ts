import { describe, expect, it } from 'vitest';
import { normalizeSupabaseUrl } from './supabase';

describe('normalizeSupabaseUrl', () => {
  it('keeps the project root unchanged', () => {
    expect(normalizeSupabaseUrl('https://abc.supabase.co')).toBe('https://abc.supabase.co');
    expect(normalizeSupabaseUrl('https://abc.supabase.co/')).toBe('https://abc.supabase.co');
  });

  it('strips a pasted REST endpoint', () => {
    expect(normalizeSupabaseUrl('https://abc.supabase.co/rest/v1/')).toBe('https://abc.supabase.co');
    expect(normalizeSupabaseUrl('https://abc.supabase.co/rest/v1')).toBe('https://abc.supabase.co');
  });

  it('strips a pasted auth endpoint', () => {
    expect(normalizeSupabaseUrl('https://abc.supabase.co/auth/v1/')).toBe('https://abc.supabase.co');
  });

  it('trims whitespace and rejects empty or invalid values', () => {
    expect(normalizeSupabaseUrl('  https://abc.supabase.co  ')).toBe('https://abc.supabase.co');
    expect(normalizeSupabaseUrl('')).toBeUndefined();
    expect(normalizeSupabaseUrl(undefined)).toBeUndefined();
    expect(normalizeSupabaseUrl('abc.supabase.co')).toBeUndefined();
  });
});
