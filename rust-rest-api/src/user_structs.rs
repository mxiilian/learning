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