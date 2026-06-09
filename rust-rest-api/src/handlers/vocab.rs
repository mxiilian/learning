use axum::extract::{Extension, Multipart, Path, Query};
use axum::http::{HeaderMap, StatusCode};
use axum::Json;
use serde::Deserialize;
use serde_json::json;
use sqlx::{Pool, Postgres};
use uuid::Uuid;

use crate::middleware::auth::{extract_claims, try_extract_user_id};
use crate::models::vocab::{CreateVocabStruct, PaginatedVocab, UpdateVocabStruct, VocabStruct};

#[derive(Deserialize)]
pub struct PaginationParams {
    pub page: Option<i64>,
    pub limit: Option<i64>,
}

pub async fn get_vocabs(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Query(params): Query<PaginationParams>,
) -> Result<Json<PaginatedVocab>, StatusCode> {
    let page = params.page.unwrap_or(1).max(1);
    let limit = params.limit.unwrap_or(20).clamp(1, 100);
    let offset = (page - 1) * limit;

    let maybe_user_id = try_extract_user_id(&headers);

    let (items, total) = match maybe_user_id {
        Some(user_id) => {
            let items = sqlx::query_as!(
                VocabStruct,
                r#"SELECT id, word, definition, example_sentence, picture_url,
                          hint, is_public, created_by_user_id
                   FROM vocab
                   WHERE is_public = true OR created_by_user_id = $1
                   ORDER BY id
                   LIMIT $2 OFFSET $3"#,
                user_id, limit, offset
            )
            .fetch_all(&pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

            let total = sqlx::query_scalar!(
                "SELECT COUNT(*) FROM vocab WHERE is_public = true OR created_by_user_id = $1",
                user_id
            )
            .fetch_one(&pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
            .unwrap_or(0);

            (items, total)
        }
        None => {
            let items = sqlx::query_as!(
                VocabStruct,
                r#"SELECT id, word, definition, example_sentence, picture_url,
                          hint, is_public, created_by_user_id
                   FROM vocab
                   WHERE is_public = true
                   ORDER BY id
                   LIMIT $1 OFFSET $2"#,
                limit, offset
            )
            .fetch_all(&pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

            let total = sqlx::query_scalar!("SELECT COUNT(*) FROM vocab WHERE is_public = true")
                .fetch_one(&pool)
                .await
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
                .unwrap_or(0);

            (items, total)
        }
    };

    Ok(Json(PaginatedVocab { items, total, page, limit }))
}

pub async fn get_vocab(
    Extension(pool): Extension<Pool<Postgres>>,
    Path(id): Path<i32>,
) -> Result<Json<VocabStruct>, StatusCode> {
    let vocab = sqlx::query_as!(
        VocabStruct,
        r#"SELECT id, word, definition, example_sentence, picture_url,
                  hint, is_public, created_by_user_id
           FROM vocab WHERE id = $1"#,
        id
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::NOT_FOUND)?;

    Ok(Json(vocab))
}

/// Erstellt eine neue Vokabel.
/// - Requires Auth (JWT)
/// - is_public = true nur erlaubt wenn User ein Admin ist
pub async fn create_vocab(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Json(new_vocab): Json<CreateVocabStruct>,
) -> Result<Json<VocabStruct>, StatusCode> {
    let claims = extract_claims(&headers)?;

    if new_vocab.word.trim().is_empty() || new_vocab.word.len() > 255 {
        return Err(StatusCode::UNPROCESSABLE_ENTITY);
    }
    if new_vocab.definition.trim().is_empty() || new_vocab.definition.len() > 2000 {
        return Err(StatusCode::UNPROCESSABLE_ENTITY);
    }
    if new_vocab.example_sentence.as_deref().map(|s| s.len() > 2000).unwrap_or(false) {
        return Err(StatusCode::UNPROCESSABLE_ENTITY);
    }
    if new_vocab.hint.as_deref().map(|h| h.len() > 500).unwrap_or(false) {
        return Err(StatusCode::UNPROCESSABLE_ENTITY);
    }

    let is_public = new_vocab.is_public && claims.is_admin;

    let vocab = sqlx::query_as!(
        VocabStruct,
        r#"INSERT INTO vocab (word, definition, example_sentence, picture_url,
                              hint, created_by_user_id, is_public)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id, word, definition, example_sentence, picture_url,
                     hint, is_public, created_by_user_id"#,
        new_vocab.word,
        new_vocab.definition,
        new_vocab.example_sentence,
        new_vocab.picture_url,
        new_vocab.hint,
        claims.sub,
        is_public,
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(vocab))
}

pub async fn update_vocab(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Path(id): Path<i32>,
    Json(updated_vocab): Json<UpdateVocabStruct>,
) -> Result<Json<VocabStruct>, StatusCode> {
    let claims = extract_claims(&headers)?;

    if updated_vocab.word.as_deref().map(|w| w.trim().is_empty() || w.len() > 255).unwrap_or(false) {
        return Err(StatusCode::UNPROCESSABLE_ENTITY);
    }
    if updated_vocab.definition.as_deref().map(|d| d.trim().is_empty() || d.len() > 2000).unwrap_or(false) {
        return Err(StatusCode::UNPROCESSABLE_ENTITY);
    }
    if updated_vocab.example_sentence.as_deref().map(|s| s.len() > 2000).unwrap_or(false) {
        return Err(StatusCode::UNPROCESSABLE_ENTITY);
    }
    if updated_vocab.hint.as_deref().map(|h| h.len() > 500).unwrap_or(false) {
        return Err(StatusCode::UNPROCESSABLE_ENTITY);
    }

    let existing = sqlx::query!(
        "SELECT created_by_user_id, is_public FROM vocab WHERE id = $1",
        id
    )
    .fetch_optional(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
    .ok_or(StatusCode::NOT_FOUND)?;

    let is_owner = existing.created_by_user_id == Some(claims.sub);
    if !is_owner && !claims.is_admin {
        return Err(StatusCode::FORBIDDEN);
    }

    let vocab = sqlx::query_as!(
        VocabStruct,
        r#"UPDATE vocab
           SET word              = COALESCE($1, word),
               definition        = COALESCE($2, definition),
               example_sentence  = COALESCE($3, example_sentence),
               picture_url       = COALESCE($4, picture_url),
               hint              = COALESCE($5, hint)
           WHERE id = $6
           RETURNING id, word, definition, example_sentence, picture_url,
                     hint, is_public, created_by_user_id"#,
        updated_vocab.word,
        updated_vocab.definition,
        updated_vocab.example_sentence,
        updated_vocab.picture_url,
        updated_vocab.hint,
        id,
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::NOT_FOUND)?;

    Ok(Json(vocab))
}

pub async fn delete_vocab(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Path(id): Path<i32>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let claims = extract_claims(&headers)?;

    let existing = sqlx::query!(
        "SELECT created_by_user_id FROM vocab WHERE id = $1",
        id
    )
    .fetch_optional(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
    .ok_or(StatusCode::NOT_FOUND)?;

    let is_owner = existing.created_by_user_id == Some(claims.sub);
    if !is_owner && !claims.is_admin {
        return Err(StatusCode::FORBIDDEN);
    }

    sqlx::query!("DELETE FROM vocab WHERE id = $1", id)
        .execute(&pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(json!({
        "status": "success",
        "message": format!("Vocabulary with id {} deleted successfully", id)
    })))
}

/// Nimmt ein multipart/form-data Feld namens "image" entgegen,
/// speichert es unter uploads/<uuid>.<ext> und gibt die URL zurück.
pub async fn upload_image(
    headers: HeaderMap,
    mut multipart: Multipart,
) -> Result<Json<serde_json::Value>, StatusCode> {
    extract_claims(&headers)?;

    tokio::fs::create_dir_all("uploads")
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|_| StatusCode::BAD_REQUEST)?
    {
        if field.name() != Some("image") { continue; }

        let content_type = field
            .content_type()
            .map(|ct| ct.to_string())
            .unwrap_or_else(|| "image/jpeg".to_string());

        let ext = match content_type.as_str() {
            "image/png"  => "png",
            "image/webp" => "webp",
            "image/gif"  => "gif",
            _            => "jpg",
        };

        let filename = format!("{}.{}", Uuid::new_v4(), ext);
        let path     = format!("uploads/{filename}");
        let url      = format!("/uploads/{filename}");

        let bytes = field.bytes().await.map_err(|_| StatusCode::BAD_REQUEST)?;
        tokio::fs::write(&path, &bytes)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        return Ok(Json(json!({ "url": url })));
    }

    Err(StatusCode::BAD_REQUEST)
}
