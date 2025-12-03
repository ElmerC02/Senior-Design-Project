INSERT INTO games (code, name, description) VALUES
  ('2048', '2048', 'Join numbers and get to 2048!'),
  ('snake', 'Snake', 'Classic snake game'),
  ('tiles', 'Tiles', 'Pattern memory tiles')
ON CONFLICT (code) DO NOTHING;

-- Optional demo user
INSERT INTO users (email, display_name, password_hash) VALUES
  ('guest@example.com', 'Guest', '$2b$10$examplehash...')
ON CONFLICT (email) DO NOTHING;

-- Insert sample scores for the demo user
INSERT INTO scores (game_id, user_id, value)
VALUES
  ((SELECT id FROM games WHERE code = 'snake'),
   (SELECT id FROM users WHERE email = 'guest@example.com'),
   10),

  ((SELECT id FROM games WHERE code = 'snake'),
   (SELECT id FROM users WHERE email = 'guest@example.com'),
   25),

  ((SELECT id FROM games WHERE code = '2048'),
   (SELECT id FROM users WHERE email = 'guest@example.com'),
   512),

  ((SELECT id FROM games WHERE code = 'tiles'),
   (SELECT id FROM users WHERE email = 'guest@example.com'),
   7);



DROP VIEW IF EXISTS leaderboard;
CREATE VIEW leaderboard AS
SELECT 
  g.code AS game_code,
  u.display_name AS user,
  MAX(s.value) AS best_value
FROM scores s
JOIN games g ON g.id = s.game_id
JOIN users u ON u.id = s.user_id
GROUP BY g.code, u.display_name;

