-- Genauigkeits-Tracking: wie oft insgesamt und korrekt beantwortet
ALTER TABLE user_vocab_progress
    ADD COLUMN total_reviews   INT NOT NULL DEFAULT 0,
    ADD COLUMN correct_reviews INT NOT NULL DEFAULT 0;

-- Tägliche Review-Zähler für die Aktivitäts-Heatmap
CREATE TABLE daily_review_counts (
    user_id     INT  NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
    review_date DATE NOT NULL,
    count       INT  NOT NULL DEFAULT 1,
    PRIMARY KEY (user_id, review_date)
);
