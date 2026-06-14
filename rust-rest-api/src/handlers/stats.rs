use axum::extract::{Extension, Path};
use axum::http::{HeaderMap, StatusCode};
use axum::Json;
use chrono::{Duration, Local, NaiveDate};
use sqlx::{Pool, Postgres, Row};
use tracing::error;

use crate::middleware::auth::extract_and_verify_token;
use crate::models::vocab::{DayActivity, HomeStats, VocabStats, VocabWithProgress};

pub async fn get_home_stats(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Path(user_id): Path<i32>,
) -> Result<Json<HomeStats>, StatusCode> {
    extract_and_verify_token(&headers, user_id)?;

    sqlx::query("DEALLOCATE ALL").execute(&pool).await.ok();
    let counts = sqlx::query(
        r#"
        SELECT
            COUNT(*)                                                              AS total_vocab,
            COUNT(*) FILTER (WHERE next_review <= NOW())                         AS due_today,
            COUNT(*) FILTER (WHERE box_number = 1)                              AS box1,
            COUNT(*) FILTER (WHERE box_number = 2)                              AS box2,
            COUNT(*) FILTER (WHERE box_number = 3)                              AS box3,
            COUNT(*) FILTER (WHERE box_number = 4)                              AS box4,
            COUNT(*) FILTER (WHERE box_number = 5)                              AS box5,
            COUNT(*) FILTER (WHERE box_number = 1 AND next_review <= NOW())     AS due_box1,
            COUNT(*) FILTER (WHERE box_number = 2 AND next_review <= NOW())     AS due_box2,
            COUNT(*) FILTER (WHERE box_number = 3 AND next_review <= NOW())     AS due_box3,
            COUNT(*) FILTER (WHERE box_number = 4 AND next_review <= NOW())     AS due_box4,
            COUNT(*) FILTER (WHERE box_number = 5 AND next_review <= NOW())     AS due_box5
        FROM user_vocab_progress
        WHERE user_id = $1
        "#,
    )
    .bind(user_id)
    .fetch_one(&pool)
    .await
    .map_err(|e| { error!("get_home_stats counts query failed: {e}"); StatusCode::INTERNAL_SERVER_ERROR })?;

    sqlx::query("DEALLOCATE ALL").execute(&pool).await.ok();
    let review_dates: Vec<NaiveDate> = sqlx::query(
        r#"
        SELECT DISTINCT DATE(last_reviewed) AS review_date
        FROM user_vocab_progress
        WHERE user_id = $1 AND last_reviewed IS NOT NULL
        ORDER BY 1 DESC
        "#,
    )
    .bind(user_id)
    .fetch_all(&pool)
    .await
    .map_err(|e| { error!("get_home_stats review_dates query failed: {e}"); StatusCode::INTERNAL_SERVER_ERROR })?
    .into_iter()
    .filter_map(|r| r.try_get::<NaiveDate, _>("review_date").ok())
    .collect();

    let streak_days = calculate_streak(&review_dates);

    Ok(Json(HomeStats {
        total_vocab: counts.try_get("total_vocab").unwrap_or(0),
        due_today:   counts.try_get("due_today").unwrap_or(0),
        box1:        counts.try_get("box1").unwrap_or(0),
        box2:        counts.try_get("box2").unwrap_or(0),
        box3:        counts.try_get("box3").unwrap_or(0),
        box4:        counts.try_get("box4").unwrap_or(0),
        box5:        counts.try_get("box5").unwrap_or(0),
        due_box1:    counts.try_get("due_box1").unwrap_or(0),
        due_box2:    counts.try_get("due_box2").unwrap_or(0),
        due_box3:    counts.try_get("due_box3").unwrap_or(0),
        due_box4:    counts.try_get("due_box4").unwrap_or(0),
        due_box5:    counts.try_get("due_box5").unwrap_or(0),
        streak_days,
    }))
}

