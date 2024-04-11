'use client'

import React, { useEffect, useState } from 'react';
import styles from './Intro.module.css';
import { useRouter } from 'next/navigation';

export default function Intro({ introRunning, setFinishedLoading }) {
  const [rows, setRows] = useState([[], [], []]);
  // const baseImagePath = "/images/intro/";
  const imagePath = "/images/intro/";
  const rowsDirectories = ['row1', 'row2', 'row3'];
  const imagesPerRow = 10;
  const router = useRouter();
  const [loadedImages, setLoadedImages] = useState(0);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null); // Track hovered row index
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null); // Track hovered image index
  const totalImages = 30;

  const preloadImages = () => {
    rowsDirectories.forEach(rowDir => {
      for (let i = 1; i <= imagesPerRow; i++) {
        const img = new Image();
        img.src = `${imagePath}${rowDir}/${i}.webp`;
      }
    });
  };

  //increment the loadedImages state when an image is finished loading
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

  // on page load, preload images
  useEffect(() => {
    if (allImagesLoaded) { return };
    preloadImages();

    const loadRowImages = (rowDir) => {
      const rowImages = [];
      for (let i = 1; i <= imagesPerRow; i++) {
        rowImages.push(`${imagePath}${rowDir}/${i}.webp`);
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
      setFinishedLoading(true);
    }
  }, [allImagesLoaded]);

  return (
    <>
      <div
        className={`${styles.galleryWrapper} ${introRunning ? '' : styles.dimmedBackground} ${allImagesLoaded ? styles.fadeIn : ''}`}
        style={allImagesLoaded ? { backgroundImage: "url('/images/gradient3small2.webp')"} : {}}
      >
        {rows.map((rowImages, rowIndex) => (
          <div
            key={rowIndex}
            className={`${styles.imageRow} ${hoveredRowIndex === rowIndex ? styles.hoveredRow : ''}`}
          >
            {rowImages.map((src, index) => (
              <div
                className={`${styles.imageContainer} ${introRunning ? '' : styles.dimmedImage}  ${allImagesLoaded ? styles.fadeIn : styles.hiddenImage}`}
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
                  alt={`Image in row ${rowIndex + 1}, number ${index + 1}`}
                  className={`
          ${styles.image}
          ${allImagesLoaded ? "" : styles.hiddenImage}
          ${!introRunning ? styles.blurredImage : ''}
        `}
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
