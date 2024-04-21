'use client'

import styles from './new-link.module.css'
import supabase from '../../../utils/supabase';
import  { useState } from 'react';

export default function NewLinkPage() {
  const [action, setAction] = useState('remind');

  return (
    <div className='feedWrapper'>
      <div className='post'>
        <h1 className='pageTitle'>NEW LINK</h1>
        <p>{`Use this form to add a new link to the site. Links must have a title and a URL.`}</p>
        <p>{`Links often change, especially at the start of each new school year. You can set an expiration
        date for your links if you like. When the expiration date arrives,
        you can set your link to remind you to update it, or set it to delete automatically. This prevents
        outdated links from remaining.`}</p>
        <form className={styles.form}>
          <div className={styles.formSection}>
            <label htmlFor='title' className={styles.label}>Title</label>
            <input type='text' id='title' name='title' className={styles.input} />
          </div>
          <div className={styles.formSection}>
            <label htmlFor='url' className={styles.label}>URL</label>
            <input type='text' id='url' name='url' className={styles.input} />
          </div>

          <div className={styles.formSection}>
            <label htmlFor='description' className={styles.label}>Description</label>
            <textarea id='description' name='description' className={styles.input} />
          </div>

          <div className={styles.formSection}>
            <label className={styles.label}>{`Set Exiration Date (optional)`}</label>
            <input type='date' id='expiration' name='expiration' className={styles.input} />
          </div>

          <div className={styles.formSection}>
            <label htmlFor='reminder' className={styles.label}>On Expire</label>
            <select id="action-select" value={action} onChange={e => setAction(e.target.value)} className={styles.onExpire}>
              <option value="remind" className={styles.label}>Remind to Update Link</option>
              <option value="delete" className={styles.label}>Delete Link</option>
            </select>
          </div>

          <button type='submit' className={styles.submitButton}>Submit</button>
        </form>
      </div>
    </div>
  )
}