'use client'

import styles from './settings.module.css';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faPencil,
  faCrop,
  faCircleChevronLeft,
  faIdBadge,
  faKey,
  faUserPlus,
  faUserMinus,
  faBoxArchive,
} from '@fortawesome/free-solid-svg-icons';
import { createClient } from '../../../utils/supabase/client';
import CroppablePhoto from '../../../components/CroppablePhoto/CroppablePhoto';
import userPhotos from '../../../utils/userPhotos';
import { useAdmin } from '../../../contexts/AdminContext';
import adminUI from '../adminUI.module.css';


export default function Settings () {
  const supabase = createClient();
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserAdminStatus, setNewUserAdminStatus] = useState(false);
  const [users, setUsers] = useState([]);
  const [cropActive, setCropActive] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const placeholderPhoto = '/images/users/placeholder.webp';
  const [originalPhoto, setOriginalPhoto] = useState(''); // the photo to be passed into the CroppablePhoto component
  const [croppedPhoto, setCroppedPhoto] = useState(''); // the photo to be displayed in the UI userPhoto
  const [userPhotoIsValid, setUserPhotoIsValid] = useState(false);

  const [userToRemove, setUserToRemove] = useState('');
  const { isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, setUser } = useAdmin();

  // if the user's photo isn't valid, set it to the placeholder photo
  useEffect(() => {
    const checkImage = (url) => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.src = url;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
      });
    };

    if (croppedPhoto) {
      checkImage(croppedPhoto).then((valid) => {
        setUserPhotoIsValid(valid);
      });
    } else {
      setUserPhotoIsValid(false);
    }
  }, [croppedPhoto]);

  useEffect(() => {
    console.log('User in header: ', user)
  }, [user])

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
      setCroppedPhoto(user.photo);
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
        body: JSON.stringify({ email, admin: newUserAdminStatus }),
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

    // upload the file to supabase storage
    const response = await userPhotos.setProfilePhoto(user.email, 'original', file);
    console.log('response from setProfilePhoto: ', response);
    const { data, error } = response;

    if (error) {
      console.log('Error uploading file to supabase storage')
    }
    if (data) {
      console.log('success setting photo in storage: ', data)

      // update the users table with the new photo url
      const { success: updatedTable, error: errorUpdatingTable } = await userPhotos.setPhotoInUsersTable(user.email, data.path);
      if (errorUpdatingTable) {
        console.log('Error updating users table with new photo url')
      }
      console.log('data returned from photo upload: ', data)
      // update the photo in the ui
      setOriginalPhoto(data.publicUrl);
      setCropActive(true);
    }
    console.log('no error or value returned');
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
      setCroppedPhoto(value)
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

  const resetPhotoToDefault = async () => {
    // remove the photos from storage if exists - both cropped and original
    const { data, error } = await supabase
      .storage
      .from('users')
      .remove([`photos/${user.email}/cropped`, `photos/${user.email}/original`]);

    if (error) {
      console.log('error removing photos from storage: ', error);
    }
    // set the photo in the users table to the placeholder photo
    const { success, error: updateError } = await userPhotos.setPhotoInUsersTable(user.email, placeholderPhoto);
    if (updateError) {
      console.log('error updating photo in users table: ', updateError)

    }
    setCroppedPhoto(placeholderPhoto);
    setOriginalPhoto('');
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  // render photo on main page or in edit modal.
  // if rendered on main page, render photo with pencil icon to edit and handler to open edit modal
  // if rendered inside edit modal, AND IF PHOTO ISN'T THE PLACEHOLDER, render with crop icon to trigger crop mode and handler to open crop mode
  const userPhoto = (editOrCrop, handler) => (
    <div className={styles.currentPhotoPreviewWrapper}>

      <img src={userPhotoIsValid ? croppedPhoto : placeholderPhoto} alt='User Photo' className={styles.currentPhotoPreview} />

      {/* render either an edit or crop icon based on the editOrCrop prop. if we're in crop mode and the photo is the placeholder, don't render the crop icon or allow crop */}
      {(editOrCrop === 'edit' || (editOrCrop === 'crop' && croppedPhoto !== placeholderPhoto && userPhotoIsValid)) && (
        <FontAwesomeIcon
          icon={editOrCrop === 'edit' ? faPencil : faCrop}
          className={styles.editIcon}
          onClick={handler}
        />
      )}

      {/* {!userPhotoIsValid && <p className={styles.info}>Photo is not valid. Please upload a new photo.</p>} */}
    </div>
  );
  const updatePhotoModalContent = (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContentWrapper}>
        <FontAwesomeIcon icon={faCircleChevronLeft} className={styles.modalBackButton} onClick={() => {setCropActive(false); setModalIsOpen(false)}} />
        <p className={styles.cropLabel}>Crop Or Change Photo</p>

        {!croppedPhoto && <p>No photo currently set. Upload a photo here</p>}
        <div className={styles.updatePhotoOptionsWrapper}>
          {croppedPhoto !== placeholderPhoto && !cropActive &&
      <button className={styles.resetPhotoMessage}
        onClick={resetPhotoToDefault}
      >Reset Photo to Default
      </button>}

          {!cropActive && <input className={styles.photoInput} type="file" name="photo" onChange={(e) => handleFileChange(e)}/>}
        </div>

        <div className={styles.cropWrapper}>
          {cropActive ?
          // render the CroppablePhoto component
            <CroppablePhoto
              photo={originalPhoto}
              ratio={1}
              bucket={'users'}
              filePath={`photos/${user.email}`}
              setCropActive={setCropActive}
              afterUpload={afterCrop}
            /> :
            // render the cropped user photo with a crop icon to trigger crop mode when clicked
            userPhoto('crop', async () => {
              const { success, error, value } = await userPhotos.getProfilePhoto(user.email, 'original');

              if (error) {
                console.log('error setting photo to original for crop');
                setPhoto('/images/logos/parkway.webp');
                setCropActive(true);
              }
              setOriginalPhoto(value);
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
    <div className='adminPageWrapper'>
      <div className={adminUI.pageInner}>
        {modalIsOpen && updatePhotoModalContent}

        <div className={adminUI.headerRow}>
          <h1 className={`${adminUI.pageTitle} pageTitle`}>SETTINGS</h1>
        </div>

        <div className={styles.settingsStack}>
          <div className={adminUI.card}>
            <h3 className={styles.cardTitle}>
              <FontAwesomeIcon icon={faIdBadge} className={styles.sectionTitleIcon} />
              <span>Profile</span>
            </h3>
            <div className={styles.profileHeader}>
              <div className={styles.profilePhoto}>
                {userPhoto('edit', () => setModalIsOpen(true))}
                {(croppedPhoto === placeholderPhoto || !userPhotoIsValid) && (
                  <p className={styles.defaultPhotoMessage}>No photo provided; using default</p>
                )}
              </div>

              <div className={styles.profileMeta}>
                <p className={styles.profileName}>
                  {user ? `${user.first_name || 'User'} ${user.last_name || 'Name'}` : 'User Name'}
                </p>
                <p className={styles.profileSubtle}>{user ? `${user.position}` : 'Position'}</p>
              </div>
            </div>
          </div>

          <div className={adminUI.card}>
            <h3 className={styles.cardTitle}>
              <FontAwesomeIcon icon={faKey} className={styles.sectionTitleIcon} />
              <span>Change Password</span>
            </h3>
            <div className={styles.formStack}>
              <p className={styles.helperText}>Passwords must have six or more characters.</p>
              <input
                className={styles.updateInput}
                type='password'
                value={newPassword}
                placeholder='Enter new password'
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button className={styles.inviteButton} onClick={(e) => {handlePasswordChange()}}>
                Confirm
              </button>
            </div>
          </div>

          {user.admin && (
            <div className={adminUI.card}>
              <h3 className={styles.cardTitle}>
                <FontAwesomeIcon icon={faUserPlus} className={styles.sectionTitleIcon} />
                <span>Invite New User</span>
              </h3>
              <div className={styles.formStack}>
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
                  onChange={() => setNewUserAdminStatus(!newUserAdminStatus)}
                >
                  <option value={false}>Standard User</option>
                  <option value={true}>Administrator</option>
                </select>

                <p className={styles.helperText}>Standard Users can create content and edit only the content they&apos;ve created.</p>
                <p className={styles.helperText}>Administrators can invite/remove users and edit all content, including content created by another user.</p>
                <button
                  className={styles.inviteButton}
                  onClick={() => {if (newUserEmail) {sendRequestToInviteNewUser(newUserEmail)}}}
                >
                  Send Invite
                </button>
              </div>
            </div>
          )}

          {user.admin && (
            <div className={adminUI.card}>
              <h3 className={styles.cardTitle}>
                <FontAwesomeIcon icon={faUserMinus} className={styles.sectionTitleIcon} />
                <span>Remove User</span>
              </h3>
              <div className={styles.formStack}>
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
                <button className={`${styles.inviteButton} ${styles.dangerButton}`}
                  onClick={() => {if (userToRemove) {removeUser(userToRemove)}}}
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {user.admin && (
            <div className={adminUI.card}>
              <h3 className={styles.cardTitle}>
                <FontAwesomeIcon icon={faBoxArchive} className={styles.sectionTitleIcon} />
                <span>Archive School Year</span>
              </h3>
              <div className={styles.formStack}>
                <button className={styles.archiveButton}>MOVE TO NEW SCHOOL YEAR</button>
                <p className={styles.archiveInstructions}>{`When you're done adding posts for the school year, click this button
to send all current posts to the archive and switch the app over to a new school year. All posts will be removed from the main page, and the year's archived
posts will no longer be editable.`}</p>
                <p className={styles.warning}>***CANNOT BE UNDONE***</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// if no photo, render icon

// if photo, render photo with pencil icon to edit crop

// on file change or pencil icon click, render CroppablePhoto component(croppable file, and confirm button)