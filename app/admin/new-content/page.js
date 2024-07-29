'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';
import styles from './new-content.module.css';
import { useRouter } from 'next/navigation';
import CroppablePhoto from '../../../components/CroppablePhoto/CroppablePhoto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPencil, faCrop, faX } from '@fortawesome/free-solid-svg-icons';
import { useAdmin } from '../../../contexts/AdminContext';
import formDataAndIntroText from './formData';

export default function NewContentPage() {
  const { isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, setUser } = useAdmin();
  const { linkFormData, clubFormData, electiveFormData, staffFormData, eventFormData } = formDataAndIntroText;
  const supabase = createClient();
  const router = useRouter()
  const [croppedPhoto, setCroppedPhoto] = useState('');
  const [croppedPhotoUrl, setCroppedPhotoUrl] = useState('');
  const [cropActive, setCropActive] = useState(false);
  const [mode, setMode] = useState('');

  // initialize form data state
  const [formData, setFormData] = useState({});
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // if user is editing an existing item, there will be an id in the URL
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const type = searchParams.get('type');


  // convenience variable for singular content type
  const singularType = type.slice(-1) === 's' ? type.slice(0, -1) : type;
  const [photo, setPhoto] = useState(`/images/${type}/${singularType}Placeholder.webp`);
  const introText = formDataAndIntroText[`${singularType}FormData`].introText;

  useEffect(() => {
    if (id) {
      setMode('edit');
    } else {
      setMode('create');
    }
  }, [id])

  useEffect(() => {
    console.log('Form data changed: ', formData);
  }, [formData])

  // populate the fields with existing data if editing, or with empty strings if adding new
  useEffect(() => {
    const fetchLinkData = async () => {
      if (id) {
        const { data, error } = await supabase
          .from(type)
          .select('*')
          .eq('id', id)
          .single();

        if (data) {
          // values in the database can be null, but we need them to be empty strings for the form
          const sanitizedData = Object.entries(data).reduce((acc, [key, value]) => {
            if (value === null) {
              acc[key] = key === 'deleteOnExpire' ? false : '';
            } else {
              acc[key] = value;
            }
            return acc;
          }, {});
          setFormData(sanitizedData);
        }
        if (error) {
          console.error('Error fetching link data:', error);
        }
      } else {
        // no existing data, so set form data to initial values defined above
        switch (type) {
          case 'links':
            setFormData(linkFormData.formData);
            break;
          case 'clubs':
            setFormData(clubFormData.formData);
            break;
          case 'electives':
            setFormData(electiveFormData.formData);
            break;
          case 'staff':
            setFormData(staffFormData.formData);
            break;
          case 'events':
            setFormData(eventFormData.formData);
            break;
          default:
            console.error(`Unsupported type: ${type}`);
        }
      }

    };
    fetchLinkData();
  }, [id, type]);

  useEffect(() => {
    setCropActive(false);
    if (croppedPhoto) {
      const url = URL.createObjectURL(croppedPhoto);
      setCroppedPhotoUrl(url);
      return () => URL.revokeObjectURL(url); // Cleanup URL object when component unmounts or URL changes
    }
  }, [croppedPhoto])

  useEffect(() => {
    if (croppedPhotoUrl) {
      formData.image = croppedPhotoUrl;
    }
  }, [croppedPhotoUrl])


  // update whichever field is being edited
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // upload photo and set photo url in item's database row
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      setPhoto(photoUrl);
      setCropActive(true);
    }
  };
  // submit the form data to the database
  const handleSubmit = async (e) => {
    e.preventDefault();

    const ensureExternalUrl = (url) => {
      if (!/^https?:\/\//i.test(url)) {
        return `http://${url}`;
      }
      return url;
    }

    for (const key in formData) {
      if (
        key !== 'expires' &&
        key !== 'startTime' &&
        key !== 'endTime' &&
        key !== 'author' &&
        key !== 'deleteOnExpire' &&
        key !== 'image' &&
        key !== 'cte' && // Add 'cte' to the exceptions
        !formData[key] &&
        formData[key] !== false // Allow false as a valid value
      ) {
        alert(`${key} is blank. Please fill in all inputs before adding this ${singularType}.`);
        return;
      }
    }

    //if the user has provided a url, make sure it starts with http to prevent local links
    if (formData.url) {
      formData.url = ensureExternalUrl(formData.url);
    }
    // if there's an id, we're updating an existing item, so we need to include it in the form data
    if (id) formData.id = id;

    // sanitize date field for database if empty
    if (formData.expires === '') {
      formData.expires = null;
    }

    // if there's a cropped photo, upload it, then include the url in the form data
    // if a user is editing an existing item, the photo will not be replaced unless they upload a new one and crop it

    if (croppedPhoto) {
      const filepath = `${type}/${formData.title || formData.name}/cropped`;

      const { data, error } = await supabase.storage
        .from('contentTypes')
        .upload(filepath, croppedPhoto, { upsert: true });

      if (error) {
        console.error('Error uploading photo:', error);
        return;
      }

      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from('contentTypes')
        .getPublicUrl(filepath);

      if (publicUrlError) {
        console.error('Error getting public URL:', publicUrlError);
        return;
      }

      formData.image = publicUrlData.publicUrl;
    }

    formData.author = user.id;

    // Determine the operation based on linkId's presence
    const operation = id ? 'update' : 'insert';
    console.log('formData before upload: ', formData);
    const { data, error } = await supabase
      .from(type)
      .upsert(formData);

    if (error) {
      console.error(`Error ${operation} database:`, error);
      alert(`There was an error creating your new ${singularType}. Please try again. If the issue persists, please contact support.`)
    } else {
      console.log(`Successfully ${operation}ed database:`, data);
      router.push(`/admin/list?type=${type}`);

    }
  };
  const afterPhotoUpload = async() => {
    const getAndSetNewPhoto = async () => {
      const { data, error } = await supabase
        .from(type)
        .select('image')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching photo:', error);
        return;
      }

      setPhoto(data.image);

    }
    getAndSetNewPhoto();
  }

  const editPhoto = (
    <div className={styles.formSection}>
      <div className={styles.photoUploadWrapper}>

        <h1 className={styles.label}>Choose Photo</h1>
        <p>Choose a photo to represent your {singularType}. If you skip this step, a placeholder photo will be added.</p>

        {/* // if the photo is not the default placeholder */}

        {cropActive ?
          <CroppablePhoto
            photo={photo}
            ratio={2.6}
            bucket={'contentTypes'}
            filePath={`${type}/${formData.title || formData.name}`}
            setCropActive={setCropActive}
            afterUpload={afterPhotoUpload}
            uploadOrSet='set'
            setCroppedPhoto={setCroppedPhoto}
          />
          :
          <>

            <input type='file' name='image' className={styles.photoInput} onChange={handlePhotoChange} />

            {photo && photo !== `/images/${type}/${singularType}Placeholder.webp` ?
              <div className={styles.cropControlsWrapper}>
                <div className={styles.cropLabelWrapper} onClick={() => setCropActive(true)} >
                  <FontAwesomeIcon icon={faCrop} className={styles.cropIcon} />
                  <p className={styles.cropLabel}>Crop Photo</p>
                </div>
                <div className={styles.removePhotoWrapper} onClick={() => setCropActive(true)} >
                  <FontAwesomeIcon icon={faX} className={styles.cropIcon} />
                  <p className={styles.cropLabel}>Remove Photo</p>
                </div>
              </div>
              :
              <p className={styles.placeholderImageLabel}>Placeholder image set</p>
            }
            <img src={croppedPhotoUrl !== '' ? croppedPhotoUrl : photo} className={styles.existingImagePreview}/>
          </>
        }
      </div>
    </div>
  )

  const form = (
    <form className={styles.form} onSubmit={handleSubmit}>
      {formData.title !== undefined &&
      <div className={styles.formSection}>
        <label htmlFor='title' className={styles.label}>Name</label>
        <input type='text'  name='title' className={styles.input} value={formData.title} onChange={handleChange} />
      </div>
      }
      {formData.name !== undefined &&
      <div className={styles.formSection}>
        <label htmlFor='title' className={styles.label}>Name</label>
        <input type='text' name='name' className={styles.input} value={formData.name} onChange={handleChange} />
      </div>
      }
      {formData.position !== undefined &&
      <div className={styles.formSection}>
        <label htmlFor='title' className={styles.label}>Position</label>
        <input type='text' name='position' className={styles.input} value={formData.position} onChange={handleChange} />
      </div>
      }
      {formData.url !== undefined && <div className={styles.formSection}>
        <label htmlFor='url' className={styles.label}>URL</label>
        <input type='text' id='url' name='url' className={styles.input} value={formData.url} onChange={handleChange} />
      </div>}

      {formData.description !== undefined &&
      <div className={styles.formSection}>
        <label htmlFor='description' className={styles.label}>Description</label>
        <textarea name='description' className={`${styles.input} ${styles.textArea}`} value={formData.description} onChange={handleChange} />
      </div>
      }
      {formData.bio !==undefined &&
      <div className={styles.formSection}>
        <label htmlFor='description' className={styles.label}>Introduction</label>
        <textarea name='bio' className={styles.input} value={formData.bio} onChange={handleChange} />
      </div>
      }
      {formData.date !== undefined &&
      <div className={styles.formSection}>
        <label htmlFor='description' className={styles.label}>Event Date</label>
        <input type='date' name='date' className={`${styles.input} ${styles.dateAndTimeInputs}`} value={formData.date} onChange={handleChange} />
      </div>
      }
      {formData.startTime !== undefined &&
      <div className={styles.groupedFormSections}>
        <div className={styles.halfFormSection}>
          <label htmlFor='description' className={styles.label}>Starts At:</label>
          <input type='text' name='startTime' className={`${styles.input} ${styles.dateAndTimeInputs}`} value={formData.startTime} onChange={handleChange} />
          <p className={styles.optional}>optional</p>

        </div>

        <div className={styles.halfFormSection}>
          <label htmlFor='description' className={styles.label}>Ends At:</label>
          <input type='text' name='endTime' className={`${styles.input} ${styles.dateAndTimeInputs}`} value={formData.endTime} onChange={handleChange} />
          <p className={styles.optional}>optional</p>
        </div>
      </div>
      }
      {formData.when !== undefined &&
        <div className={styles.formSection}>
          <label htmlFor='description' className={styles.label}>When We Meet</label>
          <textarea name='when' className={styles.input} value={formData.when} onChange={handleChange} />
        </div>
      }
      {formData.duration !== undefined &&
      <div className={styles.formSection}>
        <label htmlFor='reminder' className={styles.label}>Duration</label>
        <select  name='duration' className={styles.onExpire} value={formData.duration} onChange={handleChange}>
          <option value="YEAR LONG">Year Long</option>
          <option value="TRIMESTER">Trimester</option>
        </select>
      </div>
      }
      {formData.cte !== undefined &&
      <div className={styles.formSection}>
        <label htmlFor='reminder' className={styles.label}>CTE Class?</label>
        <select  name='cte' className={styles.onExpire} value={formData.cte} onChange={handleChange}>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </div>
      }
      {formData.pathway !== undefined &&
      <div className={styles.formSection}>
        <label htmlFor='reminder' className={styles.label}>Pathway</label>
        <select  name='pathway' className={styles.onExpire} value={formData.pathway} onChange={handleChange}>
          <option value="Traditional Electives">Traditional Electives</option>
          <option value="Medical Pathway">Medical Pathway</option>
          <option value="Engineering & Design Pathway">Engineering & Design Pathway</option>
          <option value="Business Technology & Design Pathway">Business Technology & Design Pathway</option>
        </select>
      </div>
      }
      {formData.category !== undefined &&
      <div className={styles.formSection}>
        <label htmlFor='reminder' className={styles.label}>Category</label>
        <select  name='category' className={styles.onExpire} value={formData.category} onChange={handleChange}>
          <option value="All Resources">No Category</option>
          <option value="ESS">ESS</option>
          <option value="Library">Library</option>
          <option value="Cafeteria">Cafeteria</option>
          <option value="PE">PE</option>
          <option value="Counciling & Wellness">Counciling & Wellness</option>
        </select>
      </div>
      }

      {formData.image !== undefined && editPhoto}

      {formData.expires !== undefined &&
      <div className={styles.formSection}>
        <label className={styles.label}>Set Expiration Date (optional)</label>
        <input type='date' id='expiration' name='expires' className={styles.input} value={formData.expires} onChange={handleChange} />
        {!formData.expires && <p className={styles.noExpiration}>No expiration currently set</p>}
      </div>
      }

      {formData.expires !== undefined &&
      <div className={styles.formSection}>
        <label htmlFor='reminder' className={styles.label}>On Expire</label>
        <select name='deleteOnExpire' className={styles.onExpire} value={formData.deleteOnExpire} onChange={handleChange}>
          <option value="remind">{`Remind to Update ${singularType}`}</option>
          <option value="delete">{`Delete ${singularType}`}</option>
        </select>
      </div>
      }
      <button
        type='submit'
        className={styles.submitButton}
      >
        {id ? `Update ${singularType}` : `Add ${type.slice(-1) === 's' ? type.slice(0, -1) : type}`}</button>
    </form>
  )

  return (
    <div className='adminPageWrapper' >
    <div className='adminFeedWrapper'>
      <div className='post' style={{boxShadow: '0 0 5px rgba(0, 0, 0, .5)'}}>

        {/* page title & intro paragraph */ }
        <h1 className='pageTitle'>{mode === 'edit' ? `EDITING ${singularType.toUpperCase()}` : `ADD NEW ${singularType.toUpperCase()}`}</h1>
        <p>{introText}</p>

        {formData && form}

      </div>
    </div>
    </div>
  )
}
