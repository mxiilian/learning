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
use crate::vocab_structs::{CreateVocabStruct, UpdateVocabStruct, VocabStruct};
use crate::user_structs::{CreateUserStruct, LoginUserStruct, PublicUserStruct, UserStruct};
use tower_http::cors::{CorsLayer, Any};
use axum::http::Method;


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
        "SELECT id, word, definition, example_sentence, picture_url ,last_correct FROM vocab"
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
        "SELECT id, word, definition, example_sentence, picture_url, last_correct FROM vocab WHERE id = $1",
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
        "INSERT INTO vocab (word, definition, example_sentence, picture_url, last_correct) VALUES ($1, $2, $3, $4, $5) RETURNING id, word, definition, example_sentence, picture_url, last_correct",
        new_vocab.word,
        new_vocab.definition,
        new_vocab.example_sentence,
        new_vocab.picture_url,
        new_vocab.last_correct,
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
        "UPDATE vocab SET word = COALESCE($1, word), definition = COALESCE($2, definition), example_sentence = COALESCE($3, example_sentence), picture_url = COALESCE($4, picture_url), last_correct = COALESCE($5, last_correct) WHERE id = $6 RETURNING id, word, definition, example_sentence, picture_url, last_correct",
        //COALESCE sorgt dafür, dass wenn der Wert NULL ist, der alte Wert beibehalten wird
        updated_vocab.word,
        updated_vocab.definition,
        updated_vocab.example_sentence,
        updated_vocab.picture_url,
        updated_vocab.last_correct,
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
                 Ok(Json(json!({
                    "status": "success",
                    "message": format!("User '{}' logged in successfully", user.username),
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