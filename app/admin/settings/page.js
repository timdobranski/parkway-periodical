'use client'

import styles from './settings.module.css';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import supabase from '../../../utils/supabase';

export default function Settings () {
  const [user, setUser] = useState(null);
  const userIcon = <FontAwesomeIcon icon={faUser} className={styles.userIcon} />
  useEffect(() => {
    const getAndSetUser = async () => {
      const response = await supabase.auth.getSession();

      // Check if the session exists
      if (response.data.session) {
        // If session exists, set the user
        console.log('session exists: ', response.data.session.user);
        setUser(response.data.session.user);

        // Fetch user data from the users table where auth_id matches the user id
        const { data: userData, error } = await supabase
          .from('users') // Replace 'users' with your actual table name if different
          .select('*') // Selects all columns, adjust if needed
          .eq('auth_id', response.data.session.user.id)
          .single(); // Replace 'auth_id' with your actual column name if different

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          console.log('User data:', userData);
          // Do something with userData, like setting it to state or processing it
          setUser(userData);
        }

      } else {
        // If no session, log no session
        console.log('no session');
        // Optionally, redirect to /auth or handle the lack of session
      }
    };
    getAndSetUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.userInfo}>
        { user ? <img src={user.photo} alt='User Photo' className={styles.userPhoto} /> : userIcon}
        <p className='smallerTitle'>{user ? `${user.first_name} ${user.last_name}` : 'User Name'}</p>
        <p className={styles.info}>{user ? `${user.position}` : 'Position'}</p>
      </div>

      <div className={styles.editUserInfoWrapper}>

        <h3 className={styles.infoLabel}>Update Photo</h3>
        <div className={styles.inputWrapper}>
          <input className={styles.photoInput} type='file' placeholder='Select new photo' />
          <button className={styles.inviteButton}>Confirm</button>
        </div>

        <h3 className={styles.infoLabel}>Change Email</h3>
        <div className={styles.inputWrapper}>
          <input className={styles.updateInput} type='email' placeholder={user.email} />
          <button className={styles.inviteButton}>Confirm</button>
        </div>

        <h3 className={styles.infoLabel}>Change Password</h3>
        <div className={styles.inputWrapper}>
          <input className={styles.updateInput} type='password' placeholder='Enter new password' />
          <button className={styles.inviteButton}>Confirm</button>
        </div>

        <h3 className={styles.infoLabel}>Invite New User</h3>
        <div className={styles.inputWrapper}>
          <input className={styles.updateInput} type='email' placeholder='Enter email address' />
          <button className={styles.inviteButton}>Send Invite</button>
        </div>
      </div>
    </div>
    // </div>
  )
}