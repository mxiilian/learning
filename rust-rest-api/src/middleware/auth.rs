use std::sync::OnceLock;

use axum::http::{HeaderMap, StatusCode};
use jsonwebtoken::{decode, DecodingKey, Validation};

use crate::models::user::Claims;

static JWT_SECRET: OnceLock<String> = OnceLock::new();

pub fn init_jwt_secret(secret: String) {
    JWT_SECRET.set(secret).expect("JWT_SECRET already initialized");
}

pub(crate) fn get_jwt_secret() -> &'static str {
    JWT_SECRET.get().expect("JWT_SECRET not initialized")
}

/// Dekodiert den JWT und gibt die Claims zurück.
pub fn extract_claims(headers: &HeaderMap) -> Result<Claims, StatusCode> {
    let auth_header = headers
        .get("Authorization")
        .and_then(|v| v.to_str().ok())
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let secret = get_jwt_secret();
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    )
    .map_err(|_| StatusCode::UNAUTHORIZED)?;

    Ok(token_data.claims)
}

/// Extrahiert und verifiziert den JWT und prüft ob er zum angegebenen user_id passt.
pub fn extract_and_verify_token(headers: &HeaderMap, user_id: i32) -> Result<(), StatusCode> {
    let claims = extract_claims(headers)?;
    if claims.sub != user_id {
        return Err(StatusCode::FORBIDDEN);
    }
    Ok(())
}

/// Versucht, die User-ID aus einem optionalen Bearer-Token zu lesen.
/// Gibt None zurück wenn kein / ungültiger Token vorhanden ist.
pub fn try_extract_user_id(headers: &HeaderMap) -> Option<i32> {
    extract_claims(headers).ok().map(|c| c.sub)
}
