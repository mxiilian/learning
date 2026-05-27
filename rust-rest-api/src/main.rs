mod vocab_structs;
mod user_structs;

use axum::{routing::{get, post}, Extension, Json, Router};
use axum::extract::Multipart;
use tracing::{info, Level};
use axum::extract::Path;
use axum::http::StatusCode;
use dotenvy::dotenv;
use serde_json::json;
use sqlx::{Pool, Postgres};
use sqlx::postgres::PgPoolOptions;
use crate::vocab_structs::{CreateVocabStruct, UpdateVocabStruct, VocabStruct, VocabWithProgress, HomeStats, VocabStats, DayActivity};
use crate::user_structs::{CreateUserStruct, LoginUserStruct, PublicUserStruct, UserStruct, Claims, VocabProgress, ReviewResult};
use tower_http::cors::{CorsLayer, Any};
use tower_http::services::ServeDir;
use axum::http::{Method, header};
use jsonwebtoken::{encode, EncodingKey, Header};
use axum::http::HeaderMap;
use jsonwebtoken::{decode, DecodingKey, Validation};
use chrono::{Local, NaiveDate, Duration};
use uuid::Uuid;

/*
  Für die Produktion sollte die CORS-Policy restriktiver sein, z.B.:
  .allow_origin("https://deine-app.com".parse::<HeaderValue>().unwrap())
*/

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    tracing_subscriber::fmt()
        .with_max_level(Level::INFO)
        .init();

    dotenv().ok();
    let url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPoolOptions::new().connect(&url).await?;
    println!("Connected to the database successfully!");

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        // 'Any' deckt Authorization in manchen Browsern nicht ab → explizit listen
        .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE]);

    let app = Router::new()
        .route("/", get(root))
        // Vocab: GET liefert public + eigene, POST erfordert Auth
        .route("/vocab", get(get_vocabs).post(create_vocab))
        .route("/vocab/{id}", get(get_vocab).put(update_vocab).delete(delete_vocab))
        // User
        .route("/users", post(create_user))
        .route("/users/login", post(login_user))
        .route("/users/{id}", get(get_user))
        .route("/username/{username}", post(username_exists))
        // Review & Deck
        .route("/users/{id}/review", get(get_due_vocabs).post(submit_review))
        .route("/users/{id}/vocab/{vocab_id}", post(add_vocab_to_user))
        // Home-Statistiken
        .route("/users/{id}/stats", get(get_home_stats))
        // Vokabeln-Übersicht (mit Genauigkeit + Heatmap)
        .route("/users/{id}/vocab-stats", get(get_vocab_stats))
        // Bild-Upload (erfordert Auth) + statische Auslieferung
        .route("/upload/image", post(upload_image))
        .nest_service("/uploads", ServeDir::new("uploads"))
        .layer(cors)
        .layer(Extension(pool));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    info!("Server is running on http://0.0.0.0:3000");
    axum::serve(listener, app).await.unwrap();

    Ok(())
}

async fn root() -> &'static str {
    "Hello, World!"
}

// ---------------------------------------------------------------------------
// Vocab Endpunkte
// ---------------------------------------------------------------------------

