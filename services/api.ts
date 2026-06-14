import Constants from 'expo-constants';

function getBaseUrl(): string {
    // Gesetzt beim Vercel-Build (EXPO_PUBLIC_API_URL env var)
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }
    // Im Expo Dev-Server: IP aus hostUri ableiten
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
        const host = hostUri.split(':')[0];
        return `http://${host}:3000`;
    }
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
        if (response.status === 401 || response.status === 403) {
            throw new Error(`UNAUTHORIZED:${response.status}`);
        }
        throw new Error(`API request failed with status ${response.status}`);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}
