import { useState } from 'react';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { Caveat_700Bold } from '@expo-google-fonts/caveat';
import { Kalam_400Regular, Kalam_700Bold } from '@expo-google-fonts/kalam';

import LoginRoute from '@/components/LoginRoute';
import { loginUser } from '@/services/userService';
import { saveUserSession } from '@/services/authService';
import { LoginUser } from '@/services/model/userModel';
import { authStyles as s } from '@/styles/auth.styles';

export default function LoginScreen() {
    const router = useRouter();

    useFonts({ Caveat_700Bold, Kalam_400Regular, Kalam_700Bold });

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading]   = useState(false);

    async function handleLogin() {
        const u = username.trim();
        const p = password.trim();
        if (!u || !p) {
            Alert.alert('Fehler', 'Benutzername und Passwort sind erforderlich.');
            return;
        }

        setLoading(true);
        const userData: LoginUser = { username: u, password: p };

        try {
            const response = await loginUser(userData);
            if (response.status !== 'success' || !response.token) {
                Alert.alert('Fehler', 'Benutzername oder Passwort falsch.');
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
            Alert.alert('Fehler', 'Verbindung zum Server fehlgeschlagen.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <LoginRoute>
            <View style={s.container}>
                <Text style={s.brand}>안녕 한국</Text>
                <Text style={s.title}>Anmelden</Text>

                <TextInput
                    style={s.input}
                    placeholder="Benutzername"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TextInput
                    style={s.input}
                    placeholder="Passwort"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

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
        </LoginRoute>
    );
}
