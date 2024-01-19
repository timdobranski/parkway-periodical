'use client'

import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';

export default function PhotoCarousel({ photos }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const handleCarouselChange = (index) => {
    setCurrentPhotoIndex(index);
  };

  return (
    <div className={styles.carouselWrapper}>
    <Carousel
      dynamicHeight={true}
      autoPlay={false}
      showThumbs={true}
      selectedItem={currentPhotoIndex}
      onChange={handleCarouselChange}
    >
      {photos.map((photoObj, index) => (
        <div key={index} className={styles.carouselSlide}>
          <img src={photoObj.src} alt={`Photo ${index}`} />
          {photoObj.title && (
            <p className={styles.carouselCaption}>{photoObj.title}</p>
          )}
        </div>
      ))}
    </Carousel>
    {photos[currentPhotoIndex] && photos[currentPhotoIndex].caption && (
      <p className={styles.currentPhotoCaption}>
        {photos[currentPhotoIndex].caption}
      </p>
    )}
  </div>
  );

}