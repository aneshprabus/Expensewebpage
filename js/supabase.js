// js/supabase.js

const SUPABASE_URL = "https://jocuisqnrnkzzbontlqm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_rvLs-6kiyS8lCcDejyn31w_3bjJj0fL";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
