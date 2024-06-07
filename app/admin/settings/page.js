'use client'

import styles from './settings.module.css';
import { useEffect, useState, Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPencil } from '@fortawesome/free-solid-svg-icons';
import supabase from '../../../utils/supabase';
import CroppablePhoto from '../../../components/EditablePhoto/EditablePhoto';

export default function Settings () {
  const [user, setUser] = useState(null);
  const userIcon = <FontAwesomeIcon icon={faUser} className={styles.userIcon} />
  const [newUserEmail, setNewUserEmail] = useState('');
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

  const sendRequestToInviteNewUser = async (email) => {
    try {
      const response = await fetch('/api/inviteUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      alert('Invite sent successfully');
    } catch (error) {
      console.error('Error in client request to server:', error);
      alert('Failed to send invite');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.userInfo}>

        <div className={styles.currentPhotoPreviewWrapper}>
          <img src={user.photo? user.photo : userIcon} alt='User Photo' className={styles.currentPhotoPreview}/>
          <FontAwesomeIcon icon={faPencil} className={styles.editIcon} />
        </div>

        <p className='smallerTitle'>{user ? `${user.first_name || 'User'} ${user.last_name || 'Name'}` : 'User Name'}</p>
        <p className={styles.info}>{user ? `${user.position}` : 'Position'}</p>
      </div>

      <div className={styles.editUserInfoWrapper}>

        {/* <h3 className={styles.infoLabel}>Update Photo</h3>
        <div className={styles.inputWrapper}>
          <input className={styles.photoInput} type='file' placeholder='Select new photo' />
          <button className={styles.inviteButton}>Update Photo</button>
        </div> */}

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
          <input
            className={styles.updateInput}
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            type='email'
            placeholder='Enter email address'
          />
          <button
            className={styles.inviteButton}
            onClick={() => {if (newUserEmail) {sendRequestToInviteNewUser(newUserEmail)}}}
          >Send Invite</button>
        </div>
      </div>
      <button className={styles.archiveButton}>ARCHIVE CURRENT SCHOOL YEAR</button>
      <p className={styles.archiveInstructions}>{`When you're done adding content for the current school year, click this button
      to send all posts to the archive. All posts will be removed from the main page, and the year's archived
      posts will no longer be editable.`}</p>
    </div>
    // </div>
  )
}

// if no photo, render icon

// if photo, render photo with pencil icon to edit crop

// on file change or pencil icon click, render CroppablePhoto component(croppable file, and confirm button)