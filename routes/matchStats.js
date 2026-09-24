// routes/matchStats.js — REST endpoints for historical match data
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

/**
 * GET /api/matches
 * Returns historical match data from the Supabase `matches` table.
 *
 * TODO: create the `matches` table in Supabase and flesh out the query.
 */
router.get("/matches", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase query error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
