

const TOKEN_KEY = 'auth_token';

export async function saveToken(token: string) {
    if (!token || typeof token !== 'string') {
        throw new Error('Invalid token: must be a non-empty string');
    }
    localStorage.setItem(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
    return localStorage.getItem(TOKEN_KEY);
}

export async function deleteToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export async function isAuthenticated(): Promise<boolean> {
    const token = await getToken();
    return token !== null;
}
