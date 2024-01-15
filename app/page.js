'use client'

import React, { useEffect, useState, useRef } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [rows, setRows] = useState([[], [], []]);
  const baseImagePath = "/images/intro/";
  const rowsDirectories = ['row1', 'row2', 'row3'];
  const imagesPerRow = 10;
  const router = useRouter();
  const [loadedImages, setLoadedImages] = useState(0);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const totalImages = 60;

  const handleImageLoad = () => {
    setLoadedImages(prev => prev + 1);
  };

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


  useEffect(() => {
    if (loadedImages === totalImages) {
      setAllImagesLoaded(true);
    }
  }, [loadedImages]);

  useEffect(() => {
    if (allImagesLoaded) {
      console.log('all images loaded');
    }
  }, [allImagesLoaded]);

  return (
  <>
      <div className={styles.introContainer}>
        <img src='images/logos/titledLogoThumb.png' alt='Intro Image' className={styles.introImage} />
        <h1 className={styles.enter} onClick={() => router.push('/public/home')}>ENTER</h1>
      </div>
      <div className={`${styles.introWrapper} ${allImagesLoaded ? styles.fadeIn : ''}`}>
      {rows.map((rowImages, rowIndex) => (
        <div key={rowIndex} className={styles.imageRow}>
          {rowImages.map((src, index) => (
            <img
            key={`${rowIndex}-${index}`}
            src={src}
            alt={`Image in row ${rowIndex + 1}, number ${index + 1}`}
            className={`${styles.image} ${allImagesLoaded ? "" :'hiddenImage'}`}
            onLoad={handleImageLoad}/>
          ))}
        </div>
      ))}
    </div>
    </>
  );
}

