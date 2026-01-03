use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)] //Damit wir es von und zu JSON umwandeln können
pub struct VocabStruct {
    pub id: i32,
    pub word: String,
    pub definition: String,
    pub example_sentence: Option<String>, //weil diese Spalte NULL-Werte enthalten kann
    pub picture_url: Option<String>, //weil diese Spalte NULL-Werte enthalten kann
}

#[derive(Serialize, Deserialize)]
pub struct UpdateVocabStruct {
    pub word: Option<String>,
    pub definition: Option<String>,
    pub example_sentence: Option<String>,
    pub picture_url: Option<String>,
}