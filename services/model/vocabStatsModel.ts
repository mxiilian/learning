/** Ein Tag in der Aktivitäts-Heatmap */
export type DayActivity = {
    /** ISO-Datum (YYYY-MM-DD) */
    date: string;
    /** Anzahl Reviews an diesem Tag */
    count: number;
};

/** Erweiterte Statistiken für die Vokabeln-Übersichtsansicht */
export type VocabStats = {
    totalVocab:     number;
    dueToday:       number;
    box1:           number;
    box2:           number;
    box3:           number;
    box4:           number;
    box5:           number;
    totalReviews:   number;
    correctReviews: number;
    /** Genauigkeit in Prozent (0–100) */
    accuracyPct:    number;
    /** 35 Einträge (5 Wochen), älteste zuerst */
    heatmap:        DayActivity[];
};
