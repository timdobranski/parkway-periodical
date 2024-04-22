'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import supabase from '../../../utils/supabase';
import styles from './new-link.module.css';

export default function NewLinkPage() {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    expiration: '',
    action: 'remind'
  });
  const searchParams = useSearchParams();
  const linkId = searchParams.get('id');

  useEffect(() => {
    const fetchLinkData = async () => {
      if (linkId) {
        const { data, error } = await supabase
          .from('links')
          .select('*')
          .eq('id', linkId)
          .single();

        if (data) {
          setFormData({
            title: data.title || '',
            url: data.url || '',
            description: data.description || '',
            expiration: data.expiration || '',
            action: data.action || 'remind'
          });
        }

        if (error) {
          console.error('Error fetching link data:', error);
        }
      }
    };

    fetchLinkData();
  }, [linkId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, url, description, expiration, action } = formData;

    // Update the database with either an insert or update based on the presence of linkId
    const { data, error } = await supabase
      .from('links')
      .upsert({
        id: linkId,
        title,
        url,
        description,
        expiration,
        action
      });

    if (error) {
      console.error('Error updating database:', error);
    } else {
      console.log('Successfully updated database:', data);
    }
  };

  return (
    <div className='feedWrapper'>
      <div className='post'>
        <h1 className='pageTitle'>{linkId ? `Editing ${formData.title} Link`: 'NEW LINK'}</h1>
        <p>{`Use this form to add a new link to the site. Links must have a title and a URL.`}</p>
        <p>{`Links often change, especially at the start of each new school year. You can set an expiration date for your links if you like.`}</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <label htmlFor='title' className={styles.label}>Title</label>
            <input type='text' id='title' name='title' className={styles.input} value={formData.title} onChange={handleChange} />
          </div>
          <div className={styles.formSection}>
            <label htmlFor='url' className={styles.label}>URL</label>
            <input type='text' id='url' name='url' className={styles.input} value={formData.url} onChange={handleChange} />
          </div>
          <div className={styles.formSection}>
            <label htmlFor='description' className={styles.label}>Description</label>
            <textarea id='description' name='description' className={styles.input} value={formData.description} onChange={handleChange} />
          </div>
          <div className={styles.formSection}>
            <label className={styles.label}>Set Expiration Date (optional)</label>
            {!formData.expiration && <p className='noMargin'>No expiration currently set</p>}
            <input type='date' id='expiration' name='expiration' className={styles.input} value={formData.expiration} onChange={handleChange} />
          </div>
          <div className={styles.formSection}>
            <label htmlFor='reminder' className={styles.label}>On Expire</label>
            <select id="action-select" name='action' className={styles.onExpire} value={formData.action} onChange={handleChange}>
              <option value="remind">Remind to Update Link</option>
              <option value="delete">Delete Link</option>
            </select>
          </div>
          <button type='submit' className={styles.submitButton}>Submit</button>
        </form>
      </div>
    </div>
  )
}
