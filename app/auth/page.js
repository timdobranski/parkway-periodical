'use client'

import supabase from '../../utils/supabase.js';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './auth.module.css';

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(supabase);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      return;
    }
    console.log('data: ', data);
    // console.log('user in handler: ', user);
    // console.log('session in handler: ', session);
    // router.push('/auth/new-post'); // Redirect to new-post page

    // Add redirection or state update here
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
      <h1 className={styles.loginHeader}>Login</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={styles.loginInput}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={styles.loginInput}
        />
        <button type="submit" className={styles.loginButton}>Login</button>
      </form>
    </div>
  );
}