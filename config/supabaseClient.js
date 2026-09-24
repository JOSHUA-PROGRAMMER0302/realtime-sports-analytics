// config/supabaseClient.js — Supabase client singleton
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn(
    "⚠️  SUPABASE_URL or SUPABASE_KEY is missing. " +
      "Database features will be unavailable until they are set in .env"
  );
}

const supabase = createClient(
  SUPABASE_URL || "",
  SUPABASE_KEY || ""
);

module.exports = supabase;
