'use client'

import { useState, useEffect, useRef } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from './photoCarousel.module.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import EditablePhoto from '../EditablePhoto/EditablePhoto';

export default function PhotoCarousel({ photos, isEditable, addPhoto, deletePhoto, reorderPhotos }) {
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
  // useEffect(() => {
  //   handleTitleChange(currentPhotoIndex, editedTitle)
  // }, [editedTitle])
  // useEffect(() => {
  //   handleCaptionChange(currentPhotoIndex, editedCaption)
  // }, [editedCaption])
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
      <FontAwesomeIcon icon={faChevronLeft} onClick={hasPrev ? clickHandler : null} className={hasPrev ? 'arrowLeft' : 'arrowLeftDisabled'}/>
    );
  }
  const customNextArrow = (clickHandler, hasNext) => {
    return (
      <FontAwesomeIcon icon={faChevronRight} onClick={hasNext ? clickHandler : null} className={hasNext ? 'arrowRight' : 'arrowRightDisabled'}/>
    );
  }
  const noPhotosMessage = (
    <p>Click the button above to select photos for the carousel</p>
  )
  const sortPhotos = (
    <div className={styles.carouselEditPhotosWrapper}>
      <DragDropContext
        onDragEnd={(result) => {
          if (!result.destination) return;
          reorderPhotos(result.source.index, result.destination.index);
        }}
      >
        <Droppable droppableId="photos" >
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}       style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '20px'
            }}>
              {photos.map((photo, index) => (
                <Draggable key={photo.fileName} draggableId={photo.fileName} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        margin: '35px 0',
                        padding: '8px',
                        maxWidth: '40%',
                        // left: 'auto !important',
                        // top: 'auto !important'
                      }}
                    >
                      <EditablePhoto
                        photo={photo}
                        isEditable={isEditable}
                        updatePhotoContent={addPhoto}
                        deletePhoto={deletePhoto}
                        containerClassName={styles.photoContainer}
                        handleTitleChange={(title) => handleTitleChange(index, title)}
                        handleCaptionChange={(caption) => handleCaptionChange(index, caption)}
                        photoIndex={index}
                        carousel={true}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
  const input = (
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={addPhoto}
      className={styles.photoInput}
    />
  )
  const carousel = (
    <div className={`${styles.carouselWrapper} ${!isEditable && photos.length === 0 ? 'outlined' : ''}`}>
      <Carousel
        renderArrowPrev={customPrevArrow}
        renderArrowNext={customNextArrow}
        preventMovementUntilSwipeScrollTolerance={true}
        swipeScrollTolerance={50}
        emulateTouch={true}
        dynamicHeight={false}
        autoPlay={false}
        showThumbs={false}
        showStatus={false}
        selectedItem={currentPhotoIndex}
        onChange={handleCarouselChange}
      >
        {photos?.map((photo, index) => (
          <div key={index} className={styles.carouselSlide}>
            <img src={photo.src} alt={`Photo ${index}`}
              className={styles.slideImg}/>
          </div>
        ))}
      </Carousel>

    </div>
  )

  return (
    <>
      {isEditable && input /*render the input if editable regardless of the number of photos*/}

      {isEditable ?
        photos.length ? sortPhotos : noPhotosMessage // if editable, show the sort view or no photos message
        :
        photos.length ? carousel : noPhotosMessage // if NOT editable, show the carousel or no photos message
      }
    </>
  );
}