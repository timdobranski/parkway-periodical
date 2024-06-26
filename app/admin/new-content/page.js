'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import supabase from '../../../utils/supabase';
import styles from './new-content.module.css';
import { useRouter } from 'next/navigation';

export default function NewContentPage() {
  const router = useRouter()
  const linkFormData = {
    title: '',
    url: '',
    description: '',
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
    image: ''
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
  const introText = {
    links: `Use this form to add or update a link on the website. Links must have a title and a URL.
    Links often change, especially at the start of each new school year. You can set an expiration date for your links if you like.`,
    staff: `Use this form to add or update a new staff member's information and photo on the staff section of the website. This won't invite that member to join the app.
    If your account supports that feature, you can invite new staff to the app via the Settings page.`,
    electives: `Use this form to add or update an elective on the website. To help keep the electives up to date, you can set an expiration date for your elective. Once the date
    is reached, you can set your elective to either delete automatically, or to remind you to update it.`,
    clubs: `Use this form to add or update a school club on the website. To help keep the clubs up to date, you can set an expiration date for your club. Once the date
    is reached, you can set your club to either delete automatically, or to remind you to update it.`
  }
  const [formData, setFormData] = useState({});

  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const type = searchParams.get('type');
  const singularType = type.slice(-1) === 's' ? type.slice(0, -1) : type;

  useEffect(() => {
    console.log('Form data changed: ', formData);
  }, [formData])


  useEffect(() => {
    const fetchLinkData = async () => {
      if (id) {
        const { data, error } = await supabase
          .from(type)
          .select('*')
          .eq('id', id)
          .single();

        if (data) {
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
          default:
            console.error(`Unsupported type: ${type}`);
        }
      }

    };
    fetchLinkData();
  }, [id, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handlePhotoChange = () => {
    const uploadPhoto = async() => {

      const { data, error } = await supabase
        .storage
        .from(type)
        .upload('public/avatar1.png', avatarFile, {
          cacheControl: '3600',
          upsert: false
        })
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, url, description, bio, when, expires, deleteOnExpire, duration, cte } = formData;

    // Convert empty string in 'expires' to null if necessary
    const effectiveExpires = expires === '' ? null : expires;

    // Prepare the payload dynamically based on whether linkId is available
    const payload = id ?
      { id: id, title, url, description, expires, deleteOnExpire, when, bio, duration, cte } :
      { title, url, description, expires, deleteOnExpire, duration, cte, bio, when };

    // Determine the operation based on linkId's presence
    const operation = id ? 'update' : 'insert';

    const { data, error } = await supabase
      .from(type)
      .upsert(payload);

    if (error) {
      console.error(`Error ${operation} database:`, error);
    } else {
      console.log(`Successfully ${operation} database:`, data);
      router.push(`/admin/list?type=${type}`);  // Assuming 'router' is correctly defined and imported
    }
  };
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
      <div className={styles.formSection}>
        <label htmlFor='description' className={styles.label}>Start Time</label>
        <input type='time' name='startTime' className={`${styles.input} ${styles.dateAndTimeInputs}`} value={formData.date} onChange={handleChange} />
      </div>
      }
      {formData.endTime !== undefined &&
        <div className={styles.formSection}>
          <label htmlFor='description' className={styles.label}>End Time</label>
          <input type='time' name='endTime' className={`${styles.input} ${styles.dateAndTimeInputs}`} value={formData.date} onChange={handleChange} />
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
        <select  name='cte' className={styles.onExpire} value={formData.deleteOnExpire} onChange={handleChange}>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </div>
      }

      {formData.image !== undefined &&
      <div className={styles.formSection}>
        <label className={styles.label}>Photo</label>
        {formData.image &&
          <img src={formData.image}className={styles.existingImagePreview}/>
        }
        <input type='file' name='image' className={styles.photoInput} onChange={handlePhotoChange} />
      </div>
      }

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
      <button type='submit' className={styles.submitButton}>{id ? `Update ${singularType}` : `Add ${type.slice(-1) === 's' ? type.slice(0, -1) : type}`}</button>
    </form>
  )

  return (
    <div className='adminFeedWrapper'>
      <div className='post'>
        <h1 className='pageTitle'>{id ? `EDITING ${singularType.toUpperCase()}` : `ADD NEW ${singularType.toUpperCase()}`}</h1>
        <p>{introText[type]}</p>
        {formData && form}

      </div>
    </div>
  )
}
