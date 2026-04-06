import { View, Text, StyleSheet, Pressable } from 'react-native';
import { deleteToken } from '@/services/authService.web';
import { useRouter } from 'expo-router';

export default function Header({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const onLogout = async () => {
        await deleteToken().then(() => {
            router.replace('/');
            console.log('User logged out');
        });
    };

    return (
        <>
            <View style={styles.header}>
                <Text style={styles.headerText}>안녕 한국</Text>
                <Pressable style={styles.button} onPress={onLogout}>
                    <Text>Logout</Text>
                </Pressable>
            </View>
            {children}
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#6200EE', 
        padding: 16,
        marginBottom: 32,
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
    },
    button: {
        backgroundColor: '#BB86FC',
        padding: 8,
        borderRadius: 4,
        marginTop: 8,
    },
});