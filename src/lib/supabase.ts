import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
	// Helpful runtime message for missing configuration
	console.error(
		'Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment (.env, .env.local or project settings).'
	);
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
