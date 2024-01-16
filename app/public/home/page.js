'use client'

import { useEffect, useState } from 'react';
import styles from './home.module.css';

export default function Home() {
  const [images, setImages] = useState([]);
  const imageCount = 30; // Adjusted for 3 rows of 6 images each
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
      <div className='post'>
      <h1>Posts will be displayed here</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        {/* <div className={styles.textPhoto}>
          PARKWAY PERIODICAL
        </div> */}

      </div>


    </div>
  );
}
