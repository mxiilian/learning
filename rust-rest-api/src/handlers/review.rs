use axum::extract::{Extension, Path};
use axum::http::{HeaderMap, StatusCode};
use axum::Json;
use sqlx::{Pool, Postgres};

use crate::middleware::auth::extract_and_verify_token;
use crate::models::user::{ReviewResult, VocabProgress};
use crate::models::vocab::VocabWithProgress;

pub async fn submit_review(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Path(user_id): Path<i32>,
    Json(result): Json<ReviewResult>,
) -> Result<Json<VocabProgress>, StatusCode> {
    extract_and_verify_token(&headers, user_id)?;

    sqlx::query("DEALLOCATE ALL").execute(&pool).await.ok();
    let progress = sqlx::query_as!(
        VocabProgress,
        r#"
        UPDATE user_vocab_progress
        SET
            box_number      = CASE
                                WHEN $1 THEN LEAST(box_number + 1, 5)
                                ELSE 1
                              END,
            correct_streak  = CASE WHEN $1 THEN correct_streak + 1 ELSE 0 END,
            last_reviewed   = NOW(),
            next_review     = CASE
                                WHEN $1 THEN NOW() + (
                                    CASE LEAST(box_number + 1, 5)
                                        WHEN 1 THEN INTERVAL '1 day'
                                        WHEN 2 THEN INTERVAL '3 days'
                                        WHEN 3 THEN INTERVAL '7 days'
                                        WHEN 4 THEN INTERVAL '14 days'
                                        WHEN 5 THEN INTERVAL '30 days'
                                    END
                                )
                                ELSE NOW() + INTERVAL '1 day'
                              END,
            total_reviews   = total_reviews + 1,
            correct_reviews = correct_reviews + CASE WHEN $1 THEN 1 ELSE 0 END
        WHERE user_id = $2 AND vocab_id = $3
        RETURNING id, user_id, vocab_id, box_number, last_reviewed, next_review, correct_streak
        "#,
        result.correct,
        user_id,
        result.vocab_id,
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::NOT_FOUND)?;

    sqlx::query("DEALLOCATE ALL").execute(&pool).await.ok();
    sqlx::query!(
        r#"
        INSERT INTO daily_review_counts (user_id, review_date, count)
        VALUES ($1, CURRENT_DATE, 1)
        ON CONFLICT (user_id, review_date)
        DO UPDATE SET count = daily_review_counts.count + 1
        "#,
        user_id,
    )
    .execute(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(progress))
}

pub async fn get_due_vocabs(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Path(user_id): Path<i32>,
) -> Result<Json<Vec<VocabWithProgress>>, StatusCode> {
    extract_and_verify_token(&headers, user_id)?;

    sqlx::query("DEALLOCATE ALL").execute(&pool).await.ok();
    let due_vocabs = sqlx::query_as!(
        VocabWithProgress,
        r#"
        SELECT v.id, v.word, v.definition, v.example_sentence, v.picture_url, v.hint,
               p.id as progress_id, p.box_number, p.last_reviewed, p.next_review, p.correct_streak
        FROM vocab v
        JOIN user_vocab_progress p ON v.id = p.vocab_id
        WHERE p.user_id = $1 AND p.next_review <= NOW()
        ORDER BY p.next_review ASC
        "#,
        user_id
    )
    .fetch_all(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(due_vocabs))
}

pub async fn add_vocab_to_user(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Path((user_id, vocab_id)): Path<(i32, i32)>,
) -> Result<Json<VocabProgress>, StatusCode> {
    extract_and_verify_token(&headers, user_id)?;

    sqlx::query("DEALLOCATE ALL").execute(&pool).await.ok();
    let progress = sqlx::query_as!(
        VocabProgress,
        r#"
        INSERT INTO user_vocab_progress (user_id, vocab_id, box_number, next_review, correct_streak)
        VALUES ($1, $2, 1, NOW(), 0)
        RETURNING id, user_id, vocab_id, box_number, last_reviewed, next_review, correct_streak
        "#,
        user_id,
        vocab_id,
    )
    .fetch_one(&pool)
    .await
    .map_err(|e| match e {
        sqlx::Error::Database(db_err)
            if db_err.constraint() == Some("user_vocab_progress_user_id_vocab_id_key") =>
        {
            StatusCode::CONFLICT
        }
        _ => StatusCode::INTERNAL_SERVER_ERROR,
    })?;

    Ok(Json(progress))
}
