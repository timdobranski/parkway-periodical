'use client'

import { createClient } from '../../../utils/supabase/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './changePassword.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAdmin } from '../../../contexts/AdminContext';

export default function Login() {
  console.log('on change password page');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [message, setMessage] = useState('');
  const { isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, setUser } = useAdmin();

  useEffect(() => {
    if (message) {
      alert(message);
    }
  }, [message])

  useEffect(() => {

  })

  const handlePasswordChange = async () => {
    try {
      const response = await fetch('/api/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword, id: user.auth_id}),
      });

      const id = user.auth_id;

      if (response.ok) {
        const { data, error: restorePermissionsError } = await supabase
          .from('users')
          .update({needsToChangePassword: false})
          .eq('auth_id', id);

        if (restorePermissionsError) {
          setMessage(`Error: ${restorePermissionsError.message}`);
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: newPassword,
        });

        if (signInError) {
          setMessage(`Password Changed Successfully. Please sign in again. ${signInError.message}`);
        } else {
          setMessage('Password changed successfully.');
        }
      } else {
        setMessage(`Error: ${response}`);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };



  return (
    <div className={styles.loginContainer}>
      <img src="/images/logos/parkway.webp" alt="Parkway Periodical Logo" className={styles.logo} />
      <form className={styles.loginForm}>
        <h1 className='siteTitle'>PARKWAY PERIODICAL</h1>
        <h3 className={styles.loginHeader}>Choose a new password below:</h3>
        <p className='centeredWhiteText'>{`Passwords must be six or more characters long.`}</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter new password"
          className={styles.loginInput}
        />

        <button
          type="submit"
          className={styles.loginButton}
          onClick={() => updatePassword}
        >Update Password</button>
      </form>
    </div>
  );
}
