import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, Pressable, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';

import { createUser } from '@/services/userService';
import { CreateUser } from '@/services/model/userModel';
import { authStyles as s } from '@/styles/auth.styles';
import { Colors } from '@/styles/theme';

export default function RegisterScreen() {
    const router = useRouter();

    const [username, setUsername]               = useState('');
    const [password, setPassword]               = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading]                 = useState(false);
    const [error, setError]                     = useState<string | null>(null);
    const [success, setSuccess]                 = useState(false);

    async function handleRegister() {
        const u = username.trim();
        setError(null);
        if (!u || !password || !confirmPassword) {
            setError('Alle Felder sind erforderlich.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwörter stimmen nicht überein.');
            return;
        }

        setLoading(true);
        const userData: CreateUser = { username: u, password };

        try {
            await createUser(userData);
            setSuccess(true);
            setTimeout(() => router.replace('/'), 1500);
        } catch {
            setError('Registrierung fehlgeschlagen. Benutzername vergeben?');
        } finally {
            setLoading(false);
        }
    }

    const content = (
        <View style={s.container}>
            <Text style={s.brand}>안녕 한국</Text>
            <Text style={s.title}>Registrieren</Text>

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
            <TextInput
                style={s.input}
                placeholder="Passwort bestätigen"
                placeholderTextColor={Colors.muted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            {error && <Text style={s.errorText}>{error}</Text>}
            {success && <Text style={[s.errorText, { color: '#4ade80' }]}>Konto erstellt! Weiterleitung…</Text>}

            <Pressable
                style={[s.button, loading && s.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
            >
                <Text style={s.buttonText}>{loading ? 'Lade…' : 'Konto erstellen'}</Text>
            </Pressable>

            <Pressable style={{ marginTop: 24 }} onPress={() => router.back()}>
                <Text style={s.link}>Zurück zum Login</Text>
            </Pressable>
        </View>
    );

    return Platform.OS === 'web' ? content : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {content}
        </TouchableWithoutFeedback>
    );
}
