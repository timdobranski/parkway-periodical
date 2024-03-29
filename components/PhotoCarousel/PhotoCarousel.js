'use client'

import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import styles from './photoCarousel.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function PhotoCarousel({ photos, isEditable, handleTitleChange, handleCaptionChange }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedCaption, setEditedCaption] = useState("");

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

  const handleCarouselChange = (index) => {
    setCurrentPhotoIndex(index);
  };

  const customPrevArrow = (clickHandler, hasPrev) =>
    <FontAwesomeIcon icon={faChevronLeft} onClick={hasPrev ? clickHandler : null}  className={hasPrev ? styles.arrowLeft : styles.arrowLeftDisabled}/>


  // Custom next arrow
  const customNextArrow = (clickHandler, hasNext) =>
    <FontAwesomeIcon icon={faChevronRight} onClick={hasNext ? clickHandler : null}  className={hasNext ? styles.arrowRight : styles.arrowRightDisabled}/>

  if (!photos || photos.length === 0) { return <p>No photos uploaded yet</p> }

  return (
    <div className={styles.carouselWrapper}>

      {photos[currentPhotoIndex] && (

        isEditable ? (
          <input
            type="text"
            className={styles.titleInput}
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder='Enter title (optional)'
          />
        ) :
          <>
            {photos[currentPhotoIndex].title && (
              <p className={styles.titleP}>{editedTitle}</p>
            )}
          </>
      )}


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

        ) :
          <>
            {photos[currentPhotoIndex].caption && (
              <p className={styles.captionP}>
                {photos[currentPhotoIndex].caption}
              </p>
            )}
          </>
      )}
    </div>
  );
}