import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, Pressable, Alert, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';

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

    async function handleRegister() {
        const u = username.trim();
        if (!u || !password || !confirmPassword) {
            Alert.alert('Fehler', 'Alle Felder sind erforderlich.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Fehler', 'Passwörter stimmen nicht überein.');
            return;
        }

        setLoading(true);
        const userData: CreateUser = { username: u, password };

        try {
            await createUser(userData);
            Alert.alert('Erfolg', 'Konto erstellt! Du kannst dich jetzt anmelden.', [
                { text: 'OK', onPress: () => router.replace('/') },
            ]);
        } catch {
            Alert.alert('Fehler', 'Registrierung fehlgeschlagen. Benutzername vergeben?');
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
