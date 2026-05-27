import Constants from 'expo-constants';

/**
 * Im Entwicklungsmodus leitet Expo den Dev-Server auf einer bestimmten IP aus.
 * Wir leiten die API-URL von dieser IP ab, damit das Handy den Server
 * über das lokale Netzwerk erreicht (statt über localhost).
 *
 * In Produktion kann hier eine feste URL gesetzt werden.
 */
function getBaseUrl(): string {
    // Expo liefert z.B. "192.168.178.56:8081" — wir tauschen den Port aus
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
        const host = hostUri.split(':')[0]; // nur IP, ohne Port
        return `http://${host}:3000`;
    }
    // Fallback für Web-Browser auf dem Entwicklungsrechner
    return 'http://localhost:3000';
}

export const BASE_URL = getBaseUrl();

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,   // zuerst: method, body, etc.
        headers: {    // danach: Content-Type immer setzen, aber durch options.headers überschreibbar
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
}
