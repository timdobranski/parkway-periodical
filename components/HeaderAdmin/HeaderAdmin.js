'use client'

import styles from './HeaderAdmin.module.css';
import logo from '../../public/images/logos/parkway.png';
import Image from 'next/image';
import Link from 'next/link';
import supabase from '../../utils/supabase';
import  { useState, useEffect } from 'react';

export default function Header() {
  const [storageUsage, setStorageUsage] = useState(null);

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

      console.log(`Total storage used in ${bucketName}/${folderPath}: ${totalSizeGB.toFixed(2)} GB`);
      console.log(`Percentage of 1GB used: ${percentageUsed.toFixed(2)}%`);

      return parseFloat(percentageUsed.toFixed(2));

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

  return (
    <div className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <Image src={logo} alt="Parkway Academy Logo" fill='true'/>
      </div>

      <div className={styles.navContainerLeft}>
        <Link href='/'>
          <h2>HOME</h2>
        </Link>
        <Link href='/public/archive'>
          <h2>ARCHIVE</h2>
        </Link>
        <Link href='/public/about'>
          <h2>ABOUT</h2>
        </Link>
      </div>

      <div className={styles.navContainerRight}>
        <div className={styles.storageStatusWrapper}>
          <p>Free Storage Used: {storageUsage ? `${storageUsage}%` : 'Loading...'}</p>
        </div>
        <Link href='/admin/new-post'>
          <h2>NEW POST</h2>
        </Link>
        <Link href='/admin/view-posts'>
          <h2>VIEW/EDIT POSTS</h2>
        </Link>
        {/* <Link href='/about'> */}
        <h2>SETTINGS</h2>
        {/* ></Link> */}
      </div>
    </div>
  )
}