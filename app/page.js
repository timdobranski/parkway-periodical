'use client'

import React, { useEffect, useState, useRef } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [rows, setRows] = useState([[], [], []]);
  const baseImagePath = "/images/intro/";
  const rowsDirectories = ['row1', 'row2', 'row3']; // Directories for each row
  const imagesPerRow = 10; // Assuming 6 unique images per row
  const router = useRouter();

  useEffect(() => {
    const loadRowImages = (rowDir) => {
      const rowImages = [];
      for (let i = 1; i <= imagesPerRow; i++) {
        rowImages.push(`${baseImagePath}${rowDir}/${i}.webp`);
      }
      // Duplicate the images for the scrolling effect
      return [...rowImages, ...rowImages];
    };

    const allRows = rowsDirectories.map(rowDir => loadRowImages(rowDir));
    setRows(allRows);
  }, []);

  if (rows[0].length !== 20) return null;

  return (
    <div className={styles.introWrapper}>
      <div className={styles.introContainer}>
        <img src='images/logos/titledLogo.png' alt='Intro Image' className={styles.introImage} />
        <h1 className={styles.enter} onClick={() => router.push('/public/home')}>ENTER</h1>
      </div>
      {rows.map((rowImages, rowIndex) => (
        <div key={rowIndex} className={styles.imageRow}>
          {rowImages.map((src, index) => (
            <img key={`${rowIndex}-${index}`} src={src} alt={`Image in row ${rowIndex + 1}, number ${index + 1}`} className={styles.image} />
          ))}
        </div>
      ))}
    </div>
  );

}

