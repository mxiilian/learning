import { LoginUser } from '@/services/model/userModel';
import { Link } from 'expo-router';

export default function HomeScreen() {
  
  let username: string = '';
  let password: string = '';

  function handleLogin(username: string, password: string) {
    if (!username || !password || username.trim() === '' || password.trim() === '') {
      console.error('Username and password are required');
      return;
    }

    let userData: LoginUser = {
          username,
          password,
      }


  
  }

  function setUsername(value: string) {
    username = value;
  }

  function setPassword(value: string) {
    password = value;
  }
  
  return (
    <>
      <h1>Login</h1>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => handleLogin(username, password)}>Login</button>
      <Link href="/register">Register</Link>
    </>
  );

}
