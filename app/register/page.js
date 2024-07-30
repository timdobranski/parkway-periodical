'use client'

import styles from './register.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPencil, faImage } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '../../utils/supabase/client';
import CroppablePhoto from '../../components/CroppablePhoto/CroppablePhoto';
import userPhotos from '../../utils/userPhotos';

export default function Register() {
  const supabase = createClient();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [includeInStaff, setIncludeInStaff] = useState(true);
  const [aboutMe, setAboutMe] = useState('');
  const [session, setSession] = useState({});
  const [photo, setPhoto] = useState('/images/users/placeholder.webp');
  const [croppedPhoto, setCroppedPhoto] = useState('');
  const [filePath, setFilePath] = useState('');
  const [cropActive, setCropActive] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [phoneExt, setPhoneExt] = useState('');
  const [previousUser, setPreviousUser] = useState(false);
  const placeholderPhoto = '/images/users/placeholder.webp';


  // returns obj with success, error, & value keys
  // takes in user email, type string 'cropped' or 'original', and file if setting
  const { getProfilePhoto, setProfilePhoto } = userPhotos;
  // check auth
  useEffect(() => {
    const getUserAuthData = async () => {
      // Check if there is a session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      // If no session, redirect user to public home
      if (sessionError || !sessionData.session) {
        // router.push('/home');
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
        // router.push('/admin/home');
      }
    };

    getUserAuthData();
  }, [router]);
  // set the photo if it already exists. Check cropped, then original, based on email and users bucket
  useEffect(() => {
    const setInitialPhoto = async() => {
      const { success: successRetreivingCroppedPhoto, error: errorRetreivingCroppedPhoto, value: croppedPhoto } = await getProfilePhoto(session.user.email, 'cropped');
      if (successRetreivingCroppedPhoto) {
        setPhoto(croppedPhoto)
        return
      }
      const { success: successRetreivingOriginalPhoto, error: errorRetreivingOriginalPhoto, value: originalPhoto } = await getProfilePhoto(session.user.email, 'original');
      if (successRetreivingOriginalPhoto) {
        setPhoto(originalPhoto)
        return
      }
    }
    if (session && session.user) {
      setInitialPhoto()
    }
  }, [session])

  useEffect(() => {
    if (!includeInStaff) {setAboutMe(''); setPhoneExt('')}
  }, [includeInStaff])

  // useEffect (() => {
  //   console.log('photo: ', photo)
  // }, [photo])

  useEffect(() => {
    if (!session.user) {
      console.log('no session user')
      return;
    }
    console.log('checking for existing user data with email: ', session)
    const checkForExistingUser = async () => {
      const { data: existingUserData, error: existingUserError } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user?.email)
        .single();

      if (existingUserError) {
        console.error('Error fetching existing user data: ', existingUserError)
      }

      if (existingUserData) {
        console.log("existing user data: ", existingUserData)
        setFirstName(existingUserData.first_name);
        setLastName(existingUserData.last_name);
        setPosition(existingUserData.position);
        setEmail(existingUserData.email);
        // setIncludeInStaff(existingUserData.include_in_staff);
        setAboutMe(existingUserData.about_me);
        setPhoneExt(existingUserData.phone_ext);
        setPhoto(existingUserData.photo)
        setPreviousUser(true);
      }
    }
    checkForExistingUser();
  }, [session])



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
    if (cropActive) {
      alert(`You haven't finished setting your photo. If you'd like to add an optional photo, please finish
        cropping the one you've uploaded. Otherwise, you can remove it.`)
    }

    // conditions are met; add user
    const registrationData = { firstName, lastName, position, password, includeInStaff, aboutMe, phoneExt };
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
  // retreive supabase photo: original or cropped type
  // const getProfilePhoto = async (type) => {
  //   console.log('getting profile photo from: ', `${filePath}/${type}`)
  //   const { data } = await supabase
  //     .storage
  //     .from('users')
  //     .getPublicUrl(`${filePath}/${type}`);


  //   console.log('getProfilePhoto getPublicUrl returned: ', data.publicUrl)
  //   const cacheBustedUrl = `${data.publicUrl}?cache_bust=${new Date().getTime()}`;
  //   // if there's a photo, set it. If not, console log the error
  //   const response = await fetch(cacheBustedUrl);
  //   if (!response.ok) {
  //     setPhoto('');
  //     setLoadingPhoto(false);
  //     console.error('User photo not found, received:', response);
  //     return;
  //   }
  //   console.log('user photo response: ', response)
  //   setPhoto(cacheBustedUrl);
  //   setLoadingPhoto(false)
  // }

  const getOriginalPhotoForCrop = async () => {
    console.log('inside getOriginalPhotoForCrop')
    setLoadingPhoto(true);
    const { success, value, error } = await getProfilePhoto(session.user.email, 'original');
    if (success) {
      setPhoto(value);
      setLoadingPhoto(false);
      setCropActive(true);
    }
  }
  const afterCropUpload = async() => {
    console.log('inside afterCrop, setting loading to true')
    setLoadingPhoto(true);
    const { success, error, value }= await getProfilePhoto(session.user.email, 'cropped');
    if (!success) {
      alert(`Couldn't upload your cropped image at this time.`)
      console.log('Error retreiving cropped user profile photo: ', error)
      return;
    }
    setLoadingPhoto(false);
    setCropActive(false)
    setPhoto(value);
  }
  // when user selects photo, upload it, then download it to render
  const handleFileChange = async (event) => {
    setLoadingPhoto(true);

    if (cropActive) {
      setCropActive(false);
    }

    if (photo) {
      setPhoto('');
    }

    const file = event.target.files[0];
    if (!file) return;

    const uploadPhoto = await setProfilePhoto(session.user.email, 'original', file);
    if (!(uploadPhoto.success)) {
      console.log('error: ', uploadPhoto)
      setLoadingPhoto(false);
      alert(`Couldn't upload your photo at this time. Please try again later. Administrators have been notified.`);
      return;
    }

    const originalPhoto = await getProfilePhoto(session.user.email, 'original');
    if (originalPhoto.success) {
      setCropActive(true)
      setPhoto(originalPhoto.value);
    }
  };
  const instructions = 'To complete registration, fill in the fields below:';
  const previousUserInstructions = `Based on your email address, it looks like you've been here before. Welcome back!
  Your required info has been prefilled below, except for your password.
  If you'd like to make any changes, you can do so now.`;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.headerBar}>
        <img className={styles.logo} src='/images/logos/parkway.webp'/>
        <h1 className='siteTitle'>PARKWAY PERIODICAL</h1>
      </div>
      <h2 className='postTitle'>New User Signup</h2>
      <p className={styles.instructions}>{previousUser ? previousUserInstructions : instructions}</p>

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
          <label className={'smallerPostTitle'}>Profile Photo:</label>
          <input className={styles.photoInput} type="file" name="photo" onChange={handleFileChange}/>
          { photo ?
            cropActive ?
              <CroppablePhoto
                photo={photo}
                ratio={1}
                bucket={'users'}
                filePath={`photos/${session?.user?.email}`}
                setCropActive={setCropActive}
                afterUpload={afterCropUpload}
              /> :
              <>
                <div className={styles.photoWrapper} >
                  <img className={styles.photo} src={`${photo}`} />
                </div>
                {photo !== placeholderPhoto && <FontAwesomeIcon icon={faPencil} className={styles.cropIcon} onClick={() => getOriginalPhotoForCrop()}/>}
              </>

            :
            loadingPhoto ?
              <div className={styles.loadingMessageWrapper}>
                <p>Loading Photo...</p>
                <FontAwesomeIcon icon={faImage} className={styles.loadingSpinner} />
              </div>
              :
              <FontAwesomeIcon icon={faUser} className={styles.photoPlaceholder}/>
          }
        </div>

        <div className={styles.wideFormSection}>
          <label className={'smallerPostTitle'}>Show Me on Staff Page?</label>
          <p className={styles.instructions}>{`The staff page will display your name, position, phone extension, email, photo(if provided), and a short introduction that you can add below.`}</p>
          <input className={styles.checkbox} type="checkbox" name="include in staff" checked={includeInStaff} onChange={() => {setIncludeInStaff(!includeInStaff)}}/>
        </div>

        <div className={styles.wideFormSection}>
          {!includeInStaff && <p className={styles.textareaDisabledNotice}>{`To add the fields below, check the 'Show Me On Staff Page' box`}</p>}
          <label className={includeInStaff ? 'smallerPostTitle' : 'smallerPostTitleDisabled'}>About</label>
          <p className={`${styles.instructions} ${includeInStaff ? null : styles.disabledText}`}>Use this section to write a short introduction about yourself for users to read on the staff page</p>
          <textarea className={styles.formInput} disabled={!includeInStaff} maxLength={500} type="text" name="include in staff" value={aboutMe} onChange={(e) => {setAboutMe(e.target.value)}}/>
        </div>

        <div className={styles.wideFormSection} >
          <label className={includeInStaff ? 'smallerPostTitle' : 'smallerPostTitleDisabled'}>Phone Ext.</label>
          <input
            type='number'
            pattern="\d{4}"
            className={styles.phoneInput}
            disabled={!includeInStaff}
            value={phoneExt}
            onChange={e => setPhoneExt(e.target.value)}
          />
        </div>

        <button className={styles.completeSignupButton} type="submit" onClick={(e) => {finishSignup(e)}}>Complete Sign Up</button>
      </form>
    </div>
  );
}
