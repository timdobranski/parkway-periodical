'use client'

import { useEffect } from 'react';
const imagePaths = Array.from({ length: 18 }, (v, i) => `/images/intro/${i + 1}.png`);
import styles from './home.module.css';

export default function Home() {
  useEffect(() => {
    const collage = document.getElementById('collage');
    let scrollAmount = 0;

    const scrollInterval = setInterval(function(){
      collage.scrollLeft += 1; // Adjust the increment value as needed
      scrollAmount += 1;

      if(scrollAmount >= collage.scrollWidth - window.innerWidth){
        clearInterval(scrollInterval);
      }
    }, 10); // Adjust the interval as needed

    // Cleanup on component unmount
    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div className='pageWrapper'>
      <div id="collage" className={styles.collage}>
        {imagePaths.map((path, index) => {
          const tintClassName = index % 2 === 0 ? 'blueTint' : 'redTint';
          const combinedClassName = `${styles.collagePhoto} ${styles[tintClassName]}`;

          return (
            <img key={index} src={path} alt={`Intro Image ${index + 1}`} className={combinedClassName} />
          );
        })}
      </div>
    </div>
  )
}
