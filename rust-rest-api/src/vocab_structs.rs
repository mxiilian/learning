use serde::{Deserialize, Serialize};
use sqlx::types::chrono::NaiveDateTime;

#[derive(Serialize, Deserialize)] //Damit wir es von und zu JSON umwandeln können
#[serde(rename_all = "camelCase")]
pub struct CreateVocabStruct {
    pub word: String,
    pub definition: String,
    pub example_sentence: Option<String>, //weil diese Spalte NULL-Werte enthalten kann
    pub picture_url: Option<String>, //weil diese Spalte NULL-Werte enthalten kann
    pub last_correct: Option<NaiveDateTime>,
}
#[derive(Serialize, Deserialize)] //Damit wir es von und zu JSON umwandeln können
#[serde(rename_all = "camelCase")]
pub struct VocabStruct {
    pub id: i32,
    pub word: String,
    pub definition: String,
    pub example_sentence: Option<String>, //weil diese Spalte NULL-Werte enthalten kann
    pub picture_url: Option<String>, //weil diese Spalte NULL-Werte enthalten kann
    pub last_correct: Option<NaiveDateTime>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateVocabStruct {
    pub word: Option<String>,
    pub definition: Option<String>,
    pub example_sentence: Option<String>,
    pub picture_url: Option<String>,
    pub last_correct: Option<NaiveDateTime>,
}