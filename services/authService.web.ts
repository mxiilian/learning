const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'auth_user_id';
const USERNAME_KEY = 'auth_username';
const IS_ADMIN_KEY = 'auth_is_admin';

export async function saveToken(token: string) {
    if (!token || typeof token !== 'string') {
        throw new Error('Invalid token: must be a non-empty string');
    }
    localStorage.setItem(TOKEN_KEY, token);
}

export async function saveUserSession(
    token: string,
    userId: number,
    username: string,
    isAdmin: boolean
) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_ID_KEY, String(userId));
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(IS_ADMIN_KEY, isAdmin ? 'true' : 'false');
}

export async function getToken(): Promise<string | null> {
    return localStorage.getItem(TOKEN_KEY);
}

export async function getUserId(): Promise<number | null> {
    const value = localStorage.getItem(USER_ID_KEY);
    return value !== null ? parseInt(value, 10) : null;
}

export async function getUsername(): Promise<string | null> {
    return localStorage.getItem(USERNAME_KEY);
}

export async function getIsAdmin(): Promise<boolean> {
    return localStorage.getItem(IS_ADMIN_KEY) === 'true';
}

export async function deleteToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export async function deleteUserSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(IS_ADMIN_KEY);
}

export async function isAuthenticated(): Promise<boolean> {
    return localStorage.getItem(TOKEN_KEY) !== null;
}
