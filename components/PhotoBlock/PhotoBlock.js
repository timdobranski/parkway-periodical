'use client'

import { useState, useEffect } from 'react';
import styles from './photoBlock.module.css';
import PhotoCarousel from '../PhotoCarousel/PhotoCarousel'
import EditablePhoto from '../EditablePhoto/EditablePhoto';
import { createClient } from '../../utils/supabase/client';
import PhotoGrid from '../PhotoGrid/PhotoGrid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleUp, faPlus} from '@fortawesome/free-solid-svg-icons';
import { Rnd } from 'react-rnd';

// src is photo block parent state; selectedPhotos is photo block child state before saving
export default function PhotoBlock({ photo, addPhoto, deletePhoto, isEditable, nestedIndex }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('photo passed to PhotoBlock: ', photo)
  }, [photo])

  const handleTitleChange = (index, newTitle) => {
    console.log('new title: ', newTitle);
    setSelectedPhotos(files =>
      files.map((fileObj, idx) => idx === index ? { ...fileObj, title: newTitle } : fileObj)
    );
  };
  const handleCaptionChange = (index, newCaption) => {
    setSelectedPhotos(files =>
      files.map((fileObj, idx) => { return idx === index ? { ...fileObj, caption: newCaption } : fileObj})
    );
  };
  const noPhotosMessage = (
    <p className={styles.noPhotoMessage}>No photo provided</p>
  )
  const loadingMessage = (
    <div className={styles.loadingMessage}>
      <FontAwesomeIcon icon={faCircleUp} className={styles.loadingIcon} />
      <p>Uploading Photo...</p>
    </div>
  )
  const content = (
    <EditablePhoto
      photo={photo}
      isEditable={isEditable}
      updatePhotoContent={addPhoto}
      deletePhoto={deletePhoto}
      containerClassName={styles.photoContainer}
      handleTitleChange={(title) => handleTitleChange(index, title)}
      handleCaptionChange={(caption) => handleCaptionChange(index, caption)}
    />
  )


  return (
    <div className={styles.photoBlockWrapper}>
      {isEditable && !photo?.src &&
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {addPhoto(e, nestedIndex)}}
          className={styles.photoInput}
        />}

      {!photo ? noPhotosMessage : content}
    </div>
  )
}