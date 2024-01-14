'use client'

import { useEffect, useState } from 'react';
import styles from './home.module.css';

export default function Home() {
  const [images, setImages] = useState([]);
  const imageCount = 18; // Adjusted for 3 rows of 6 images each
  const imagePath = "/images/intro/"; // Correctly defined imagePath

  useEffect(() => {
    const loadedImages = [];
    for (let i = 1; i <= imageCount; i++) {
      loadedImages.push(`${imagePath}${i}.png`);
    }
    setImages(loadedImages);
  }, []);

  return (
    <div className='publicPageWrapper'>
      {[...Array(3)].map((_, rowIndex) => (
        <div key={rowIndex} className={styles.imageRow}>
          {images.slice(rowIndex * 6, (rowIndex + 1) * 6).map((src, index) => (
            <img key={index} src={src} alt={`Image ${rowIndex * 6 + index + 1}`} className={styles.image} />
          ))}
        </div>
      ))}
    </div>
  );
}
