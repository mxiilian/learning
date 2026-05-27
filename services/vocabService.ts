import { apiFetch, BASE_URL } from './api';
import { getToken } from './authService';
import { HomeStats } from './model/statsModel';
import { VocabWithProgress, VocabProgress } from './model/VocabModels';
import { VocabStats } from './model/vocabStatsModel';

export type Vocab = {
    id: number;
    word: string;
    definition: string;
    exampleSentence?: string;
    pictureUrl?: string;
    isPublic: boolean;
    createdByUserId?: number;
};

export type CreateVocab = {
    word: string;
    definition: string;
    exampleSentence?: string;
    pictureUrl?: string;
    hint?: string;
    isPublic?: boolean;
};

// ---------------------------------------------------------------------------
// Vokabeln
// ---------------------------------------------------------------------------

/** Alle öffentlichen + eigene private Vokabeln (falls eingeloggt) */
export async function getVocabs(): Promise<Vocab[]> {
    const token = await getToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return apiFetch<Vocab[]>('/vocab', { headers });
}

/** Einzelne Vokabel */
export async function getVocab(id: number): Promise<Vocab> {
    return apiFetch<Vocab>(`/vocab/${id}`);
}

/** Neue Vokabel anlegen (erfordert Auth) */
export async function createVocab(data: CreateVocab): Promise<Vocab> {
    const token = await getToken();
    return apiFetch<Vocab>('/vocab', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
}

// ---------------------------------------------------------------------------
// Lern-Deck & Review
// ---------------------------------------------------------------------------

/** Vokabel zum Lern-Deck des Users hinzufügen */
export async function addVocabToUser(userId: number, vocabId: number): Promise<VocabProgress> {
    const token = await getToken();
    return apiFetch<VocabProgress>(`/users/${userId}/vocab/${vocabId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    });
}

/** Vokabeln, die aktuell zur Wiederholung fällig sind */
export async function getDueVocabs(userId: number): Promise<VocabWithProgress[]> {
    const token = await getToken();
    return apiFetch<VocabWithProgress[]>(`/users/${userId}/review`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

/** Review-Ergebnis einreichen */
export async function submitReview(
    userId: number,
    vocabId: number,
    correct: boolean
): Promise<VocabProgress> {
    const token = await getToken();
    return apiFetch<VocabProgress>(`/users/${userId}/review`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ vocabId, correct }),
    });
}

// ---------------------------------------------------------------------------
// Home-Statistiken
// ---------------------------------------------------------------------------

/** Statistiken für die Home-Ansicht laden */
export async function getHomeStats(userId: number): Promise<HomeStats> {
    const token = await getToken();
    return apiFetch<HomeStats>(`/users/${userId}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

// ---------------------------------------------------------------------------
// Bild-Upload
// ---------------------------------------------------------------------------

/**
 * Lädt ein Bild auf den Server hoch und gibt die gespeicherte URL zurück.
 * @param localUri  Die lokale Datei-URI vom ImagePicker (z.B. file://…)
 */
export async function uploadImage(localUri: string): Promise<string> {
    const token = await getToken();

    const filename = localUri.split('/').pop() ?? 'image.jpg';
    const ext      = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
    const mimeType = ext === 'png' ? 'image/png'
                   : ext === 'webp' ? 'image/webp'
                   : ext === 'gif'  ? 'image/gif'
                   : 'image/jpeg';

    const formData = new FormData();
    formData.append('image', { uri: localUri, name: filename, type: mimeType } as any);

    const response = await fetch(`${BASE_URL}/upload/image`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}` },
        body:    formData,
    });

    if (!response.ok) throw new Error(`Upload fehlgeschlagen (${response.status})`);
    const data = await response.json() as { url: string };
    return data.url;
}

/** Erweiterte Statistiken für die Vokabeln-Übersichtsansicht (inkl. Genauigkeit + Heatmap) */
export async function getVocabStats(userId: number): Promise<VocabStats> {
    const token = await getToken();
    return apiFetch<VocabStats>(`/users/${userId}/vocab-stats`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}
