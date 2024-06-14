'use client'

import styles from './register.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import supabase from '../../utils/supabase';

export default function Register() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [includeInStaff, setIncludeInStaff] = useState(true);
  const [aboutMe, setAboutMe] = useState('');
  const [session, setSession] = useState({});

  // check auth
  useEffect(() => {
    const getUserAuthData = async () => {
      // Check if there is a session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      // If no session, redirect user to public home
      if (sessionError || !sessionData.session) {
        router.push('/public/home');
        return;
      }
      if (sessionData) {setSession(sessionData.session)};
      // If there is a session, check if the user has a profile
      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', sessionData.session.user.id)
        .single();

      if (userDataError && userDataError.code === 'PGRST116') {
        // No rows found
        console.log('No user profile found');
        return;
      }

      if (userDataError) {
        console.log('User data error: ', userDataError);
        return;
      }

      // If the user has a profile, redirect to admin home
      if (userData) {
        router.push('/admin/home');
      }
    };

    getUserAuthData();
  }, [router]);



  const finishSignup = async (e) => {
    e.preventDefault()
    if (!firstName || !lastName || !password || !position ) {
      alert('All fields are required')
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters')
      return;
    }
    const registrationData = { firstName, lastName, position, password, includeInStaff, aboutMe };
    registrationData.id = session.user.id;
    registrationData.email = session.user.email;
    const response = await fetch('/api/completeSignup', {method: 'POST', body: JSON.stringify(registrationData)});

    if (response.status === 200) {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: password,
      })
      if (signInError) {
        console.log('ERROR SIGNING IN: ', signInError)
      } else {
        router.push('/admin/home');
      }


    } else {
      alert('There was an error completing registration: ', response)
    }
  }


  return (
    <div className={styles.pageWrapper}>
      <div className={styles.headerBar}>
        <img className={styles.logo} src='/images/logos/parkway.webp'/>
        <h1 className='siteTitle'>PARKWAY PERIODICAL</h1>
      </div>
      <h2 className='postTitle'>New User Signup</h2>
      <p className={styles.instructions}>To complete registration, fill in the fields below:</p>

      <form className={styles.registrationForm}>

        <div className={styles.formSection}>
          <label className={styles.formLabel}>First Name:</label>
          <input className={styles.formInput} type="text" name="first_name" value={firstName} onChange={(e) => { setFirstName(e.target.value) }}
          />
          <p className={styles.required}>required</p>
        </div>

        <div className={styles.formSection}>
          <label className={styles.formLabel}>Last Name:</label>
          <input className={styles.formInput} type="text" name="last_name" value={lastName} onChange={(e) => { setLastName(e.target.value) }}
          />
          <p className={styles.required}>required</p>
        </div>

        <div className={styles.formSection}>
          <label className={styles.formLabel}>Position:</label>
          <input className={styles.formInput} type="text" name="position" value={position} onChange={(e) => { setPosition(e.target.value) }} />
          <p className={styles.required}>required</p>
        </div>

        <div className={styles.formSection}>
          <label className={styles.formLabel}>Password:</label>
          <input className={styles.formInput} placeholder='6 or more characters' type="password" name="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
          <p className={styles.required}>required</p>
        </div>

        <div className={styles.formSection}>
          <label className={styles.formLabel}>Photo:</label>
          <input className={styles.formInput} type="file" name="photo" />
        </div>

        <div className={styles.wideFormSection}>
          <label className={'smallerPostTitle'}>Show Me on Staff Page?</label>
          <input className={styles.checkbox} type="checkbox" name="include in staff" checked={includeInStaff} onChange={() => {setIncludeInStaff(!includeInStaff)}}/>
        </div>

        <div className={styles.wideFormSection}>
          <label className={'smallerPostTitle'}>About</label>
          <p className={styles.instructions}>Use this section to write a short introduction about yourself for users to read on the staff page</p>
          {!includeInStaff && <p className={styles.textareaDisabledNotice}>{`To edit, check the 'Show Me On Staff Page' box`}</p>}
          <textarea className={styles.formInput} disabled={!includeInStaff} type="text" name="include in staff" value={aboutMe} onChange={(e) => {setAboutMe(e.taget.value)}}/>
        </div>

        <button className={styles.completeSignupButton} type="submit" onClick={(e) => {finishSignup(e)}}>Complete Sign Up</button>
      </form>
    </div>
  );
}
