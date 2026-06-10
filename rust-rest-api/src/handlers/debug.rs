use axum::extract::{Extension, Path};
use axum::http::{HeaderMap, StatusCode};
use axum::Json;
use serde::Deserialize;
use sqlx::{Pool, Postgres};

use crate::middleware::auth::extract_claims;

#[derive(Deserialize)]
pub struct TimeTravelRequest {
    pub days: i32,
}

/// Verschiebt alle next_review-Daten des Users um `days` Tage in die Vergangenheit.
/// Positiver Wert = in die Zukunft springen (Karten werden früher fällig).
/// Negativer Wert = zurück in die Vergangenheit (Karten werden später fällig).
/// Nur für Admins zugänglich.
pub async fn time_travel(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Path(user_id): Path<i32>,
    Json(req): Json<TimeTravelRequest>,
) -> Result<StatusCode, StatusCode> {
    let claims = extract_claims(&headers)?;
    if claims.sub != user_id || !claims.is_admin {
        return Err(StatusCode::FORBIDDEN);
    }

    sqlx::query!(
        r#"
        UPDATE user_vocab_progress
        SET next_review = next_review - make_interval(days => $1)
        WHERE user_id = $2
        "#,
        req.days,
        user_id,
    )
    .execute(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::NO_CONTENT)
}
