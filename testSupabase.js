// testSupabase.js — Prove the Node server can write to (and read from) Supabase
require("dotenv").config();
const supabase = require("./config/supabaseClient");

async function runTest() {
  console.log("🔗  Connecting to Supabase...\n");

  // ── 1. INSERT a test match record ─────────────────────────────
  const testMatch = {
    team_a: "India",
    team_b: "Australia",
    score_a: 3,
    score_b: 1,
    sport: "hockey",
    match_date: new Date().toISOString(),
  };

  console.log("📝  Inserting test match:", testMatch);

  const { data: insertData, error: insertError } = await supabase
    .from("matches")
    .insert(testMatch)
    .select();                    // return the inserted row

  if (insertError) {
    console.error("\n❌  INSERT failed:", insertError.message);
    console.error("    Hint:", insertError.hint || insertError.details || "none");
    console.error(
      "\n💡  Make sure the 'matches' table exists in your Supabase project.",
      "\n    Recommended SQL to create it:\n"
    );
    console.log(`
  CREATE TABLE matches (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_a      TEXT NOT NULL,
    team_b      TEXT NOT NULL,
    score_a     INT  DEFAULT 0,
    score_b     INT  DEFAULT 0,
    sport       TEXT,
    match_date  TIMESTAMPTZ DEFAULT now(),
    created_at  TIMESTAMPTZ DEFAULT now()
  );

  -- Enable Row Level Security (good practice)
  ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

  -- Allow anonymous reads & inserts (tighten for production)
  CREATE POLICY "Allow anon read"  ON matches FOR SELECT USING (true);
  CREATE POLICY "Allow anon insert" ON matches FOR INSERT WITH CHECK (true);
`);
    process.exit(1);
  }

  console.log("✅  INSERT succeeded! Row:", insertData[0]);

  // ── 2. READ it back via SELECT ────────────────────────────────
  const { data: readData, error: readError } = await supabase
    .from("matches")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (readError) {
    console.error("\n❌  SELECT failed:", readError.message);
    process.exit(1);
  }

  console.log(`\n📖  Latest ${readData.length} match(es) in the database:`);
  console.table(readData);

  console.log("\n🎉  Supabase read/write test PASSED — your Data Router can talk to the database!");
  process.exit(0);
}

runTest();
