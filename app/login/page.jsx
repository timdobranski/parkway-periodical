'use client'

// import supabase from '../../utils/supabase.js';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '../../utils/supabase/client';
import { useState, useEffect } from 'react';


export default function Login() {
  const supabase = createClient();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const login = async (e) => {
    e.preventDefault();
    console.log('email: ', email)
    console.log('password: ', password)
    const response = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log('response: ', response)
    const error = response.error;
    if (error) {
      console.error('Error logging in:', error);
      alert('There was an error signing you in. Please try again. If the problem persists, please contact Tim.');
      return;
    }

    // console.log('User:', user);
    // console.log('Session:', session);
    router.push('/admin/home');
  }

  return (
    <div className={styles.loginContainer}>
      <img src="/images/logos/parkway.webp" alt="Parkway Periodical Logo" className={styles.logo} />
      <form className={styles.loginForm}>
        <h1 className='siteTitle'>PARKWAY PERIODICAL</h1>
        <h3 className={styles.loginHeader}>Login</h3>
        <input
          id='email'
          name='email'
          type="email"
          placeholder="Email"
          className={styles.loginInput}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className={styles.inputContainer}>
          <input
            id='password'
            name='password'
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className={styles.loginInput}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FontAwesomeIcon
            onClick={() => setShowPassword(!showPassword)}
            className={styles.togglePasswordIcon}
            icon={showPassword ? faEye : faEyeSlash}
          />
        </div>
        <a href="/forgotPassword" className={styles.forgotPassword}>Forgot Password?</a>


        <button onClick={login} className={styles.loginButton}>Login</button>
      </form>
    </div>
  );
}
