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
      adjustScrollAnimations();
    }
  }, [loadedImages]);

  const adjustScrollAnimations = () => {
    console.log('inside adjustScrollAnimations');
    // Query all image rows
    const imageRows = document.querySelectorAll(`.${styles.imageRow}`);

    imageRows.forEach((row, index) => {
      // Calculate the total width of the row
      let totalWidth = 0;
      row.childNodes.forEach(node => {
        totalWidth += node.offsetWidth /* any additional spacing */
      });
      console.log('totalWidth', totalWidth);
      // Calculate the distance to scroll which is total width minus viewport width
      const scrollDistance = totalWidth - window.innerWidth;
      console.log('scrollDistance', scrollDistance)
      if (scrollDistance > 0) {
        // Define different speeds for each row based on the index or any other criteria
        const duration = determineDurationBasedOnIndex(index);
        console.log('duration: ', duration)
        // Apply the animation with calculated distance and duration
        row.style.animation = `scrollRow ${30}s linear infinite alternate`;
        row.style.setProperty('--scroll-distance', `${scrollDistance}px`);
      }
    });
  };

  const determineDurationBasedOnIndex = (index) => {
    // Define your logic for different durations based on the row index
    switch (index) {
      case 0: return 60; // Duration for the first row
      case 1: return 45; // Duration for the second row
      case 2: return 30; // Duration for the third row
      default: return 60; // Default duration
    }
  };


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
      <div key={`${rowIndex}-${index}`}
           className={index % 2 === 0 ? styles.imageContainerRed : styles.imageContainerBlue}>
        <img
          src={src}
          alt={`Image in row ${rowIndex + 1}, number ${index + 1}`}
          className={styles.image}
          onLoad={handleImageLoad}
        />
      </div>
    ))}
  </div>
))}
      </div>
    </>
  );
}
