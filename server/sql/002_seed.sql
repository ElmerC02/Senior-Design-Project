-- Insert sample users
INSERT INTO users (username, password_hash)
VALUES
    ('guest', 'hashed_guest_pw'), -- replace with actual hashed passwords
    ('admin', 'hashed_admin_pw'),
ON CONFLICT (username) DO NOTHING;

-- Insert sample games
INSERT INTO games (title, genre)
VALUES
    ('Tetris', 'Puzzle'),
    ('Snake', 'Arcade'),
    ('Asteroids', 'Shooter')
ON CONFLICT (title) DO NOTHING;

-- Insert sample scores
WITH
    u AS (SELECT id, username FROM users),
    g AS (SELECT id, title FROM games)
INSERT INTO scores (user_id, game_id, score)
SELECT
    u.id,
    g.id,
    CASE
        WHEN g.title = 'Tetris' THEN FLOOR(RANDOM() * 10000)
        WHEN g.title = 'Snake' THEN FLOOR(RANDOM() * 500)
        WHEN g.title = 'Asteroids' THEN FLOOR(RANDOM() * 3000)
    END AS score
FROM u
JOIN g ON TRUE
WHERE u.username IN ('guest', 'admin')
  AND g.title IN ('Tetris', 'Snake', 'Asteroids');