pub async fn get_vocab_stats(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Path(user_id): Path<i32>,
) -> Result<Json<VocabStats>, StatusCode> {
    extract_and_verify_token(&headers, user_id)?;

    sqlx::query("DEALLOCATE ALL").execute(&pool).await.ok();
    let counts = sqlx::query(
        r#"
        SELECT
            COUNT(*)                                          AS total_vocab,
            COUNT(*) FILTER (WHERE next_review <= NOW())     AS due_today,
            COUNT(*) FILTER (WHERE box_number = 1)          AS box1,
            COUNT(*) FILTER (WHERE box_number = 2)          AS box2,
            COUNT(*) FILTER (WHERE box_number = 3)          AS box3,
            COUNT(*) FILTER (WHERE box_number = 4)          AS box4,
            COUNT(*) FILTER (WHERE box_number = 5)          AS box5,
            COALESCE(SUM(total_reviews),   0)               AS total_reviews,
            COALESCE(SUM(correct_reviews), 0)               AS correct_reviews
        FROM user_vocab_progress
        WHERE user_id = $1
        "#,
    )
    .bind(user_id)
    .fetch_one(&pool)
    .await
    .map_err(|e| { error!("get_vocab_stats counts query failed: {e}"); StatusCode::INTERNAL_SERVER_ERROR })?;

    let total_reviews: i64   = counts.try_get("total_reviews").unwrap_or(0);
    let correct_reviews: i64 = counts.try_get("correct_reviews").unwrap_or(0);
    let accuracy_pct    = if total_reviews > 0 {
        (correct_reviews * 100) / total_reviews
    } else {
        0
    };

    sqlx::query("DEALLOCATE ALL").execute(&pool).await.ok();
    let heatmap_rows = sqlx::query(
        r#"
        SELECT
            d.day::DATE           AS date,
            COALESCE(rc.count, 0) AS count
        FROM generate_series(
            (CURRENT_DATE - INTERVAL '34 days')::DATE,
            CURRENT_DATE,
            INTERVAL '1 day'
        ) AS d(day)
        LEFT JOIN daily_review_counts rc
            ON rc.review_date = d.day AND rc.user_id = $1
        ORDER BY d.day ASC
        "#,
    )
    .bind(user_id)
    .fetch_all(&pool)
    .await
    .map_err(|e| { error!("get_vocab_stats heatmap query failed: {e}"); StatusCode::INTERNAL_SERVER_ERROR })?;

    let heatmap: Vec<DayActivity> = heatmap_rows
        .into_iter()
        .map(|r| DayActivity {
            date:  r.try_get("date").unwrap_or_default(),
            count: r.try_get("count").unwrap_or(0),
        })
        .collect();

    Ok(Json(VocabStats {
        total_vocab:    counts.try_get("total_vocab").unwrap_or(0),
        due_today:      counts.try_get("due_today").unwrap_or(0),
        box1:           counts.try_get("box1").unwrap_or(0),
        box2:           counts.try_get("box2").unwrap_or(0),
        box3:           counts.try_get("box3").unwrap_or(0),
        box4:           counts.try_get("box4").unwrap_or(0),
        box5:           counts.try_get("box5").unwrap_or(0),
        total_reviews,
        correct_reviews,
        accuracy_pct,
        heatmap,
    }))
}

pub async fn get_user_vocab_list(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Path(user_id): Path<i32>,
) -> Result<Json<Vec<VocabWithProgress>>, StatusCode> {
    extract_and_verify_token(&headers, user_id)?;

    sqlx::query("DEALLOCATE ALL").execute(&pool).await.ok();
    let vocab_list = sqlx::query_as::<_, VocabWithProgress>(
        r#"
        SELECT v.id, v.word, v.definition, v.example_sentence, v.picture_url, v.hint,
               p.id AS progress_id, p.box_number, p.last_reviewed, p.next_review, p.correct_streak
        FROM vocab v
        JOIN user_vocab_progress p ON v.id = p.vocab_id
        WHERE p.user_id = $1
        ORDER BY v.word ASC
        "#,
    )
    .bind(user_id)
    .fetch_all(&pool)
    .await
    .map_err(|e| { error!("get_user_vocab_list query failed: {e}"); StatusCode::INTERNAL_SERVER_ERROR })?;

    Ok(Json(vocab_list))
}

/// Berechnet den aktuellen Lern-Streak aus einer absteigend sortierten
/// Liste von Tagen, an denen der User mindestens eine Vokabel reviewed hat.
pub fn calculate_streak(dates: &[NaiveDate]) -> i64 {
    if dates.is_empty() {
        return 0;
    }

    let today = Local::now().date_naive();
    let most_recent = dates[0];

    if most_recent < today - Duration::days(1) {
        return 0;
    }

    let mut expected = most_recent;
    let mut streak: i64 = 0;

    for &date in dates {
        if date == expected {
            streak += 1;
            expected -= Duration::days(1);
        } else {
            break;
        }
    }

    streak
}
