INSERT INTO games (code, name, description) VALUES
  ('2048', '2048', 'Join numbers and get to 2048!'),
  ('snake', 'Snake', 'Classic snake game'),
  ('tiles', 'Tiles', 'Pattern memory tiles')
ON CONFLICT (code) DO NOTHING;

-- Optional demo user
INSERT INTO users (email, display_name, password_hash) VALUES
  ('guest@example.com', 'Guest', '$2b$10$examplehash...')
ON CONFLICT (email) DO NOTHING;
