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
      <h1>Posts Here</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <div className={styles.testImage}>
          <div className={styles.blueTint}></div>
        </div>
      {/* <a href="https://www.freepik.com/free-vector/realistic-racing-text-effect_21075516.htm#query=font%20effect&position=18&from_view=keyword&track=ais&uuid=842ed622-0144-43d1-a4be-c6e8538bb9b4">Image by pikisuperstar</a> on Freepik */}

      </div>


    </div>
  );
}