/// Gibt alle öffentlichen Vokabeln zurück.
/// Optional: wenn ein Bearer-Token mitgesendet wird, werden auch die eigenen
/// privaten Vokabeln des Users zurückgegeben.
async fn get_vocabs(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
) -> Result<Json<Vec<VocabStruct>>, StatusCode> {
    // Versuche, User-ID aus dem Token zu extrahieren (optional)
    let maybe_user_id = try_extract_user_id(&headers);

    let vocab_list = match maybe_user_id {
        Some(user_id) => {
            // Öffentliche ODER eigene private Vokabeln
            sqlx::query_as!(
                VocabStruct,
                r#"SELECT id, word, definition, example_sentence, picture_url,
                          hint, is_public, created_by_user_id
                   FROM vocab
                   WHERE is_public = true OR created_by_user_id = $1
                   ORDER BY id"#,
                user_id
            )
            .fetch_all(&pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        }
        None => {
            // Nur öffentliche Vokabeln
            sqlx::query_as!(
                VocabStruct,
                r#"SELECT id, word, definition, example_sentence, picture_url,
                          hint, is_public, created_by_user_id
                   FROM vocab
                   WHERE is_public = true
                   ORDER BY id"#
            )
            .fetch_all(&pool)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        }
    };

    Ok(Json(vocab_list))
}

async fn get_vocab(
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
async fn create_vocab(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Json(new_vocab): Json<CreateVocabStruct>,
) -> Result<Json<VocabStruct>, StatusCode> {
    let claims = extract_claims(&headers)?;

    // Nur Admins dürfen is_public = true setzen
    let is_public = if new_vocab.is_public && claims.is_admin {
        true
    } else {
        false
    };

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

async fn update_vocab(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Path(id): Path<i32>,
    Json(updated_vocab): Json<UpdateVocabStruct>,
) -> Result<Json<VocabStruct>, StatusCode> {
    let claims = extract_claims(&headers)?;

    // Prüfe, ob der User Eigentümer ist oder Admin
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

async fn delete_vocab(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Path(id): Path<i32>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let claims = extract_claims(&headers)?;

    // Prüfe Ownership
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

// ---------------------------------------------------------------------------
// User Endpunkte
// ---------------------------------------------------------------------------

async fn create_user(
    Extension(pool): Extension<Pool<Postgres>>,
    Json(new_user): Json<CreateUserStruct>,
) -> Result<Json<UserStruct>, StatusCode> {
    let hashed_password = bcrypt::hash(&new_user.password, 10)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let user = sqlx::query_as!(
        UserStruct,
        r#"INSERT INTO user_accounts (username, password_hash)
           VALUES ($1, $2)
           RETURNING id, username, password_hash, created_at, is_admin"#,
        new_user.username,
        hashed_password,
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(user))
}

async fn login_user(
    Extension(pool): Extension<Pool<Postgres>>,
    Json(login_user): Json<LoginUserStruct>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let user = sqlx::query_as!(
        UserStruct,
        r#"SELECT id, username, password_hash, created_at, is_admin
           FROM user_accounts WHERE username = $1"#,
        login_user.username,
    )
    .fetch_optional(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    match user {
        Some(user) => {
            let valid = bcrypt::verify(&login_user.password, &user.password_hash)
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

            if valid {
                let expiry = chrono::Utc::now()
                    .checked_add_signed(chrono::Duration::days(7))
                    .unwrap()
                    .timestamp() as usize;

                let claims = Claims {
                    sub: user.id,
                    exp: expiry,
                    is_admin: user.is_admin,
                };
                let secret = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");
                let token = encode(
                    &Header::default(),
                    &claims,
                    &EncodingKey::from_secret(secret.as_bytes()),
                )
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

                Ok(Json(json!({
                    "status": "success",
                    "token": token,
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "createdAt": user.created_at,
                        "isAdmin": user.is_admin
                    }
                })))
            } else {
                Ok(Json(json!({
                    "status": "error",
                    "message": "Invalid username or password"
                })))
            }
        }
        None => Ok(Json(json!({
            "status": "error",
            "message": "Invalid username or password"
        }))),
    }
}

async fn get_user(
    Extension(pool): Extension<Pool<Postgres>>,
    Path(id): Path<i32>,
) -> Result<Json<PublicUserStruct>, StatusCode> {
    let user = sqlx::query_as!(
        PublicUserStruct,
        r#"SELECT id, username, created_at, is_admin
           FROM user_accounts WHERE id = $1"#,
        id
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::NOT_FOUND)?;

    Ok(Json(user))
}

async fn username_exists(
    Extension(pool): Extension<Pool<Postgres>>,
    Path(username): Path<String>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let result = sqlx::query!(
        "SELECT id FROM user_accounts WHERE username = $1",
        username
    )
    .fetch_optional(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    match result {
        Some(_) => Ok(Json(json!({ "exists": true }))),
        None => Ok(Json(json!({ "exists": false }))),
    }
}

// ---------------------------------------------------------------------------
// Review Endpunkte
// ---------------------------------------------------------------------------

async fn submit_review(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Path(user_id): Path<i32>,
    Json(result): Json<ReviewResult>,
) -> Result<Json<VocabProgress>, StatusCode> {
    extract_and_verify_token(&headers, user_id)?;

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

    // Tageszähler für Heatmap aktualisieren (INSERT ... ON CONFLICT DO UPDATE)
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

async fn get_due_vocabs(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Path(user_id): Path<i32>,
) -> Result<Json<Vec<VocabWithProgress>>, StatusCode> {
    extract_and_verify_token(&headers, user_id)?;

    let due_vocabs = sqlx::query_as!(
        VocabWithProgress,
        r#"
        SELECT v.id, v.word, v.definition, v.example_sentence, v.picture_url,
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

async fn add_vocab_to_user(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Path((user_id, vocab_id)): Path<(i32, i32)>,
) -> Result<Json<VocabProgress>, StatusCode> {
    extract_and_verify_token(&headers, user_id)?;

    let progress = sqlx::query_as!(
        VocabProgress,
        r#"
        INSERT INTO user_vocab_progress (user_id, vocab_id, box_number, next_review, correct_streak)
        VALUES ($1, $2, 1, NOW() + INTERVAL '1 day', 0)
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

// ---------------------------------------------------------------------------
// Home-Stats Endpunkt
// ---------------------------------------------------------------------------

async fn get_home_stats(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Path(user_id): Path<i32>,
) -> Result<Json<HomeStats>, StatusCode> {
    extract_and_verify_token(&headers, user_id)?;

    // Gesamt + fällig
    let counts = sqlx::query!(
        r#"
        SELECT
            COUNT(*)                                         AS total_vocab,
            COUNT(*) FILTER (WHERE next_review <= NOW())    AS due_today,
            COUNT(*) FILTER (WHERE box_number = 1)         AS box1,
            COUNT(*) FILTER (WHERE box_number = 2)         AS box2,
            COUNT(*) FILTER (WHERE box_number = 3)         AS box3,
            COUNT(*) FILTER (WHERE box_number = 4)         AS box4,
            COUNT(*) FILTER (WHERE box_number = 5)         AS box5
        FROM user_vocab_progress
        WHERE user_id = $1
        "#,
        user_id
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // Streak: alle Tage an denen reviewed wurde, neuester zuerst
    let review_dates: Vec<NaiveDate> = sqlx::query_scalar!(
        r#"
        SELECT DISTINCT DATE(last_reviewed)
        FROM user_vocab_progress
        WHERE user_id = $1 AND last_reviewed IS NOT NULL
        ORDER BY 1 DESC
        "#,
        user_id
    )
    .fetch_all(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
    .into_iter()
    .flatten()
    .collect();

    let streak_days = calculate_streak(&review_dates);

    Ok(Json(HomeStats {
        total_vocab: counts.total_vocab.unwrap_or(0),
        due_today: counts.due_today.unwrap_or(0),
        box1: counts.box1.unwrap_or(0),
        box2: counts.box2.unwrap_or(0),
        box3: counts.box3.unwrap_or(0),
        box4: counts.box4.unwrap_or(0),
        box5: counts.box5.unwrap_or(0),
        streak_days,
    }))
}

// ---------------------------------------------------------------------------
// Vokabeln-Statistiken (Genauigkeit + Heatmap)
// ---------------------------------------------------------------------------

async fn get_vocab_stats(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,
    Path(user_id): Path<i32>,
) -> Result<Json<VocabStats>, StatusCode> {
    extract_and_verify_token(&headers, user_id)?;

    // Box-Verteilung + Gesamt + fällig + Genauigkeit
    let counts = sqlx::query!(
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
        user_id
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let total_reviews   = counts.total_reviews.unwrap_or(0);
    let correct_reviews = counts.correct_reviews.unwrap_or(0);
    let accuracy_pct    = if total_reviews > 0 {
        (correct_reviews * 100) / total_reviews
    } else {
        0
    };

    // Heatmap: letzte 35 Tage (5 Wochen), älteste zuerst
    // Tage ohne Eintrag werden als count = 0 zurückgegeben
    let heatmap_rows = sqlx::query!(
        r#"
        SELECT
            d.day::DATE           AS "date!: NaiveDate",
            COALESCE(rc.count, 0) AS "count!: i64"
        FROM generate_series(
            (CURRENT_DATE - INTERVAL '34 days')::DATE,
            CURRENT_DATE,
            INTERVAL '1 day'
        ) AS d(day)
        LEFT JOIN daily_review_counts rc
            ON rc.review_date = d.day AND rc.user_id = $1
        ORDER BY d.day ASC
        "#,
        user_id
    )
    .fetch_all(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let heatmap: Vec<DayActivity> = heatmap_rows
        .into_iter()
        .map(|r| DayActivity { date: r.date, count: r.count })
        .collect();

    Ok(Json(VocabStats {
        total_vocab:    counts.total_vocab.unwrap_or(0),
        due_today:      counts.due_today.unwrap_or(0),
        box1:           counts.box1.unwrap_or(0),
        box2:           counts.box2.unwrap_or(0),
        box3:           counts.box3.unwrap_or(0),
        box4:           counts.box4.unwrap_or(0),
        box5:           counts.box5.unwrap_or(0),
        total_reviews,
        correct_reviews,
        accuracy_pct,
        heatmap,
    }))
}

/// Berechnet den aktuellen Lern-Streak aus einer absteigend sortierten
/// Liste von Tagen, an denen der User mindestens eine Vokabel reviewed hat.
fn calculate_streak(dates: &[NaiveDate]) -> i64 {
    if dates.is_empty() {
        return 0;
    }

    let today = Local::now().date_naive();
    let most_recent = dates[0];

    // Wenn der letzte Review-Tag weder heute noch gestern ist, ist der Streak 0
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

// ---------------------------------------------------------------------------
// Bild-Upload
// ---------------------------------------------------------------------------

/// Nimmt ein multipart/form-data Feld namens "image" entgegen,
/// speichert es unter uploads/<uuid>.<ext> und gibt die URL zurück.
async fn upload_image(
    headers: HeaderMap,
    mut multipart: Multipart,
) -> Result<Json<serde_json::Value>, StatusCode> {
    extract_claims(&headers)?; // Requires auth

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

// ---------------------------------------------------------------------------
// Auth-Hilfsfunktionen
// ---------------------------------------------------------------------------

/// Extrahiert und verifiziert den JWT und prüft ob er zum angegebenen user_id passt.
fn extract_and_verify_token(headers: &HeaderMap, user_id: i32) -> Result<(), StatusCode> {
    let claims = extract_claims(headers)?;
    if claims.sub != user_id {
        return Err(StatusCode::FORBIDDEN);
    }
    Ok(())
}

/// Dekodiert den JWT und gibt die Claims zurück.
fn extract_claims(headers: &HeaderMap) -> Result<Claims, StatusCode> {
    let auth_header = headers
        .get("Authorization")
        .and_then(|v| v.to_str().ok())
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let secret = std::env::var("JWT_SECRET").unwrap();
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    )
    .map_err(|_| StatusCode::UNAUTHORIZED)?;

    Ok(token_data.claims)
}

/// Versucht, die User-ID aus einem optionalen Bearer-Token zu lesen.
/// Gibt None zurück wenn kein / ungültiger Token vorhanden ist.
fn try_extract_user_id(headers: &HeaderMap) -> Option<i32> {
    extract_claims(headers).ok().map(|c| c.sub)
}
