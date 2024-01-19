'use client'

import styles from './photoGrid.module.css';
import { useState, useEffect } from 'react';

export default function PhotoGrid ({ photos }) {
  const [gridClassName, setGridClassName] = useState('');
  const [photoClassName, setPhotoClassName] = useState('');
  // const [format, setFormat] = useState('');

  useEffect(() => {
    let gridClass = '';
    if (photos.length === 1) {
      gridClass = styles.photosGridSingle;
    } else if (photos.length % 3 === 0 ) {
      gridClass = styles.photosGridThreeColumns;
    } else if (photos.length % 2 === 0) {
      gridClass = styles.photosGridTwoColumns;
    }
    if (!photos || photos.length === 0) {
      return <div>no photos to display</div>;
    }

    setGridClassName(gridClass);
  }, [])

  console.log('photos passed to renderPhotosGrid: ', photos)

      if (!photos || !photos.content || photos.content.length === 0) {
      return <div>no photos to display</div>;
    }

  return (
    <div className={`${styles.photosGrid} ${gridClassName}`}>
      {photos.content.map((photo, index) => (
        <div key={index} className={styles.gridPhotoContainer}>
          <img src={photo.src} alt={`Photo ${index}`} className={styles.gridPhoto} />
          {photo.title && <p className={styles.photoTitle}>{photo.title}</p>}
          {photo.caption && <p className={styles.photoCaption}>{photo.caption}</p>}
        </div>
      ))}
    </div>
  );
}