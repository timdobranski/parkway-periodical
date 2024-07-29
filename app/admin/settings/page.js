'use client'

import styles from './settings.module.css';
import { useEffect, useState, Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPencil, faCrop, faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '../../../utils/supabase/client';
import CroppablePhoto from '../../../components/CroppablePhoto/CroppablePhoto';
import userPhotos from '../../../utils/userPhotos';
import { useAdmin } from '../../../contexts/AdminContext';


export default function Settings () {
  const supabase = createClient();
  const userIcon = (<FontAwesomeIcon icon={faUser} className={styles.userIcon} />)
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserAdminStatus, setNewUserAdminStatus] = useState(false);
  const [users, setUsers] = useState([]);
  const [cropActive, setCropActive] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState('');
  const [userToRemove, setUserToRemove] = useState('');
  const { isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, setUser } = useAdmin();


  useEffect(() => {
    // if (user && user.email) {
    //   // const cacheBustedUrl = `${user.photo}?t=${Date.now()}`;
    //   const getInitialPhoto = async () => {
    //     const { success, error, value } = await userPhotos.getProfilePhoto(user.email, 'cropped');
    //     if (error) {
    //       console.log('error retreiving user photo on mount: ', error)
    //       return
    //     }
    //     if (success) {
    //       setPhoto(value);
    //     }
    //   }
    //   getInitialPhoto();
    //   // setPhoto(cacheBustedUrl);
    // }
    if (user) {
      setPhoto(user.photo);
    }
    if (user && user.admin) {
      const fetchUsers = async () => {
        const users = await getAllUsers();
        setUsers(users);
      }
      fetchUsers();
    }
  }, [user])

  // useEffect(() => {
  //   console.log('photo changed: ', photo)
  // }, [photo])

  useEffect(() => {
    if (message) {
      alert(message);
    }
  }, [message])

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
  const getAllUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('active', true);

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
  const handleFileChange = async (e) => {
    console.log('file upload for user photo changed: ', e);
    const file = e.target.files[0];
    const { success, error, value } = await userPhotos.setProfilePhoto(user.email, 'original', file);

    if (error) {
      console.log('Error uploading file to supabase storage')
    }
    if (value) {
      const { success: updatedTable, error: errorUpdatingTable } = await userPhotos.setPhotoInUsersTable(user.email, value);
      if (errorUpdatingTable) {
        console.log('Error updating users table with new photo url')
      }
      setPhoto(value)
    }
  }
  const afterCrop = async () => {
    // update users table here
    setCropActive(false);
    const { success, value, error } = await userPhotos.getProfilePhoto(user.email, 'cropped')
    if (error) {
      console.log('Error in afterCrop function retreiving new cropped photo from supabase after crop complete')
      return
    }
    if (success) {
      const { success, error} = await userPhotos.setPhotoInUsersTable(user.email, value)
      if (error) {
        console.log('error setting the new photo in the users table inside afterCrop function: ', error)
      }
      setPhoto(value)
      return
    }
  }
  const removeUser = async (email) => {
    try {
      // now call the server to revoke the user's auth
      const response = await fetch('/api/removeUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userToRemove }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('User deleted successfully')
      } else {
        console.error('Error removing user:', result.error);
        return;
      }

      const newUsers = users.filter(user => user.email !== email);
      setUsers(newUsers);

    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  const userPhoto = (editOrCrop, handler) => (
    <div className={styles.currentPhotoPreviewWrapper}>
      {photo ? (
        <img src={photo} alt='User Photo' className={user.photo ? styles.currentPhotoPreview : styles.userIcon} />
      ) : (
        userIcon
      )}

      {(editOrCrop === 'edit' || (editOrCrop === 'crop' && photo)) && (
        <FontAwesomeIcon
          icon={editOrCrop === 'edit' ? faPencil : faCrop}
          className={styles.editIcon}
          onClick={handler}
        />
      )}

    </div>
  );
  const updatePhotoModalContent = (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContentWrapper}>
        <FontAwesomeIcon icon={faCircleChevronLeft} className={styles.modalBackButton} onClick={() => {setCropActive(false); setModalIsOpen(false)}} />
        <p className={styles.infoLabel}>Crop Or Change Photo</p>
        {!photo && <p>No photo current set. Upload a photo here</p>}

        <input className={styles.photoInput} type="file" name="photo" onChange={(e) => handleFileChange(e)}/>
        <div className={styles.cropWrapper}>
          {cropActive ?
            <CroppablePhoto
              photo={photo}
              ratio={1}
              bucket={'users'}
              filePath={`photos/${user.email}`}
              setCropActive={setCropActive}
              afterUpload={afterCrop}
            /> :
            userPhoto('crop', async () => {
              const { success, error, value } = await userPhotos.getProfilePhoto(user.email, 'original');

              if (error) {
                console.log('error setting photo to original for crop');
                return;
              }
              setPhoto(value);
              setCropActive(true)
            })
          }
        </div>
      </div>
    </div>
  )
  const handlePasswordChange = async () => {
    try {
      const response = await fetch('/api/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword, id: user.auth_id}),
      });

      if (response.ok) {
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
    <div className='adminPageWrapper' >
      <div className={styles.pageWrapper}>
        {modalIsOpen && updatePhotoModalContent}
        <div className={styles.userInfo}>
          {userPhoto('edit', () => setModalIsOpen(true))}

          <p className='smallerTitle'>{user ? `${user.first_name || 'User'} ${user.last_name || 'Name'}` : 'User Name'}</p>
          <p className={styles.info}>{user ? `${user.position}` : 'Position'}</p>
        </div>

        <div className={styles.editUserInfoWrapper}>

          {/* <h3 className={styles.infoLabel}>Change Email</h3>
        <div className={styles.inputWrapper}>
          <input className={styles.updateInput} type='email' placeholder={user.email} />
          <button className={styles.inviteButton}>Confirm</button>
        </div> */}

          <h3 className='smallerTitle'>Change Password</h3>
          <div className={styles.inputWrapper}>
            <p>{`New passwords must have `}</p>
            <input className={styles.updateInput}
              type='password'
              value={newPassword}
              placeholder='Enter new password'
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              className={styles.inviteButton}
              onClick={(e) => {handlePasswordChange()}}
            >Confirm</button>
          </div>

          {user.admin &&
        <>
          <h3 className='smallerTitle'>Invite New User</h3>
          <div className={styles.inputWrapper}>
            <input
              className={styles.updateInput}
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              type='email'
              placeholder='Enter email address'
            />
            <label className={styles.adminLabel}>User Permissions</label>
            <select
              className={styles.newUserTypeSelect}
              type='checkbox'
              checked={newUserAdminStatus}
              onChange={() => setNewUserAdminStatus(!newUserAdminStatus)}>
              <option value={false}>Standard User</option>
              <option value={true}>Administrator</option>
            </select>
            <p className={styles.info}>{`Standard Users can create content and edit only the content they've created`}</p>
            <p className={styles.info}>{`Administrators can invite/remove users and edit all content, including content created by another user.`}</p>
            <button
              className={styles.inviteButton}
              onClick={() => {if (newUserEmail) {sendRequestToInviteNewUser(newUserEmail)}}}
            >Send Invite</button>
          </div>
        </>
          }

          { user.admin &&
        <>
          <h3 className='smallerTitle'>Remove User</h3>
          <div className={styles.inputWrapper}>
            <select
              className={styles.updateInput}
              value={userToRemove}
              onChange={(e) => setUserToRemove(e.target.value)}
              type='email'
            >
              <option value=''>{users.length ? 'Select user to remove' : 'No users to remove yet'}</option>
              {users.map((user, index) => {
                return <option key={index} value={user.email}>{`${user.first_name} ${user.last_name } - ${user.email}`}</option>
              })}
            </select>
            <button
              className={styles.inviteButton}
              onClick={() => {if (userToRemove) {removeUser(userToRemove)}}}
            >
              Remove
            </button>
          </div>
        </>
          }
        </div>
        {user.admin &&
      <div className={styles.inputWrapper}>
        <button className={styles.archiveButton}>MOVE TO NEW SCHOOL YEAR</button>
        <p className={styles.archiveInstructions}>{`When you're done adding posts for the school year, click this button
      to send all current posts to the archive and switch the app over to a new school year. All posts will be removed from the main page, and the year's archived
      posts will no longer be editable.`}</p>
        <h3 className={styles.warning}>***CANNOT BE UNDONE***</h3>
      </div>
        }
      </div>
    </div>
  )
}

// if no photo, render icon

// if photo, render photo with pencil icon to edit crop

// on file change or pencil icon click, render CroppablePhoto component(croppable file, and confirm button)