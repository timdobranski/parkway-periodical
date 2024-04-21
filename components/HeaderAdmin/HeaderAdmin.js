'use client'

import styles from './HeaderAdmin.module.css';
import logo from '../../public/images/logos/parkway.png';
import Image from 'next/image';
import Link from 'next/link';
import supabase from '../../utils/supabase';
import  { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faBars } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const [storageUsage, setStorageUsage] = useState(null);
  const [leftNavOpen, setLeftNavOpen] = useState(false);
  const [rightNavOpen, setRightNavOpen] = useState(false);

  async function checkStorageUsage() {
    try {
      // Name of your bucket
      const bucketName = 'posts';
      // Path inside your bucket (if you have a specific folder you're targeting)
      const folderPath = 'photos';

      // Get a reference to the bucket
      const { data, error } = await supabase.storage.from(bucketName).list(folderPath, {
        limit: 100, // Adjust the limit as per your needs, max is 1000
        offset: 0,
      });

      if (error) {
        throw error;
      }

      // Sum the sizes of all files
      const totalSizeBytes = data.reduce((acc, file) => acc + file.metadata.size, 0);

      // Convert bytes to gigabytes
      const totalSizeGB = totalSizeBytes / (1024 ** 3);

      // Calculate the percentage of 1 GB used
      const percentageUsed = (totalSizeGB / 1) * 100;
      const numberOfFiles = data.length;

      return {
        percentageUsed: parseFloat(percentageUsed.toFixed(2)),
        numberOfFiles: numberOfFiles
      };

    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return null;
    }
  }

  useEffect(() => {
    checkStorageUsage()
  }, [])

  useEffect(() => {
    checkStorageUsage().then(setStorageUsage);
  }, []);

  const toggleNavOpen = (direction) => {
    if (direction === 'left') {
      setLeftNavOpen(prevState => !prevState); // Toggles the state of the left navigation
    } else if (direction === 'right') {
      setRightNavOpen(prevState => !prevState); // Toggles the state of the right navigation
    }
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <Image src={logo} alt="Parkway Academy Logo" fill='true'/>
      </div>
      <div className={styles.leftNavHandle}
        onMouseEnter={() => toggleNavOpen('left')}
        onMouseLeave={() => setLeftNavOpen(false)}

>
        <FontAwesomeIcon icon={faCaretDown} className={styles.downIcon}/>
        <p className={styles.viewPages}>PAGES</p>
        <div
          onMouseLeave={() => setLeftNavOpen(false)}

        className={leftNavOpen ? styles.navContainerLeft : styles.navContainerHidden}>

          <Link href='/'>
            <h2>HOME</h2>
          </Link>
          <Link href='/public/archive'>
            <h2>ARCHIVE</h2>
          </Link>
          <Link href='/public/info'>
            <h2>INFO</h2>
          </Link>
        </div>
      </div>
      <div className={styles.storageStatusWrapper}>
        <p className={styles.storageUsed}>Free Photo Storage Used: {storageUsage ? `${storageUsage.percentageUsed}%` : 'Loading...'}</p>
      </div>
      <div className={styles.rightNavHandle} onClick={() => toggleNavOpen('right')}>
        <FontAwesomeIcon icon={faBars} className={styles.menuIcon}/>
        {/* <p className={styles.viewPages}>SETTINGS</p> */}
        <div className={rightNavOpen ? styles.navContainerRight : styles.navContainerHidden}>

          <Link href='/admin/new-post'>
            <h2>NEW POST</h2>
          </Link>
          <Link href='/admin/view-posts'>
            <h2>OLD EDIT POSTS</h2>
          </Link>
          <Link href='/admin/list?type=posts'>
            <h2>POSTS</h2>
          </Link>
          <Link href='/admin/list?type=electives'>
            <h2>ELECTIVES</h2>
          </Link>
          <Link href='/admin/list?type=clubs'>
            <h2>CLUBS</h2>
          </Link>
          <Link href='/admin/list?type=staff'>
            <h2>STAFF</h2>
          </Link>
          <Link href='/admin/list?type=links'>
            <h2>LINKS</h2>
          </Link>
          <Link href='/admin/settings'>
            <h2>SETTINGS</h2>
          </Link>
        </div>
      </div>
    </div>
  )
}