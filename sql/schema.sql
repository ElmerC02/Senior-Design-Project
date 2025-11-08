-- Minimal schema aligned with MVP ERD
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  password_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  rules_json JSONB,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  game_id INTEGER NOT NULL REFERENCES games(id),
  value INTEGER NOT NULL,
  duration_ms INTEGER,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  checksum TEXT,
  client_version TEXT
);

CREATE INDEX IF NOT EXISTS idx_scores_game_value ON scores (game_id, value DESC);
CREATE INDEX IF NOT EXISTS idx_scores_user ON scores (user_id);

-- Simple materialized leaderboard view substitute (best score per user per game)
DROP VIEW IF EXISTS leaderboard;
CREATE VIEW leaderboard AS
SELECT s.game_id, s.user_id, MAX(s.value) AS best_value
FROM scores s
GROUP BY s.game_id, s.user_id;

