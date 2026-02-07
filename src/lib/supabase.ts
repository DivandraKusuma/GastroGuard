import { createClient } from '@supabase/supabase-js';

// Fallback for Demo Use: Use Public Credentials if .env missing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qytrvgjszgsthvfbssoe.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_KU4EhHVV0lcSvcrjRNI2Zg_KB4BRKiy';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase Credentials!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
