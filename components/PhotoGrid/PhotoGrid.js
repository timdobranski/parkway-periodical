'use client'

import styles from './photoGrid.module.css';
import React, { useState, useEffect } from 'react';
import EditablePhoto from '../EditablePhoto/EditablePhoto';
// import SinglePhoto from '../SinglePhoto/SinglePhoto';

export default function PhotoGrid ({
  photos, setActiveBlock, blockIndex, isEditable, updatePhotoContent,  handleTitleChange, format,
  handleCaptionChange, handleRemovePhoto, onDragStart, onDragOver, onDrop, selectedPhotos, setSelectedPhotos

}) {
  const [gridClassName, setGridClassName] = useState('');
  const [photoClassName, setPhotoClassName] = useState('');
  const [containerClassName, setContainerClassName] = useState('');



  // determine the format and set the grid class accordingly
  useEffect(() => {

    if (!photos || photos.length === 0) {
      return;
    }
    let gridClass = '';
    let photoClass = '';
    let containerClass = '';

    switch (format) {
      case 'single-photo-caption-right':
        gridClass = 'photoWithCaptionRight';
        photoClass = 'photoWithCaptionRight';
        containerClass = 'photoWithCaptionRight';

        break;
      case 'single-photo-caption-left':
        gridClass = 'singlePhotoGrid';
        photoClass = 'photoWithCaptionLeft';
        containerClass = 'photoWithCaptionLeft';

        break;
      case '2xColumn':
        gridClass = 'photosGridTwoColumns';
        break;
      case '3xColumn':
        gridClass = 'photosGridThreeColumns';
        break;
      case 'grid':
        gridClass = 'photosGridTwoColumns';
        break;
      case 'single-photo-no-caption':
        gridClass = 'singlePhotoGrid';
        photoClass = 'singlePhotoNoCaption';
        break;
      case 'single-photo-caption-below':
        gridClass = 'singlePhotoGrid';
        photoClass = 'photoWithCaptionBelow'
        break;
      default:
        gridClass = styles.photosGrid; // Default case
        break;
    }
    setGridClassName(gridClass);
    setPhotoClassName(photoClass);
    setContainerClassName(containerClass);

  }, [photos]);


  if (!photos || photos.length === 0 ) {
    return <div>No photos to display</div>;
  }


  return (
    <div className={`${styles.photoGridContainer} ${styles[containerClassName]}`}>
      <div className={`${styles.photosGrid} ${styles[gridClassName]}`}>
        {photos.map((photo, index) => {
          // console.log('photo: ', photo)
          return (
            <div key={index} className={`${styles.gridPhotoContainer} ${styles[photoClassName]}`}>
              {isEditable ? (
                <EditablePhoto
                  containerClassName={containerClassName}
                  isEditable={isEditable}
                  fileObj={photo}
                  index={index}
                  blockIndex={blockIndex}
                  handleTitleChange={handleTitleChange}
                  handleCaptionChange={handleCaptionChange}
                  handleRemovePhoto={handleRemovePhoto}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  updatePhotoContent={updatePhotoContent}
                  selectedPhotos={selectedPhotos}
                  setSelectedPhotos={setSelectedPhotos}
                />
              ) : (
                <img
                  src={photo.src}
                  alt={`Photo ${index}`}
                  className='gridPhoto'
                  onClick={() => setActiveBlock(blockIndex)}
                  // style={photo.style}
                />
              )}
            </div>
          )
        })}
      </div>
      {photoClassName !== 'singlePhotoNoCaption' &&
      <div className={`${styles.gridCaptionContainer} ${styles[gridClassName]}`}>
        {photos.map((photo, index) => (
          <div key={index} className={`${styles.photoInfoContainer}`}>
            {isEditable ? (
              <div className={styles.captionTitleContainer}>
                {/* <input
                  value={photo.title}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                  placeholder="Enter title"
                  className={styles.titleInput}
                /> */}
                <textarea
                  value={photo.caption}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  placeholder="Enter caption (optional)"
                  className={styles.captionInput}
                  onKeyDown={(e) => { if (e.key === 'Enter') { setActiveBlock(null) } }}
                  rows={4}
                />
              </div>
            ) : (
              <>
                {/* {photo.title && <div className={styles.photoTitleWrapper}><p className={styles.photoTitle}>{photo.title}</p></div>} */}
                {photo.caption && <p className={styles.photoCaption}>{photo.caption}</p>}
              </>
            )}
          </div>
        ))}
      </div>
      }
    </div>
  );
}