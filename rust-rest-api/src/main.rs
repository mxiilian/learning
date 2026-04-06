mod vocab_structs;
mod user_structs;
use axum::{routing::{get, post}, Extension, Json, Router};
use tracing::{info,Level};
use axum::extract::Path;
use axum::http::StatusCode;
use dotenvy::dotenv;
use serde_json::json;
use sqlx::{Pool, Postgres};
use sqlx::postgres::PgPoolOptions;
use crate::vocab_structs::{CreateVocabStruct, UpdateVocabStruct, VocabStruct, VocabWithProgress};
use crate::user_structs::{CreateUserStruct, LoginUserStruct, PublicUserStruct, UserStruct, Claims, VocabProgress, ReviewResult};
use tower_http::cors::{CorsLayer, Any};
use axum::http::Method;
use jsonwebtoken::{encode, EncodingKey, Header};
use axum::http::HeaderMap;
use jsonwebtoken::{decode, DecodingKey, Validation};


/*
Für die Produktion sollte die CORS-Policy restriktiver sein, z.B. nur die spezifische Domain erlauben:
use axum::http::HeaderValue;

.allow_origin("https://deine-app.com".parse::<HeaderValue>().unwrap())
*/


#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    tracing_subscriber::fmt() //Zuständig für Logging (auf dem Level INFO)
        .with_max_level(Level::INFO)
        .init();

    dotenv().ok(); //Lädt die Umgebungsvariablen aus der .env-Datei und stellt Verbindung zur DB her
    let url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPoolOptions::new().connect(&url).await?;
    println!("Connected to the database successfully!");

    let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
    .allow_headers(Any);

    //Erzeugt Router und definiert root Pfad
    let app = Router::new()
        .route("/", get(root))
        .route("/vocab", get(get_vocabs).post(create_vocab))
        .route("/vocab/{id}", get(get_vocab).put(update_vocab).delete(delete_vocab))
        .route("/users", post(create_user))
        .route("/users/login", post(login_user))
        .route("/users/{id}", get(get_user))
        .route("/username/{username}", post(username_exists))
        .route("/users/{id}/review", get(get_due_vocabs))
        .route("/users/{id}/review", post(submit_review))
        .route("/users/{id}/vocab/{vocab_id}", post(add_vocab_to_user))
        .layer(cors)
        .layer(Extension(pool));

    //Bindet den Server an Port 5000 und startet ihn
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    info!("Server is running on http://0.0.0.0:3000");

    
    axum::serve(listener, app).await.unwrap();

    Ok(())
}

//defniert die root Route GET
async fn root() -> &'static str {
    "Hello, World!"
}

async fn get_vocabs(
    Extension(pool): Extension<Pool<Postgres>>,
) -> Result<Json<Vec<VocabStruct>>, StatusCode> {
    let vocab_list = sqlx::query_as!(
        VocabStruct,
        "SELECT id, word, definition, example_sentence, picture_url FROM vocab"
    )
    .fetch_all(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(vocab_list))
}

async fn get_vocab(
    Extension(pool): Extension<Pool<Postgres>>,
    Path(id): Path<i32>,
) -> Result<Json<VocabStruct>, StatusCode> {
    let vocab = sqlx::query_as!(
        VocabStruct,
        "SELECT id, word, definition, example_sentence, picture_url FROM vocab WHERE id = $1",
        id
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::NOT_FOUND)?;
    Ok(Json(vocab))
}

