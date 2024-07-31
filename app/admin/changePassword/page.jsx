'use client'

import { createClient } from '../../../utils/supabase/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './changePassword.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAdmin } from '../../../contexts/AdminContext';

export default function Login() {
  const supabase = createClient();
  console.log('on change password page');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [message, setMessage] = useState('');
  const { isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, authUser, session, setUser } = useAdmin();




  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const requestBody = JSON.stringify({ password: password, id: session.user.id });
    //send a request to the server to change password

    const response = await fetch('/api/changePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: password, id: authUser.id}),
    });
    console.log('response.ok in changePassword: ', response.ok);
    // if new password accepted, restore permissions for user in users table
    if (response.ok) {
      // sign in with new password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      });

      if (signInError) {
        setMessage(`Password Changed Successfully. Please sign in again. ${signInError.message}`);
      }
      alert('Password Changed Successfully.');
      router.push('/admin/home')
    }
  };



  return (
    <div className='adminPageWrapper' >
      <div className={styles.loginContainer}>
        <img src="/images/logos/parkway.webp" alt="Parkway Periodical Logo" className={styles.logo} />
        <form className={styles.loginForm}>
          <h1 className='siteTitle'>PARKWAY PERIODICAL</h1>
          <h3 className={styles.loginHeader}>Choose a new password below:</h3>
          <p className='centeredWhiteText'>{`Passwords must be six or more characters long.`}</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className={styles.loginInput}
          />

          <button
            type="submit"
            className={styles.loginButton}
            onClick={(e) =>{handlePasswordChange(e)}}
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
