'use client'

import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

export default function PhotoCarousel({ photos }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const handleCarouselChange = (index) => {
    setCurrentPhotoIndex(index);
  };

  console.log('photos passed to PhotoCarousel: ', photos);

  if (!photos || photos.length === 0) { return <h1>loading</h1>}

  return (
    <div className={styles.carouselWrapper}>
      <h1>loading</h1>
    <Carousel
      dynamicHeight={true}
      autoPlay={false}
      showThumbs={true}
      selectedItem={currentPhotoIndex}
      onChange={handleCarouselChange}
    >
      {photos.content.map((photoObj, index) => (
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