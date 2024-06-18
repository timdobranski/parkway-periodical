'use client'

import styles from './register.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
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
  const [photo, setPhoto] = useState('');

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
  useEffect(() => {
    if (!includeInStaff) {setAboutMe('')}
  }, [includeInStaff])
  useEffect(() => {
    console.log('photo: ', photo)
  }, [photo])

  const finishSignup = async (e) => {
    e.preventDefault()
    // if info is missing, trigger alert
    if (!firstName || !lastName || !password || !position ) {
      alert('One or more required fields are empty')
      return;
    }
    // if password is too short, trigger alert
    if (password.length < 6) {
      alert('Password must be at least 6 characters')
      return;
    }
    // conditions are met; add user
    const registrationData = { firstName, lastName, position, password, includeInStaff, aboutMe };
    registrationData.id = session.user.id;
    registrationData.email = session.user.email;
    const response = await fetch('/api/completeSignup', {method: 'POST', body: JSON.stringify(registrationData)});
    // if user added, login
    if (response.status === 200) {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: password,
      })
      if (signInError) {
        console.log('ERROR SIGNING IN: ', signInError)
      } else {
        // if login successful, route to admin home
        router.push('/admin/home');
      }
    } else {
      alert('There was an error completing registration: ', response)
    }
  }
  // when user selects photo, upload it, then download it to render
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileName = 'original';
      const filePath = `photos/${session.user.email}/${fileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('users') // Ensure this is your actual bucket name
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading file:', error);
        return;
      }

      // Get the public URL of the uploaded file
      const { data: publicURL, error: urlError } = await supabase.storage
        .from('users')
        .getPublicUrl(filePath);

      if (urlError) {
        console.error('Error getting public URL:', urlError);
        return;
      }

      setPhoto(publicURL);
    }
  };

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

        <div className={styles.wideFormSection}>
          <label className={'smallerPostTitle'}>Photo:</label>
          <input className={styles.formInput} type="file" name="photo" onChange={handleFileChange}/>
          { photo ?
            <img className={styles.photo} src={photo.publicUrl} /> :
            <FontAwesomeIcon icon={faUser} className={styles.photoPlaceholder}/>
          }
        </div>

        <div className={styles.wideFormSection}>
          <label className={'smallerPostTitle'}>Show Me on Staff Page?</label>
          <p className={styles.instructions}>{`The staff page will display your name, position, email, photo(if provided), and a short introduction that you can add below.`}</p>
          <input className={styles.checkbox} type="checkbox" name="include in staff" checked={includeInStaff} onChange={() => {setIncludeInStaff(!includeInStaff)}}/>
        </div>

        <div className={styles.wideFormSection}>
          <label className={includeInStaff ? 'smallerPostTitle' : 'smallerPostTitleDisabled'}>About</label>
          <p className={`${styles.instructions} ${includeInStaff ? null : styles.disabledText}`}>Use this section to write a short introduction about yourself for users to read on the staff page</p>
          {!includeInStaff && <p className={styles.textareaDisabledNotice}>{`To edit, check the 'Show Me On Staff Page' box`}</p>}
          <textarea className={styles.formInput} disabled={!includeInStaff} maxLength={500} type="text" name="include in staff" value={aboutMe} onChange={(e) => {setAboutMe(e.target.value)}}/>
        </div>

        <button className={styles.completeSignupButton} type="submit" onClick={(e) => {finishSignup(e)}}>Complete Sign Up</button>
      </form>
    </div>
  );
}
