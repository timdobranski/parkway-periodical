'use client'

import { useState } from 'react';
import styles from './help.module.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChrome,
  faSafari,
  faEdge,
  faInternetExplorer,
  faOpera,
} from '@fortawesome/free-brands-svg-icons';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

export default function HelpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [deviceUsed, setDeviceUsed] = useState('');
  const [browserUsed, setBrowserUsed] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const browserOptions = [
    { value: 'Chrome', label: 'Chrome', icon: faChrome },
    { value: 'Safari', label: 'Safari', icon: faSafari },
    { value: 'Edge', label: 'Edge', icon: faEdge },
    { value: 'Internet Explorer', label: 'Internet Explorer', icon: faInternetExplorer },
    { value: 'Opera', label: 'Opera', icon: faOpera },
    { value: 'Other', label: 'Other', icon: faCircleQuestion },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({ state: 'submitting', message: '' });

    try {
      const payload = {
        name,
        email,
        deviceUsed,
        browserUsed,
        issueDescription,
        page: '/help',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      };

      const response = await fetch('/api/sendSupportEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to submit support request');
      }

      setStatus({ state: 'success', message: 'Your request was sent. We will follow up as soon as possible. Support is offered as a volunteer service mostly on the weekends.' });
      setName('');
      setEmail('');
      setDeviceUsed('');
      setBrowserUsed('');
      setIssueDescription('');
    } catch (err) {
      setStatus({ state: 'error', message: err?.message || 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div className='feedWrapper'>
      <div className='slideUp'>
        <h1 className='whiteTitle'>HELP</h1>
        <p className='centeredWhiteText'>
          {`Having trouble with the website? Use the form below to request support.`}
        </p>

        <div className={`post ${styles.formCard}`}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label} htmlFor='name'>Name</label>
            <input
              id='name'
              className={styles.input}
              type='text'
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Your name'
            />

            <label className={styles.label} htmlFor='email'>Email</label>
            <input
              id='email'
              className={styles.input}
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='you@example.com'
              autoComplete='email'
            />

            <label className={styles.label} htmlFor='deviceUsed'>Device used</label>
            <input
              id='deviceUsed'
              className={styles.input}
              type='text'
              required
              value={deviceUsed}
              onChange={(e) => setDeviceUsed(e.target.value)}
              placeholder='e.g. iPhone 14, Chromebook, MacBook, Windows PC'
            />

            <fieldset className={styles.fieldset}>
              <legend className={styles.label}>Web browser used</legend>
              <div className={styles.browserGrid} role='radiogroup' aria-label='Web browser used'>
                {browserOptions.map((option) => {
                  const selected = browserUsed === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`${styles.browserOption} ${selected ? styles.browserOptionSelected : ''}`}
                    >
                      <input
                        className={styles.browserRadio}
                        type='radio'
                        name='browserUsed'
                        value={option.value}
                        checked={selected}
                        onChange={(e) => setBrowserUsed(e.target.value)}
                        required
                      />
                      <span className={styles.browserIcon} aria-hidden='true'>
                        <FontAwesomeIcon icon={option.icon} />
                      </span>
                      <span className={styles.browserLabel}>{option.label}</span>
                    </label>
                  );
                })}
              </div>
              <p className={`${styles.helperText} ${styles.browserHelper}`}>
                {`If you chose “Other”, please name the browser in the description.`}
              </p>
            </fieldset>

            <label className={styles.label} htmlFor='issueDescription'>Describe the issue</label>
            <p className={styles.helperText}>
              {`Please be as detailed as possible (what you clicked, what you expected, and what happened instead).`}
            </p>
            <textarea
              id='issueDescription'
              className={styles.textarea}
              required
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder='Describe what went wrong...'
              rows={6}
            />

            <button className={styles.submitButton} type='submit' disabled={status.state === 'submitting'}>
              {status.state === 'submitting' ? 'Sending...' : 'Send Support Request'}
            </button>

            {status.state !== 'idle' && (
              <div
                className={`${styles.status} ${
                  status.state === 'success' ? styles.statusSuccess : styles.statusError
                }`}
                role='status'
                aria-live='polite'
              >
                <p className={styles.statusText}>{status.message}</p>
                {status.state === 'success' && (
                  <Link className={styles.successHomeLink} href='/home'>
                    Back to Home
                  </Link>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
