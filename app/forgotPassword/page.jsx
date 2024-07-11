'use client'

import { createClient } from '../../utils/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './forgotPassword.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import getSanitizedUrl from '../../utils/getSanitizedUrl';

export default function Login() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const [emailSent, setEmailSent] = useState(false);

  const sendResetEmail = async (e) => {
    e.preventDefault();

    const url = getSanitizedUrl('admin/changePassword');

    const { data, error } = await supabase.auth
      .resetPasswordForEmail(email, {
        redirectTo: url,
      });

      if (error) {
        console.log('Error sending reset email: ', error)
      } else {
        const { data, error } = await supabase
          .from('users')
          .update({needsToChangePassword: true})
          .eq('email', email)

        if (error) console.log('Error setting users table needsToChangePassword: ', error)

        setEmailSent(true);
      }

  };

const resetPasswordForm = (
  <>
     <h3 className={styles.loginHeader}>Reset Your Password</h3>
        <p className='centeredWhiteText'>{`Enter the email address associated with your account below.
        If the address is associated with an existing account, you will receive a message with a link to reset your password.`}</p>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={styles.loginInput}
        />

        <button
          type="submit"
          className={styles.loginButton}
          onClick={(e) => sendResetEmail(e)}
        >
          Send Email
        </button>
  </>
)

const confirmEmailSent = (
  <div className={styles.emailSent}>
    <h3 className={styles.loginHeader}>Check Your Email</h3>
    <p className='centeredWhiteText'>{`If ${email} is associated with an account, you will receive an email with a link to reset your password.`}</p>
  </div>
)


  return (
    <div className={styles.loginContainer}>
      <img src="/images/logos/parkway.webp" alt="Parkway Periodical Logo" className={styles.logo} />
      <form onSubmit={sendResetEmail} className={styles.loginForm}>
        <h1 className='siteTitle'>PARKWAY PERIODICAL</h1>
        {emailSent ? confirmEmailSent : resetPasswordForm}
      </form>
    </div>
  );
}
