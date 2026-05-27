import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'auth_user_id';
const USERNAME_KEY = 'auth_username';
const IS_ADMIN_KEY = 'auth_is_admin';

export async function saveToken(token: string) {
    if (!token || typeof token !== 'string') {
        throw new Error('Invalid token: must be a non-empty string');
    }
    await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function saveUserSession(
    token: string,
    userId: number,
    username: string,
    isAdmin: boolean
) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_ID_KEY, String(userId));
    await SecureStore.setItemAsync(USERNAME_KEY, username);
    await SecureStore.setItemAsync(IS_ADMIN_KEY, isAdmin ? 'true' : 'false');
}

export async function getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function getUserId(): Promise<number | null> {
    const value = await SecureStore.getItemAsync(USER_ID_KEY);
    return value !== null ? parseInt(value, 10) : null;
}

export async function getUsername(): Promise<string | null> {
    return await SecureStore.getItemAsync(USERNAME_KEY);
}

export async function getIsAdmin(): Promise<boolean> {
    const value = await SecureStore.getItemAsync(IS_ADMIN_KEY);
    return value === 'true';
}

export async function deleteToken() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function deleteUserSession() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_ID_KEY);
    await SecureStore.deleteItemAsync(USERNAME_KEY);
    await SecureStore.deleteItemAsync(IS_ADMIN_KEY);
}

export async function isAuthenticated(): Promise<boolean> {
    const token = await getToken();
    return token !== null;
}
