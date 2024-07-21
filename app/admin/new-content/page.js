'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';
import styles from './new-content.module.css';
import { useRouter } from 'next/navigation';
import CroppablePhoto from '../../../components/CroppablePhoto/CroppablePhoto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPencil, faCrop, faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useAdmin } from '../../../contexts/AdminContext';

export default function NewContentPage() {
  const { isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, setUser } = useAdmin();
  const supabase = createClient();
  const router = useRouter()
  const [photo, setPhoto] = useState('');
  const [croppedPhoto, setCroppedPhoto] = useState('');
  const [cropActive, setCropActive] = useState(false);
  // const [step, setStep] = useState(1); // step 1: add info, step 2: add/crop photo
  const [mode, setMode] = useState('');

  // define which values should be collected for each content type
  const linkFormData = {
    title: '',
    url: '',
    description: '',
    category: '',
    expires: '',
    deleteOnExpire: false
  };
  const clubFormData = {
    title: '',
    when: '',
    image: '',
    description: '',
    expires: '',
    deleteOnExpire: false
  };
  const electiveFormData = {
    title: '',
    description: '',
    expires: '',
    deleteOnExpire: false,
    duration: '',
    cte: false,
    image: '',
    pathway: ''
  };
  const staffFormData = {
    name: '',
    position: '',
    image: '',
    email: '',
    phone: '',
    bio: '',
    department: '',
    expires: '',
    deleteOnExpire: false
  };
  const eventFormData = {
    title: '',
    description: '',
    expires: '',
    deleteOnExpire: false,
    author: '',
    image: '',
    date: '',
    startTime: '',
    endTime: ''
  };
  const introText = {
    links: `Use this form to add or update a link on the website. Links must have a title and a URL.
    Links often change, especially at the start of each new school year. You can set an expiration date for your links if you like.`,
    staff: `Use this form to add or update a new staff member's information and photo on the staff section of the website. This won't invite that member to join the app.
    If your account supports that feature, you can invite new staff to the app via the Settings page.`,
    electives: `Use this form to add or update an elective on the website. To help keep the electives up to date, you can set an expiration date for your elective. Once the date
    is reached, you can set your elective to either delete automatically, or to remind you to update it.`,
    clubs: `Use this form to add or update a school club on the website. To help keep the clubs up to date, you can set an expiration date for your club. Once the date
    is reached, you can set your club to either delete automatically, or to remind you to update it.`,
    events: `Use this form to add or update an event on the website. To help keep the events up to date, you can set an expiration date for your event. Once the date
    is reached, you can set your event to either delete automatically, or to remind you to update it.`
  }
  // initialize form data state
  const [formData, setFormData] = useState({});
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // if user is editing an existing item, there will be an id in the URL
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const type = searchParams.get('type');

  useEffect(() => {
    if (id) {
      setMode('edit');
    } else {
      setMode('create');
    }
  }, [id])
  // convenience variable for singular content type
  const singularType = type.slice(-1) === 's' ? type.slice(0, -1) : type;

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
            setFormData(linkFormData);
            break;
          case 'clubs':
            setFormData(clubFormData);
            break;
          case 'electives':
            setFormData(electiveFormData);
            break;
          case 'staff':
            setFormData(staffFormData);
            break;
          case 'events':
            setFormData(eventFormData);
            break;
          default:
            console.error(`Unsupported type: ${type}`);
        }
      }

    };
    fetchLinkData();
  }, [id, type]);


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
    }
  };
  // submit the form data to the database
  const handleSubmit = async (e) => {
    e.preventDefault();

    // if there's an id, we're updating an existing item, so we need to include it in the form data
    if (id) formData.id = id;

    // sanitize date field for database if empty
    formData.expires = expires || null

    // Determine the operation based on linkId's presence
    const operation = id ? 'update' : 'insert';

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
    <div className={styles.photoUploadWrapper}>
      {mode === 'edit' ?
        <label className={styles.label}>Photo</label> :
        <>
          <h1 className='pageTitle'>CHOOSE PHOTO</h1>
          <p>Choose a photo to represent your {singularType}. If you skip this step, a placeholder photo will be added.</p>
        </>
      }
      <input type='file' name='image' className={styles.photoInput} onChange={handlePhotoChange} />

      {photo && photo !== `/images/${type}/${singularType}Placeholder.webp` &&
      cropActive ?
        <FontAwesomeIcon icon={faCircleChevronLeft} className={styles.cropIcon} onClick={() => setCropActive(true)} /> :
        <FontAwesomeIcon icon={faCrop} className={styles.cropIcon} onClick={() => setCropActive(true)} />}

      {cropActive ?
        <CroppablePhoto
          photo={photo}
          ratio={2.6}
          bucket={'contentTypes'}
          filePath={`${type}/${formData.title || formData.name}`}
          setCropActive={setCropActive}
          afterUpload={afterPhotoUpload}
        />
        :
        <img src={photo} className={styles.existingImagePreview}/>
      }
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
      <div className={styles.groupedFormSections}>
        {formData.startTime !== undefined &&
      <div className={styles.halfFormSection}>
        <label htmlFor='description' className={styles.label}>Starts At:</label>
        <input type='text' name='startTime' className={`${styles.input} ${styles.dateAndTimeInputs}`} value={formData.startTime} onChange={handleChange} />
        <p className={styles.optional}>optional</p>

      </div>
        }
        {formData.endTime !== undefined &&
        <div className={styles.halfFormSection}>
          <label htmlFor='description' className={styles.label}>Ends At:</label>
          <input type='text' name='endTime' className={`${styles.input} ${styles.dateAndTimeInputs}`} value={formData.endTime} onChange={handleChange} />
          <p className={styles.optional}>optional</p>
        </div>
        }
      </div>
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
          <option value="Year Long">Year Long</option>
          <option value="Trimester">Trimester</option>
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

      {formData.image && editPhoto}

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
    <div className='adminFeedWrapper'>
      <div className='post' style={{boxShadow: '0 0 5px rgba(0, 0, 0, .5)'}}>

        {/* page title & intro paragraph */ }
        <h1 className='pageTitle'>{mode === 'edit' ? `EDITING ${singularType.toUpperCase()}` : `ADD NEW ${singularType.toUpperCase()}`}</h1>
        <p>{introText[type]}</p>

        {formData && form}

      </div>
    </div>
  )
}
