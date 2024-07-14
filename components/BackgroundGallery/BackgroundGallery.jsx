'use client'

import React, { useEffect, useState } from 'react';
import styles from './BackgroundGallery.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Intro({ introRunning, setFinishedLoading, loadedImages, setLoadedImages, finishedLoading }) {
  const [rows, setRows] = useState([[], [], []]);
  const imagePath = "/images/intro/";
  const rowsDirectories = ['row1', 'row2', 'row3'];
  const imagesPerRow = 10;
  const router = useRouter();
  // const [loadedImages, setLoadedImages] = useState(0);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const totalImages = imagesPerRow * rowsDirectories.length;

  const progress = (loadedImages / totalImages) * 100;

  const imageCaptions = {
    row1: {
      1: 'test',
      2: 'Touring KPBS Studios',
      3: 'test2',
      4: 'Image caption here',
      5: 'Image caption here',
      6: 'Image caption here',
      7: 'Image caption here',
      8: 'Image caption here',
      9: 'Image caption here',
      10: 'Image caption here',
    },
    row2: {
      1: 'Image caption here',
      2: 'Image caption here',
      3: 'Image caption here',
      4: 'Image caption here',
      5: 'Image caption here',
      6: 'Image caption here',
      7: 'Image caption here',
      8: 'Image caption here',
      9: 'Image caption here',
      10: 'Image caption here',
    },
    row3: {
      1: 'Image caption here',
      2: 'Image caption here',
      3: 'Image caption here',
      4: 'Image caption here',
      5: 'Image caption here',
      6: 'Image caption here',
      7: 'Image caption here',
      8: 'Image caption here',
      9: 'Image caption here',
      10: 'Image caption here',
    }
  }

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

  useEffect(() => {
    console.log('INTRO RUNNING VALUE IN BACKGROUND GALLERY: ', introRunning)
  }, [introRunning])

  return (
    <>
      <div
        className={`${styles.galleryWrapper} ${introRunning ? '' : styles.wrapperAfterIntro} ${allImagesLoaded ? (introRunning ? styles.fadeIn : styles.dontFadeIn) : ''}`}

      >
        {rows.map((rowImages, rowIndex) => (
          <div
            key={rowIndex}
            className={`${styles.imageRow} ${styles['row' + (rowIndex + 1)]}`}
          >
            {[...rowImages.slice(-2), ...rowImages, ...rowImages.slice(0, 2)].map((src, index) => (
              <div
                className={`${styles.imageContainer} ${introRunning ? '' : styles.dimmedImage} ${allImagesLoaded  ? (introRunning ? styles.fadeIn : styles.dontFadeIn) : styles.hiddenImage}`}
                key={`${rowIndex}-${index}`}

              >
                {/* <p className={styles.imageCaption}>
                  {imageCaptions['row' + (rowIndex + 1)][((index % rowImages.length) + 1).toString()]}
                </p>                 */}
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
        {finishedLoading && <div className={styles.credit}>Designed & Built By <Link href='https://timdobranski.com' className={styles.creditLink}>Tim Dobranski</Link></div>}
      </div>
    </>
  );
}
