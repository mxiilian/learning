import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

export async function saveToken(token: string) {
    if (!token || typeof token !== 'string') {
        throw new Error('Invalid token: must be a non-empty string');
    }
    await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function isAuthenticated(): Promise<boolean> {
    const token = await getToken();
    return token !== null;
}