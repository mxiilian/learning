// Der Header wird nicht mehr im Dashboard verwendet (dort direkt integriert).
// Diese Datei bleibt als wiederverwendbare Komponente für andere Screens erhalten.
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { deleteUserSession } from '@/services/authService';
import { useRouter } from 'expo-router';

export default function Header({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const onLogout = async () => {
        await deleteUserSession();
        router.replace('/');
    };

    return (
        <>
            <View style={styles.header}>
                <Text style={styles.headerText}>안녕 한국</Text>
                <Pressable style={styles.button} onPress={onLogout}>
                    <Text style={styles.buttonText}>Abmelden</Text>
                </Pressable>
            </View>
            {children}
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#1A1A2E',
        paddingHorizontal: 20,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
    },
    button: {
        backgroundColor: '#4A90D9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },
});
