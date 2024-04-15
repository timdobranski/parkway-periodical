'use client'

import { useState, useEffect, useRef } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import styles from './photoCarousel.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function PhotoCarousel({ photos, isEditable, handleTitleChange, handleCaptionChange }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedCaption, setEditedCaption] = useState("");
  const pRef = useRef(null);
  const prevHeightRef = useRef('0px');
  // Reset edited fields when the current photo changes
  useEffect(() => {
    if (photos && photos.length > 0) {
      setEditedTitle(photos[currentPhotoIndex].title || "");
      setEditedCaption(photos[currentPhotoIndex].caption || "");
    }
  }, [currentPhotoIndex, photos]);
  useEffect(() => {
    handleTitleChange(currentPhotoIndex, editedTitle)
  }, [editedTitle])
  useEffect(() => {
    handleCaptionChange(currentPhotoIndex, editedCaption)
  }, [editedCaption])
  useEffect(() => {
    const p = pRef.current;
    if (p) {
      // Measure the natural height of the content
      p.style.height = 'auto';
      const contentIsEmpty = !p.innerText.trim();
      const fullHeight = contentIsEmpty ? '0px' : p.scrollHeight + 'px';

      // Start from the previous height
      p.style.height = prevHeightRef.current;
      setTimeout(() => {
        p.style.height = fullHeight;
      }, 10); // Short delay to allow the browser to transition from the previous height

      // Update the previous height after the transition
      prevHeightRef.current = fullHeight;

      // Collapse on unmount or when content needs to be hidden
      return () => {
        p.style.height = '0';
        prevHeightRef.current = '0px'; // Reset to '0px' when the component or content is not visible
      };
    }
  }, [currentPhotoIndex, photos]);

  const handleCarouselChange = (index) => {
    setCurrentPhotoIndex(index);
  };
  const customPrevArrow = (clickHandler, hasPrev) => {
    return (
      <FontAwesomeIcon icon={faChevronLeft} onClick={hasPrev ? clickHandler : null} className={hasPrev ? styles.arrowLeft : styles.arrowLeftDisabled}/>
    );
  }
  const customNextArrow = (clickHandler, hasNext) => {
    return (
      <FontAwesomeIcon icon={faChevronRight} onClick={hasNext ? clickHandler : null} className={hasNext ? styles.arrowRight : styles.arrowRightDisabled}/>
    );
  }

  if (!photos || photos.length === 0) { return <p>Click the button above to select photos for the carousel</p> }

  return (
    <div className={`${styles.carouselWrapper} ${!isEditable && photos.length === 0 ? 'outlined' : ''}`}>
      <Carousel
        renderArrowPrev={customPrevArrow}
        renderArrowNext={customNextArrow}
        dynamicHeight={false}
        autoPlay={false}
        showThumbs={true}
        showStatus={false}
        selectedItem={currentPhotoIndex}
        onChange={handleCarouselChange}
      >
        {photos.map((photoObj, index) => (
          <div key={index} className={styles.carouselSlide}>
            <img src={photoObj.src} alt={`Photo ${index}`} className={styles.slideImg}/>
          </div>
        ))}
      </Carousel>
      {photos[currentPhotoIndex] && (

        isEditable ? (

          <textarea
            className={styles.captionInput}
            value={editedCaption}
            onChange={(e) => setEditedCaption(e.target.value)}
            placeholder='Enter caption (optional)'
          />

        ) : photos[currentPhotoIndex].caption && (
          <div className={styles.captionWrapper}>
            <p ref={pRef} className={styles.captionP}>
              {photos[currentPhotoIndex].caption}
            </p>
          </div>
        )
      )}
    </div>
  );
}