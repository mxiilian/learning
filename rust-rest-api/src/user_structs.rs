use serde::{Deserialize, Serialize};
use sqlx::types::chrono::NaiveDateTime;

#[derive(Serialize, Deserialize)] 
#[serde(rename_all = "camelCase")]
pub struct CreateUserStruct {
    pub username: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserStruct {
    pub id: i32,
    pub username: String,
    #[serde(skip_serializing)]  
    pub password_hash: String,
    pub created_at: Option<NaiveDateTime>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LoginUserStruct {
    pub username: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PublicUserStruct {
    pub id: i32,
    pub username: String,
    pub created_at: Option<NaiveDateTime>,
} 

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Claims {
    pub sub: i32,
    pub exp: usize,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VocabProgress {
    pub id: i32,
    pub user_id: i32,
    pub vocab_id: i32,
    pub box_number: i16,
    pub last_reviewed: Option<NaiveDateTime>,
    pub next_review: NaiveDateTime,
    pub correct_streak: i32,
}

// Payload wenn Nutzer eine Antwort gibt
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReviewResult {
    pub vocab_id: i32,
    pub correct: bool,  // hat der Nutzer die Vokabel gewusst?
}