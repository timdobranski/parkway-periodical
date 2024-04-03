'use client'

import supabase from '../../utils/supabase.js';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      return;
    }
    console.log('data in auth page: ', data);
    router.push('/admin/new-post'); // Redirect after login
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h1 className={styles.loginHeader}>Login</h1>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={styles.loginInput}
        />

        <div className={styles.inputContainer}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={styles.loginInput}
          />
          <FontAwesomeIcon
            onClick={togglePasswordVisibility}
            className={styles.togglePasswordIcon}
            icon={showPassword ? faEye : faEyeSlash}
          />
        </div>

        <button type="submit" className={styles.loginButton}>Login</button>
      </form>
    </div>
  );
}