async fn create_vocab(
    Extension(pool): Extension<Pool<Postgres>>,
    Json(new_vocab): Json<CreateVocabStruct>,
) -> Result<Json<VocabStruct>, StatusCode>{
    let vocab = sqlx::query_as!(
        VocabStruct,
        "INSERT INTO vocab (word, definition, example_sentence, picture_url) VALUES ($1, $2, $3, $4) RETURNING id, word, definition, example_sentence, picture_url",
        new_vocab.word,
        new_vocab.definition,
        new_vocab.example_sentence,
        new_vocab.picture_url,
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
    Ok(Json(vocab))
}

async fn update_vocab(
    Extension(pool): Extension<Pool<Postgres>>,
    Path(id): Path<i32>,
    Json(updated_vocab): Json<UpdateVocabStruct>,
) -> Result<Json<VocabStruct>, StatusCode> {
    let vocab = sqlx::query_as!(
        VocabStruct,
        "UPDATE vocab SET word = COALESCE($1, word), definition = COALESCE($2, definition), example_sentence = COALESCE($3, example_sentence), picture_url = COALESCE($4, picture_url) WHERE id = $5 RETURNING id, word, definition, example_sentence, picture_url",
        //COALESCE sorgt dafür, dass wenn der Wert NULL ist, der alte Wert beibehalten wird
        updated_vocab.word,
        updated_vocab.definition,
        updated_vocab.example_sentence,
        updated_vocab.picture_url,
        id,
    )
    .fetch_one(&pool)
    .await;
    
    match vocab {
        Ok(vocab) => Ok(Json(vocab)),
        Err(_) => Err(StatusCode::NOT_FOUND),
    }
}

async fn delete_vocab(
    Extension(pool): Extension<Pool<Postgres>>,
    Path(id): Path<i32>,
) -> Result<Json<serde_json::Value>,StatusCode> {
    let result = sqlx::query!(
        "DELETE FROM vocab WHERE id = $1",
        id
    )
    .execute(&pool)
    .await;

    match result {
        Ok(_) => Ok(Json(json!({
            "status": "success",
            "message": format!("Vocabulary with id {} deleted successfully", id)
        }))),
        Err(_) => Err(StatusCode::NOT_FOUND),
    }
}

async fn create_user(
    Extension(pool): Extension<Pool<Postgres>>,
    Json(new_user): Json<CreateUserStruct>,
) -> Result<Json<UserStruct>, StatusCode> {
     let hashed_password = bcrypt::hash(&new_user.password, 10)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let user = sqlx::query_as!(
        UserStruct,
        "INSERT INTO user_accounts (username, password_hash) VALUES ($1, $2) RETURNING id, username, password_hash, created_at",
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
        "SELECT id, username, password_hash, created_at FROM user_accounts WHERE username = $1",
        login_user.username,
    )
    .fetch_optional(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    match user {
        Some(user) =>{

            let valid = bcrypt::verify(&login_user.password, &user.password_hash)
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

            if valid {
                let expiry = chrono::Utc::now()
                    .checked_add_signed(chrono::Duration::days(7))
                    .unwrap()
                    .timestamp() as usize;
                let claims = Claims { sub: user.id, exp: expiry };
                let secret = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");

                let token = encode(
                    &Header::default(), 
                    &claims,
                    &EncodingKey::from_secret(secret.as_bytes())
                ).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

                 Ok(Json(json!({
                    "status": "success",
                    "token": token,
                    "user": user
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
        "SELECT id, username, created_at FROM user_accounts WHERE id = $1",
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
        Some(_) => Ok(Json(json!({
            "exists": true,
            "message": format!("Username '{}' already exists", username)
        }))),
        None => Ok(Json(json!({
            "exists": false,
            "message": format!("Username '{}' is available", username)
        }))),
    }
}

async fn submit_review(
    Extension(pool): Extension<Pool<Postgres>>,
    headers: HeaderMap,                        
    Path(user_id): Path<i32>,
    Json(result): Json<ReviewResult>,
) -> Result<Json<VocabProgress>, StatusCode> {
    extract_and_verify_token(&headers, user_id)?;
    // Box hoch oder runter je nach Ergebnis
    let progress = sqlx::query_as!(
        VocabProgress,
        r#"
        UPDATE user_vocab_progress
        SET
            box_number     = CASE 
                                WHEN $1 THEN LEAST(box_number + 1, 5)   -- richtig: Box +1 (max 5)
                                ELSE 1                                   -- falsch:  zurück zu Box 1
                             END,
            correct_streak = CASE WHEN $1 THEN correct_streak + 1 ELSE 0 END,
            last_reviewed  = NOW(),
            next_review    = CASE
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
                             END
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
        sqlx::Error::Database(db_err) if db_err.constraint() == Some("user_vocab_progress_user_id_vocab_id_key") => {
            StatusCode::CONFLICT  // 409
        }
        _ => StatusCode::INTERNAL_SERVER_ERROR,
    })?;

    Ok(Json(progress))
}

fn extract_and_verify_token(headers: &HeaderMap, user_id: i32) -> Result<(), StatusCode> {
    let auth_header = headers
        .get("Authorization")
        .and_then(|v: &axum::http::HeaderValue| v.to_str().ok()) 
        .ok_or(StatusCode::UNAUTHORIZED)?;

    // "Bearer <token>" → "<token>"
    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let secret = std::env::var("JWT_SECRET").unwrap();
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    ).map_err(|_| StatusCode::UNAUTHORIZED)?;

    if token_data.claims.sub != user_id {
        return Err(StatusCode::FORBIDDEN);
    }
    Ok(())
}