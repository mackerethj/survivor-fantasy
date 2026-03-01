import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Helps you catch missing env vars fast
  // (You’ll see this in browser console)
  console.warn("Missing Supabase env vars. Check Vercel Environment Variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
