import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { CreateUser } from "@/services/model/userModel";
import { createUser } from "@/services/userService";
export default function RegisterScreen() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    function handleRegister(username: string, password: string, confirmPassword: string) {
        if (!username || !password || !confirmPassword) {
            console.error('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            console.error('Passwords do not match');
            return;
        }

        const userData: CreateUser = {
            username,
            password
        };

        createUser(userData)
            .then(() => {
                console.log('User registered successfully');
            })
            .catch((error) => {
                console.error('Error registering user:', error);
            });

    }



    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput 
                style={styles.input}
                placeholder="Username" 
                value={username} 
                onChangeText={setUsername} />
            <TextInput 
                style={styles.input}
                placeholder="Password" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry={true} />
            <TextInput 
                style={styles.input}
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                secureTextEntry={true} />
            <Pressable style={styles.button} onPress={() => handleRegister(username, password, confirmPassword)}>
                <Text style={styles.buttonText}>Register</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: '600', marginBottom: 24 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#4F46E5',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontWeight: '600' },
});