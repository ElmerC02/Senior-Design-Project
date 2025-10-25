-- Drop old tables so we can recreate them cleanly during development
DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS users;

-- Users who can log in
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL, -- up to 50 characters
    password_hash VARCHAR(255) NOT NULL, -- hashed password
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- Games that exist in the system
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) UNIQUE NOT NULL,
    genre VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scores earned by users in specific games
CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    game_id INT REFERENCES games(id) ON DELETE CASCADE,
    score INT NOT NULL,
    achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index to make "leaderboard for a game" queries fast
CREATE INDEX idx_scores_game_score
ON scores (game_id, score DESC);
