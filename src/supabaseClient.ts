import { createClient } from '@supabase/supabase-js';

interface EnvConfig {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  REACT_APP_SUPABASE_URL?: string;
  REACT_APP_SUPABASE_ANON_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

interface WindowWithEnv extends Window {
  __env?: EnvConfig;
}

function getEnv() {
  // Vite: import.meta.env.VITE_SUPABASE_*
  const vite = typeof import.meta !== 'undefined' ? (import.meta as unknown as Record<string, EnvConfig>).env : undefined;
  const viteUrl = vite?.VITE_SUPABASE_URL;
  const viteKey = vite?.VITE_SUPABASE_ANON_KEY;

  // CRA / webpack: process.env.REACT_APP_SUPABASE_*
  const reactUrl = typeof process !== 'undefined' ? (process.env as EnvConfig)?.REACT_APP_SUPABASE_URL : undefined;
  const reactKey = typeof process !== 'undefined' ? (process.env as EnvConfig)?.REACT_APP_SUPABASE_ANON_KEY : undefined;

  // Fallback to window.__env if you expose envs at runtime
  const win = typeof window !== 'undefined' ? (window as WindowWithEnv).__env : undefined;
  const winUrl = win?.SUPABASE_URL;
  const winKey = win?.SUPABASE_ANON_KEY;

  const url = viteUrl ?? reactUrl ?? winUrl ?? '';
  const key = viteKey ?? reactKey ?? winKey ?? '';

  return { url, key };
}

const { url: SUPABASE_URL, key: SUPABASE_ANON_KEY } = getEnv();

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // log a non-blocking warning — avoids ReferenceError in browser
  // set environment variables: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (Vite)
  // or REACT_APP_SUPABASE_URL / REACT_APP_SUPABASE_ANON_KEY (CRA)
  console.warn('Supabase env vars not found. Set VITE_SUPABASE_* or REACT_APP_SUPABASE_*');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;