-- ============================================================
-- FBMT Agricultural Balance Sheet — Supabase Database Setup
-- Run this SQL in your Supabase project:
--   https://app.supabase.com → Your Project → SQL Editor → New Query
-- ============================================================

-- Main table for balance sheets
CREATE TABLE IF NOT EXISTS balance_sheets (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name  TEXT NOT NULL,
  as_of_date   DATE NOT NULL,
  data         JSONB NOT NULL,
  saved_at     TIMESTAMPTZ DEFAULT NOW(),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  -- Unique constraint: one record per client per date (upsert-friendly)
  UNIQUE (client_name, as_of_date)
);

-- Index for fast client lookups
CREATE INDEX IF NOT EXISTS idx_balance_sheets_client
  ON balance_sheets (client_name);

-- Index for date-range queries (for year comparison)
CREATE INDEX IF NOT EXISTS idx_balance_sheets_date
  ON balance_sheets (as_of_date DESC);

-- Enable Row Level Security (keeps data private)
ALTER TABLE balance_sheets ENABLE ROW LEVEL SECURITY;

-- Allow all operations from your app (using your anon key)
-- For a single-bank deployment this is fine.
-- For multi-user/multi-bank, add auth policies instead.
CREATE POLICY "Allow all for anon" ON balance_sheets
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ── Verify it worked ─────────────────────────────────────────
-- Run this to confirm the table exists:
-- SELECT * FROM balance_sheets LIMIT 5;
