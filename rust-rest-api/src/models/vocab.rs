use serde::{Deserialize, Serialize};
use sqlx::types::chrono::{NaiveDate, NaiveDateTime};

/// Wird vom Client beim Erstellen einer neuen Vokabel geschickt
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateVocabStruct {
    pub word: String,
    pub definition: String,
    pub example_sentence: Option<String>,
    pub picture_url: Option<String>,
    /// Optionaler Gedächtnis-Hinweis (z.B. "rote Frucht")
    pub hint: Option<String>,
    /// Wenn true (nur Admins), ist die Vokabel für alle sichtbar
    #[serde(default)]
    pub is_public: bool,
}

/// Volle Vokabel aus der DB (mit Ownership-Feldern)
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VocabStruct {
    pub id: i32,
    pub word: String,
    pub definition: String,
    pub example_sentence: Option<String>,
    pub picture_url: Option<String>,
    pub hint: Option<String>,
    pub is_public: bool,
    pub created_by_user_id: Option<i32>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateVocabStruct {
    pub word: Option<String>,
    pub definition: Option<String>,
    pub example_sentence: Option<String>,
    pub picture_url: Option<String>,
    pub hint: Option<String>,
}

/// Vokabel zusammen mit Lernfortschritt (für Review-Endpunkt)
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VocabWithProgress {
    // Vocab-Felder
    pub id: i32,
    pub word: String,
    pub definition: String,
    pub example_sentence: Option<String>,
    pub picture_url: Option<String>,
    pub hint: Option<String>,
    // Progress-Felder
    pub progress_id: i32,
    pub box_number: i16,
    pub last_reviewed: Option<NaiveDateTime>,
    pub next_review: NaiveDateTime,
    pub correct_streak: i32,
}

/// Statistiken für die Home-Ansicht
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HomeStats {
    /// Gesamt-Vokabeln im Lern-Deck des Users
    pub total_vocab: i64,
    /// Fällig für Review (next_review <= NOW())
    pub due_today: i64,
    /// Anzahl Vokabeln in Box 1–5
    pub box1: i64,
    pub box2: i64,
    pub box3: i64,
    pub box4: i64,
    pub box5: i64,
    /// Davon heute fällig pro Box
    pub due_box1: i64,
    pub due_box2: i64,
    pub due_box3: i64,
    pub due_box4: i64,
    pub due_box5: i64,
    /// Lern-Streak in Tagen (konsekutive Tage mit mind. 1 Review)
    pub streak_days: i64,
}

/// Ein Tag in der Aktivitäts-Heatmap
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DayActivity {
    /// ISO-Datum (YYYY-MM-DD)
    pub date: NaiveDate,
    /// Anzahl Reviews an diesem Tag
    pub count: i64,
}

/// Paginiertes Ergebnis für GET /vocab
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PaginatedVocab {
    pub items: Vec<VocabStruct>,
    pub total: i64,
    pub page: i64,
    pub limit: i64,
}

/// Erweitererte Statistiken für die Vokabeln-Übersichtsansicht
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VocabStats {
    /// Gesamt-Vokabeln im Lern-Deck des Users
    pub total_vocab: i64,
    /// Fällig für Review (next_review <= NOW())
    pub due_today: i64,
    /// Anzahl Vokabeln in Box 1–5
    pub box1: i64,
    pub box2: i64,
    pub box3: i64,
    pub box4: i64,
    pub box5: i64,
    /// Gesamte Reviews (kumuliert über alle Vokabeln)
    pub total_reviews: i64,
    /// Korrekte Reviews (kumuliert)
    pub correct_reviews: i64,
    /// Genauigkeit in Prozent (0–100), oder 0 wenn noch kein Review
    pub accuracy_pct: i64,
    /// Aktivitäts-Heatmap: letzte 35 Tage (5 Wochen), älteste zuerst
    pub heatmap: Vec<DayActivity>,
}
