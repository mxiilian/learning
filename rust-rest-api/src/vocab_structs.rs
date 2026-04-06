use serde::{Deserialize, Serialize};
use sqlx::types::chrono::NaiveDateTime;

#[derive(Serialize, Deserialize)] //Damit wir es von und zu JSON umwandeln können
#[serde(rename_all = "camelCase")]
pub struct CreateVocabStruct {
    pub word: String,
    pub definition: String,
    pub example_sentence: Option<String>, //weil diese Spalte NULL-Werte enthalten kann
    pub picture_url: Option<String>, //weil diese Spalte NULL-Werte enthalten kann
}
#[derive(Serialize, Deserialize)] //Damit wir es von und zu JSON umwandeln können
#[serde(rename_all = "camelCase")]
pub struct VocabStruct {
    pub id: i32,
    pub word: String,
    pub definition: String,
    pub example_sentence: Option<String>, //weil diese Spalte NULL-Werte enthalten kann
    pub picture_url: Option<String>, //weil diese Spalte NULL-Werte enthalten kann
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateVocabStruct {
    pub word: Option<String>,
    pub definition: Option<String>,
    pub example_sentence: Option<String>,
    pub picture_url: Option<String>,
}

// In user_structs.rs hinzufügen
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VocabWithProgress {
    // Vocab-Felder
    pub id: i32,
    pub word: String,
    pub definition: String,
    pub example_sentence: Option<String>,
    pub picture_url: Option<String>,
    // Progress-Felder
    pub progress_id: i32,
    pub box_number: i16,
    pub last_reviewed: Option<NaiveDateTime>,
    pub next_review: NaiveDateTime,
    pub correct_streak: i32,
}