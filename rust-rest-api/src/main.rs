mod vocab_structs;

use axum::{routing::{get, post}, Extension, Json, Router};
use tracing::{info,Level};
use axum::extract::Path;
use axum::http::StatusCode;
use dotenvy::dotenv;
use serde_json::json;
use sqlx::{Pool, Postgres};
use sqlx::postgres::PgPoolOptions;
use crate::vocab_structs::{CreateVocabStruct, UpdateVocabStruct, VocabStruct};

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    tracing_subscriber::fmt() //Zuständig für Logging (auf dem Level INFO)
        .with_max_level(Level::INFO)
        .init();

    dotenv().ok(); //Lädt die Umgebungsvariablen aus der .env-Datei und stellt Verbindung zur DB her
    let url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPoolOptions::new().connect(&url).await?;
    println!("Connected to the database successfully!");

    //Erzeugt Router und definiert root Pfad
    let app = Router::new()
        .route("/vocab", get(get_vocabs).post(create_vocab))
        .route("/vocab/{id}", get(get_vocab).put(update_vocab).delete(delete_vocab))
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
) {
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
    };
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

