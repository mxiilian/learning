import { useState } from 'react';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, Pressable, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';

import LoginRoute from '@/components/LoginRoute';
import { loginUser } from '@/services/userService';
import { saveUserSession } from '@/services/authService';
import { LoginUser } from '@/services/model/userModel';
import { authStyles as s } from '@/styles/auth.styles';
import { Colors } from '@/styles/theme';

export default function LoginScreen() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState<string | null>(null);

    async function handleLogin() {
        const u = username.trim();
        const p = password.trim();
        setError(null);
        if (!u || !p) {
            setError('Benutzername und Passwort sind erforderlich.');
            return;
        }

        setLoading(true);
        const userData: LoginUser = { username: u, password: p };

        try {
            const response = await loginUser(userData);
            if (response.status !== 'success' || !response.token) {
                setError('Benutzername oder Passwort falsch.');
                return;
            }
            await saveUserSession(
                response.token,
                response.user.id,
                response.user.username,
                response.user.isAdmin,
            );
            router.replace('/dashboard');
        } catch {
            setError('Verbindung zum Server fehlgeschlagen.');
        } finally {
            setLoading(false);
        }
    }

    const content = (
        <View style={s.container}>
            <Text style={s.brand}>안녕 한국</Text>
            <Text style={s.title}>Anmelden</Text>

            <TextInput
                style={s.input}
                placeholder="Benutzername"
                placeholderTextColor={Colors.muted}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput
                style={s.input}
                placeholder="Passwort"
                placeholderTextColor={Colors.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {error && <Text style={s.errorText}>{error}</Text>}

            <Pressable
                style={[s.button, loading && s.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={s.buttonText}>{loading ? 'Lade…' : 'Anmelden'}</Text>
            </Pressable>

            <Link href="/register" style={s.link}>
                Noch kein Konto? Registrieren
            </Link>
        </View>
    );

    return (
        <LoginRoute>
            {Platform.OS === 'web' ? content : (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {content}
                </TouchableWithoutFeedback>
            )}
        </LoginRoute>
    );
}
