'use client'

import styles from './photoGrid.module.css';
import React, { useState, useEffect } from 'react';

export default function PhotoGrid ({ photos, setActiveBlock, blockIndex }) {
  const [gridClassName, setGridClassName] = useState('');
  const [photoClassName, setPhotoClassName] = useState('');

  // should handle cases where photos.format ===
  // 1. single-photo-caption-right
  // 2. single-photo-caption-left
  // 3. 2xColumn
  // 4. 3xColumn
  // 5. grid
  // 6. single-photo-caption-above
  // 7. single-photo-caption-below


  useEffect(() => {
    console.log('photos passed to PhotoGrid: ', photos);
    if (!photos || !photos.content || photos.content.length === 0) {
      return; // Return early if no photos
    }

    let gridClass = '';
    let photoClass = '';

    switch (photos.format) {
      case 'single-photo-caption-right':
        gridClass = 'singlePhotoGrid';
        photoClass = 'photoWithCaptionRight';
        break;
      case 'single-photo-caption-left':
        gridClass = 'singlePhotoGrid';
        photoClass = 'photoWithCaptionLeft';
        break;
      case '2xColumn':
        gridClass = 'photosGridTwoColumns';
        break;
      case '3xColumn':
        gridClass = 'photosGridThreeColumns';
        break;
      case 'grid':
        gridClass = 'photosGridTwoColumns';
        break;
      case 'single-photo-caption-above':
        gridClass = styles.singlePhotoGrid;
        photoClass = styles.photoWithCaptionAbove;
        break;
      case 'single-photo-caption-below':
        gridClass = 'singlePhotoGrid';
        photoClass = 'photoWithCaptionBelow'
        break;
      default:
        gridClass = styles.photosGrid; // Default case
        break;
    }

    setGridClassName(gridClass);
    setPhotoClassName(photoClass);
  }, [photos]);

  if (!photos || !photos.content || photos.content.length === 0 || !gridClassName) {
    return <div>No photos to display</div>;
  }
  console.log('gridClassName: ', gridClassName);
  console.log('format: ', photos.format);
  return (
    <>
      <div className={`${styles.photosGrid} ${styles[gridClassName]}`}>
        {/* Loop to render all photos */}
        {photos.content.map((photo, index) => (
          <div key={index} className={`${styles.gridPhotoContainer} ${styles[photoClassName]}`}>
            <img src={photo.src} alt={`Photo ${index}`} className={styles.gridPhoto} onClick={() => setActiveBlock(blockIndex)} />
          </div>
        ))}
      </div>

      <div className={`${styles.photosCaptionGrid} ${styles[gridClassName]}`}>
        {/* Loop to render all titles and captions */}
        {photos.content.map((photo, index) => (
          <div key={index} className={`${styles.photoInfoContainer}`}>
            {photo.title && <p className={styles.photoTitle}>{photo.title}</p>}
            {photo.caption && <p className={styles.photoCaption}>{photo.caption}</p>}
          </div>
        ))}
      </div>
    </>
  );


}