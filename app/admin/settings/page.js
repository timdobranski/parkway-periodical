'use client'

import styles from './settings.module.css';
import { useEffect, useState, Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPencil } from '@fortawesome/free-solid-svg-icons';
import supabase from '../../../utils/supabase';
import CroppablePhoto from '../../../components/CroppablePhoto/CroppablePhoto';

export default function Settings () {
  const [user, setUser] = useState(null);
  const userIcon = (<FontAwesomeIcon icon={faUser} className={styles.userIcon} />)
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserAdminStatus, setNewUserAdminStatus] = useState(false);
  const [nonAdminUsers, setNonAdminUsers] = useState([]);
  const [cropActive, setCropActive] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [originalPhoto, setOriginalPhoto] = useState('');
  const [croppedPhoto, setCroppedPhoto] = useState('');

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
  useEffect(() => {
    if (user && user.admin) {
      const fetchNonAdminUsers = async () => {
        const users = await getAllNonAdminUsers();
        setNonAdminUsers(users);
      }
      fetchNonAdminUsers();
    }
  }, [user])

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
      console.error('Error in client request to server:', error.message);
      alert(`Invite not sent: ${error.message}` || 'An unexpected error occurred');
    }
  };

  const getAllNonAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('admin', false);

      if (error) {
        console.error('Error fetching non-admin users:', error);
        return null;
      }
      return data;

    } catch (error) {
      console.error('Error in client request to server:', error);
      return null;
    }
  }
  const handleFileChange = async () => {
    // upload original to supabase
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  const updatePhotoModalContent = (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContentWrapper}>
        <p className={styles.infoLabel}>Crop Or Change Photo</p>
        <input className={styles.photoInput} type="file" name="photo" />
        <div className={styles.cropWrapper}>
          {cropActive &&
          <CroppablePhoto
            photo={user.photo}
            ratio={1}
            bucket={'users'}
            filePath={`photos/${user.email}`}
            setCropActive={setCropActive}
          />
          }
        </div>
      </div>
    </div>
  )
  const userPhoto = (
    <div className={styles.currentPhotoPreviewWrapper}>
      {
        user?.photo ?
          <img src={user.photo} alt='User Photo' className={user.photo ? styles.currentPhotoPreview : styles.userIcon}/>
          :
          userIcon
      }
      <FontAwesomeIcon icon={faPencil} className={styles.editIcon} onClick={() => setModalIsOpen(true)}/>
    </div>
  )

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      {modalIsOpen && updatePhotoModalContent}
      <div className={styles.userInfo}>
        {userPhoto}

        <p className='smallerTitle'>{user ? `${user.first_name || 'User'} ${user.last_name || 'Name'}` : 'User Name'}</p>
        <p className={styles.info}>{user ? `${user.position}` : 'Position'}</p>
      </div>

      <div className={styles.editUserInfoWrapper}>

        {/* <h3 className={styles.infoLabel}>Change Email</h3>
        <div className={styles.inputWrapper}>
          <input className={styles.updateInput} type='email' placeholder={user.email} />
          <button className={styles.inviteButton}>Confirm</button>
        </div> */}

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
          {/* <label className={styles.adminLabel}>Make New User An Administrator?</label>
          <p className={styles.info}>Administrators can add/remove users and  adjust site global settings like social media links, etc.</p>
          <input
            className={styles.makeAdministratorCheckbox}
            type='checkbox'
            checked={newUserAdminStatus}
            onChange={() => setNewUserAdminStatus(!newUserAdminStatus)}>

            </input> */}
          <button
            className={styles.inviteButton}
            onClick={() => {if (newUserEmail) {sendRequestToInviteNewUser(newUserEmail)}}}
          >Send Invite</button>
        </div>

        { user.admin &&
        <>
          <h3 className={styles.infoLabel}>Remove User</h3>
          <div className={styles.inputWrapper}>
            <select
              className={styles.updateInput}
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              type='email'
              placeholder='Enter email address'
            >
              <option value=''>{nonAdminUsers.length ? 'Select user to remove' : 'No users to remove yet'}</option>
              {nonAdminUsers.map((user, index) => {
                return <option key={index} value={user.email}>{user.email}</option>
              })}
            </select>
            <button
              className={styles.inviteButton}
              onClick={() => {if (newUserEmail) {sendRequestToInviteNewUser(newUserEmail)}}}
            >
              Remove
            </button>
          </div>
        </>
        }
      </div>
      {user.admin &&
      <>
        <button className={styles.archiveButton}>ARCHIVE CURRENT SCHOOL YEAR</button>
        <p className={styles.archiveInstructions}>{`When you're done adding content for the current school year, click this button
      to send all posts to the archive. All posts will be removed from the main page, and the year's archived
      posts will no longer be editable.`}</p>
      </>
      }
    </div>
    // </div>
  )
}

// if no photo, render icon

// if photo, render photo with pencil icon to edit crop

// on file change or pencil icon click, render CroppablePhoto component(croppable file, and confirm button)