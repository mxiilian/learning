-- Add migration script here
CREATE TABLE vocab  (
    id SERIAL PRIMARY KEY,
    word VARCHAR(255) NOT NULL,
    definition TEXT NOT NULL,
    example_sentence TEXT,
    picture_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT NOW()
);