use axum::extract::{Extension, Path};
use axum::http::StatusCode;
use axum::Json;
use jsonwebtoken::{encode, EncodingKey, Header};
use serde_json::json;
use sqlx::{Pool, Postgres};

use crate::middleware::auth::get_jwt_secret;
use crate::models::user::{Claims, CreateUserStruct, LoginUserStruct, PublicUserStruct, UserStruct};

pub async fn create_user(
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

pub async fn login_user(
    Extension(pool): Extension<Pool<Postgres>>,
    Json(login_data): Json<LoginUserStruct>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let user = sqlx::query_as!(
        UserStruct,
        r#"SELECT id, username, password_hash, created_at, is_admin
           FROM user_accounts WHERE username = $1"#,
        login_data.username,
    )
    .fetch_optional(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    match user {
        Some(user) => {
            let valid = bcrypt::verify(&login_data.password, &user.password_hash)
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
                let secret = get_jwt_secret();
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

pub async fn get_user(
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

pub async fn username_exists(
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
