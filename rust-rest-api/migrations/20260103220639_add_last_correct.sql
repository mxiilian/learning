-- Add migration script here
ALTER TABLE vocab
ADD COLUMN last_correct TIMESTAMP;