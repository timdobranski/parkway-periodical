'use client'

import React, { useEffect, useState } from 'react';
import styles from './Intro.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Intro({ introRunning, setFinishedLoading }) {
  const [rows, setRows] = useState([[], [], []]);
  const imagePath = "/images/intro/";
  const rowsDirectories = ['row1', 'row2', 'row3'];
  const imagesPerRow = 10;
  const router = useRouter();
  const [loadedImages, setLoadedImages] = useState(0);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const totalImages = imagesPerRow * rowsDirectories.length;

  const preloadImages = () => {
    rowsDirectories.forEach(rowDir => {
      for (let i = 1; i <= imagesPerRow; i++) {
        const img = new Image();
        img.src = `${imagePath}${rowDir}/${i}.webp`;
        img.onload = () => handleImageLoad();
      }
    });
  };

  const loadRowImages = (rowDir) => {
    const rowImages = [];
    for (let i = 1; i <= imagesPerRow; i++) {
      rowImages.push(`${imagePath}${rowDir}/${i}.webp`);
    }
    return rowImages;
  };

  useEffect(() => {
    if (allImagesLoaded) { return };
    preloadImages();
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
      setFinishedLoading(true);
    }
  }, [allImagesLoaded]);

  const handleImageLoad = () => {
    setLoadedImages(prev => prev + 1);
  };

  return (
    <>
      <div
        className={`${styles.galleryWrapper} ${introRunning ? '' : styles.wrapperAfterIntro} ${allImagesLoaded ? styles.fadeIn : ''}`}

      >
        {rows.map((rowImages, rowIndex) => (
          <div
            key={rowIndex}
            className={`${styles.imageRow} ${styles['row' + (rowIndex + 1)]}`}
          >
            {[...rowImages.slice(-2), ...rowImages, ...rowImages.slice(0, 2)].map((src, index) => (
              <div
                className={`${styles.imageContainer} ${introRunning ? '' : styles.dimmedImage} ${allImagesLoaded ? styles.fadeIn : styles.hiddenImage}`}
                key={`${rowIndex}-${index}`}
              >
                <div
                  className={
                    index % 2 === (rowIndex % 2 === 0 ? 0 : 1)
                      ? introRunning ? styles.redOverlay : styles.redOverlayFaded
                      : introRunning ? styles.blueOverlay : styles.blueOverlayFaded
                  }>
                </div>
                <img
                  src={src}
                  alt={`Image in row ${rowIndex + 1}, number ${index - 2 + 1}`}
                  className={styles.image}
                  onLoad={handleImageLoad}
                />
              </div>
            ))}
          </div>
        ))}
        <div className={styles.credit}>Designed & Built By <Link href='https://timdobranski.com' className={styles.creditLink}>Tim Dobranski</Link></div>
      </div>
    </>
  );
}
