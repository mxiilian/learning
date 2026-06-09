-- Composite index for the due-vocab query: WHERE user_id = $1 AND next_review <= NOW()
CREATE INDEX idx_uvp_user_next_review
    ON user_vocab_progress (user_id, next_review);

-- Composite index for per-user box lookups
CREATE INDEX idx_uvp_user_box
    ON user_vocab_progress (user_id, box_number);

-- Index for daily review count queries
CREATE INDEX idx_drc_user_date
    ON daily_review_counts (user_id, review_date);

-- Index for public-vocab queries
CREATE INDEX idx_vocab_public
    ON vocab (is_public);
