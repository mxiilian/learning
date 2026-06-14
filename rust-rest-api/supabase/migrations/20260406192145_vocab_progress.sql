-- Die bestehende vocab-Tabelle bleibt, last_correct raus (gehört jetzt in progress)
ALTER TABLE vocab DROP COLUMN IF EXISTS last_correct;

-- Lernfortschritt pro Nutzer+Vokabel
CREATE TABLE user_vocab_progress (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
    vocab_id        INT NOT NULL REFERENCES vocab(id) ON DELETE CASCADE,
    box_number      SMALLINT NOT NULL DEFAULT 1 CHECK (box_number BETWEEN 1 AND 5),
    last_reviewed   TIMESTAMP,
    next_review     TIMESTAMP NOT NULL DEFAULT NOW(),
    correct_streak  INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP DEFAULT NOW(),

    UNIQUE (user_id, vocab_id)  -- Ein Nutzer hat pro Vokabel genau einen Eintrag
);