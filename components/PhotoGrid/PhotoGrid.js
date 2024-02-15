'use client'

import styles from './photoGrid.module.css';
import React, { useState, useEffect } from 'react';
import EditablePhoto from '../EditablePhoto/EditablePhoto';

export default function PhotoGrid ({
  photos, setActiveBlock, blockIndex, isEditable, updatePhotoContent, setPhotoContent, handleTitleChange, format,
  handleCaptionChange, handleRemovePhoto, onDragStart, onDragOver, onDrop, index, selectedPhotos, setSelectedPhotos

}) {
  const [gridClassName, setGridClassName] = useState('');
  const [photoClassName, setPhotoClassName] = useState('');

  // should handle cases where photos.format ===
  // 1. single-photo-caption-right
  // 2. single-photo-caption-left
  // 3. 2xColumn
  // 4. 3xColumn
  // 5. grid
  // 6. single-photo-caption-above
  // 7. single-photo-caption-below

  // determine the format and set the grid class accordingly
  useEffect(() => {
    // console.log('photos passed to PhotoGrid: ', photos);
    // console.log('format of photos: ', format);
    if (!photos || photos.length === 0) {
      return; // Return early if no photos
    }
    let gridClass = '';
    let photoClass = '';

    switch (format) {
      case 'single-photo-caption-right':
        gridClass = 'singlePhotoGrid';
        photoClass = 'photoWithCaptionRight';
        break;
      case 'single-photo-caption-left':
        gridClass = 'singlePhotoGrid';
        photoClass = 'photoWithCaptionLeft';
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
      case 'single-photo-caption-above':
        gridClass = styles.singlePhotoGrid;
        photoClass = styles.photoWithCaptionAbove;
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
  }, [photos]);

  // useEffect(() => {
  //   console.log('grid class name: ', gridClassName);
  // }), [gridClassName];

  if (!photos || photos.length === 0 ) {
    return <div>No photos to display</div>;
  }




  return (
<>
  <div className={`${styles.photosGrid} ${styles[gridClassName]}`}>
    {photos.map((photo, index) => {
      console.log('photo: ', photo)
      return (
      <div key={index} className={`${styles.gridPhotoContainer} ${styles[photoClassName]}`}>
        {isEditable ? (
          <EditablePhoto
            isEditable={isEditable}
            fileObj={photo}
            index={index}
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
          <img src={photo.src} alt={`Photo ${index}`} className='gridPhoto' onClick={() => setActiveBlock(blockIndex)} style={photo.style}/>
        )}
      </div>
      )
        })}
  </div>

  <div className={`${styles.gridCaptionContainer} ${styles[gridClassName]}`}>
    {photos.map((photo, index) => (
      <div key={index} className={`${styles.photoInfoContainer}`}>
        {isEditable ? ( null
        ) : (
          <>
            {photo.title && <p className={styles.photoTitle}>{photo.title}</p>}
            {photo.caption && <p className={styles.photoCaption}>{photo.caption}</p>}
          </>
        )}
      </div>
    ))}
  </div>
</>
  );


}