'use client'

import styles from './register.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function Register() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState('');

  useEffect(() => {

  }, [])


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

        {/* <div className={styles.formSection}>
          <label className={styles.formLabel}>Email:</label>
          <input className={styles.formInput} type="email" name="email" />
        </div> */}
        <div className={styles.formSection}>
          <label className={styles.formLabel}>Position:</label>
          <input className={styles.formInput} type="text" name="position" value={position} onChange={(e) => { setPosition(e.target.value) }} />
          <p className={styles.required}>required</p>
        </div>

        <div className={styles.formSection}>
          <label className={styles.formLabel}>Password:</label>
          <input className={styles.formInput} type="password" name="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
          <p className={styles.required}>required</p>
        </div>

        <div className={styles.formSection}>
          <label className={styles.formLabel}>Photo:</label>
          <input className={styles.formInput} type="file" name="photo" />
        </div>

        <button className={styles.completeSignupButton} type="submit">Complete Sign Up</button>
      </form>
    </div>
  );
}
