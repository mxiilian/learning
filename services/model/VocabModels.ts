export type VocabProgress = {
    id: number;
    userId: number;
    vocabId: number;
    boxNumber: number;
    lastReviewed?: string;
    nextReview: string;
    correctStreak: number;
}

export type ReviewResult = {
    vocabId: number;
    correct: boolean;
}

export type VocabWithProgress = {
    id: number;
    word: string;
    definition: string;
    exampleSentence: string;
    pictureUrl?: string;
    hint?: string;
    progressId: number;
    boxNumber: number;
    lastReviewed?: string;
    nextReview: string;
    correctStreak: number;
}