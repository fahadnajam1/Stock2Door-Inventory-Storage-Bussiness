import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Resolve env reliably for Node, Vite (import.meta.env) or a global injector
const env = (() => {
  if (typeof process !== 'undefined' && process.env) return process.env as Record<string, string>;
  if (typeof (import.meta as unknown as Record<string, unknown>)?.env !== 'undefined') return (import.meta as unknown as Record<string, unknown>).env as Record<string, string>;
  return (globalThis as Record<string, unknown>).__ENV__ as Record<string, string> | undefined || {};
})();

const url =
  env.NEXT_PUBLIC_SUPABASE_URL ||
  env.REACT_APP_SUPABASE_URL ||
  env.SUPABASE_URL ||
  (env as Record<string, string>).VITE_SUPABASE_URL;
const anonKey =
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  env.REACT_APP_SUPABASE_ANON_KEY ||
  env.SUPABASE_ANON_KEY ||
  (env as Record<string, string>).VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Missing Supabase environment variables. Set SUPABASE_URL and SUPABASE_ANON_KEY (or VITE_/NEXT_PUBLIC_/REACT_APP_ variants).');
}

export const supabase: SupabaseClient = createClient(url, anonKey);