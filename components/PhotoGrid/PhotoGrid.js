'use client'

import styles from './photoGrid.module.css';
import React, { useState, useEffect } from 'react';
import EditablePhoto from '../EditablePhoto/EditablePhoto';
// import SinglePhoto from '../SinglePhoto/SinglePhoto';

export default function PhotoGrid ({
  photos, setActiveBlock, blockIndex, isEditable, updatePhotoContent,  handleTitleChange, format,
  handleCaptionChange, handleRemovePhoto, setSelectedPhotos

}) {

  const noPhotosMessage = <p>{`No photos to display`}</p>;

  if (!photos || photos.length === 0) {
    return (
      <div className={styles.noPhotosMessage}>
        {noPhotosMessage}
      </div>
    );
  }

  return (
    <div className={styles.photoGrid}>
      {photos.map((photo, index) => (
        <EditablePhoto
          key={index}
          photo={photo}
          isEditable={isEditable}
          updatePhotoContent={updatePhotoContent}
          handleRemovePhoto={handleRemovePhoto}
          containerClassName={styles.photoContainer}
          index={index}
          setSelectedPhotos={setSelectedPhotos}
          handleTitleChange={handleTitleChange}
          handleCaptionChange={handleCaptionChange}
        />
      ))}
    </div>
  )
}