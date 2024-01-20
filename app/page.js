'use client'

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [rows, setRows] = useState([[], [], []]);
  const baseImagePath = "/images/intro/";
  const hoverImagePath = "/images/introNaturalColor/";
  const rowsDirectories = ['row1', 'row2', 'row3'];
  const imagesPerRow = 10;
  const router = useRouter();
  const [loadedImages, setLoadedImages] = useState(0);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null); // Track hovered row index
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null); // Track hovered image index
  const totalImages = 60;

  const preloadImages = () => {
    rowsDirectories.forEach(rowDir => {
      for (let i = 1; i <= imagesPerRow; i++) {
        const img = new Image();
        img.src = `${baseImagePath}${rowDir}/${i}.webp`;
        const hoverImg = new Image();
        hoverImg.src = `${hoverImagePath}${rowDir}/${i}.webp`;
      }
    });
  };

  const handleImageLoad = () => {
    setLoadedImages(prev => prev + 1);
  };

  const handleMouseEnter = (rowIndex, imageIndex) => (e) => {
    const newSrc = e.target.src.replace(baseImagePath, hoverImagePath);
    e.target.src = newSrc;
    setHoveredRowIndex(rowIndex);
    setHoveredImageIndex(`${rowIndex}-${imageIndex}`); // Set the hovered image index
  };

  const handleMouseLeave = (rowIndex, imageIndex) => (e) => {
    const originalSrc = e.target.src.replace(hoverImagePath, baseImagePath);
    e.target.src = originalSrc;
    setHoveredRowIndex(null);
    setHoveredImageIndex(null);
  };

  useEffect(() => {
    if (allImagesLoaded) { return };
    preloadImages();

    const loadRowImages = (rowDir) => {
      const rowImages = [];
      for (let i = 1; i <= imagesPerRow; i++) {
        rowImages.push(`${baseImagePath}${rowDir}/${i}.webp`);
      }
      return [...rowImages, ...rowImages];
    };

    const allRows = rowsDirectories.map(rowDir => loadRowImages(rowDir));
    setRows(allRows);
  }, []);


  useEffect(() => {
    console.log('loaded images: ', loadedImages)
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
          <div
            key={rowIndex}
            className={`${styles.imageRow} ${hoveredRowIndex === rowIndex ? styles.hoveredRow : ''}`}
          >
            {rowImages.map((src, index) => (
              <img
                key={`${rowIndex}-${index}`}
                src={src}
                alt={`Image in row ${rowIndex + 1}, number ${index + 1}`}
                className={`${styles.image} ${allImagesLoaded ? "" : 'hiddenImage'} ${hoveredImageIndex === `${rowIndex}-${index}` ? styles.hoveredImage : ''}`}
                onLoad={handleImageLoad}
                onMouseEnter={handleMouseEnter(rowIndex, index)}
                onMouseLeave={handleMouseLeave(rowIndex, index)}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
