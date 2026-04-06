import { LoginUser } from '@/services/model/userModel';
import { Link } from 'expo-router';
import { loginUser } from '@/services/userService';
import { useRouter } from 'expo-router';
import { useState } from "react";
import { saveToken } from '@/services/authService';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import LoginRoute from '@/components/LoginRoute';



export default function HomeScreen() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin(username: string, password: string) {
    if (!username || !password || username.trim() === '' || password.trim() === '') {
      console.error('Username and password are required');
      return;
    }

    let userData: LoginUser = {
          username,
          password,
      }

    loginUser(userData)
      .then(async (response) => {
        const token = response.token;
        if (!token) {
          throw new Error('No token received from server');
        }
        const tokenString = typeof token === 'string' ? token : JSON.stringify(token);
        await saveToken(tokenString);
        console.log('Login successful:', response);
        router.push('/dashboard');
      })
      .catch(error => {
        console.error('Login failed:', error);
        // Handle login failure, e.g., show an error message
      });
  
  }
  
  return (
    <LoginRoute>
      <View style={styles.container}>
        <Text style={styles.header}>안녕 한국</Text>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Pressable style={styles.button} onPress={() => handleLogin(username, password)}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Link href="/register" style={styles.registration}>
          Register
        </Link>
      </View>
    </LoginRoute>
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
    registration: { marginTop: 16, textAlign: 'center' },
    header: { fontSize: 32, fontWeight: '700', marginBottom: 32 },
});
