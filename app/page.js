'use client'

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [rows, setRows] = useState([[], [], []]);
  const baseImagePath = "/images/introNaturalColor/"; // Only one path needed
  const rowsDirectories = ['row1', 'row2', 'row3'];
  const imagesPerRow = 10;
  const router = useRouter();
  const [loadedImages, setLoadedImages] = useState(0);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const totalImages = 30; // Adjusted total images count

  const preloadImages = () => {
    rowsDirectories.forEach(rowDir => {
      for (let i = 1; i <= imagesPerRow; i++) {
        const img = new Image();
        img.src = `${baseImagePath}${rowDir}/${i}.webp`;
        img.onload = handleImageLoad; // Bind the load handler here
      }
    });
  };

  const handleImageLoad = () => {
    setLoadedImages(prev => prev + 1);
  };

  useEffect(() => {
    if (allImagesLoaded) { return };
    preloadImages();

    const loadRowImages = (rowDir) => {
      const rowImages = [];
      for (let i = 1; i <= imagesPerRow; i++) {
        rowImages.push(`${baseImagePath}${rowDir}/${i}.webp`);
      }
      return rowImages;
    };

    const allRows = rowsDirectories.map(rowDir => loadRowImages(rowDir));
    setRows(allRows);
  }, []);

  useEffect(() => {
    if (loadedImages >= totalImages) {
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
      <div className={styles.introContainer} onClick={() => router.push('/public/home')}>
        <img src='images/logos/titledLogoThumb.png' alt='Intro Image' className={styles.titledLogo} />
        <h1 className={styles.enterButton}>ENTER</h1>
      </div>
      <div className={`${styles.galleryWrapper} ${allImagesLoaded ? styles.fadeIn : ''}`}>
      {rows.map((rowImages, rowIndex) => (
  <div key={rowIndex} className={styles.imageRow}>
    {rowImages.map((src, index) => (
      <div key={`${rowIndex}-${index}`} className={styles.imageContainerRed}>
      <img
        key={`${rowIndex}-${index}`}
        src={src}
        alt={`Image in row ${rowIndex + 1}, number ${index + 1}`}
        className={styles.image}
        onLoad={handleImageLoad}
        // No changes required for onMouseEnter and onMouseLeave
      />
      </div>
    ))}
  </div>
))}
      </div>
    </>
  );
}
