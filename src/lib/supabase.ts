import { createClient } from '@supabase/supabase-js';

// Fallback for Demo Mode (Judge usage without .env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Running with placeholder Supabase credentials. Auth will not work unless DEMO_MODE is active.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
