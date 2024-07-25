'use client'

import { useState, useEffect, useRef } from 'react';
import styles from './photoBlock.module.css';
import PhotoCarousel from '../PhotoCarousel/PhotoCarousel'
import EditablePhoto from '../EditablePhoto/EditablePhoto';
import { createClient } from '../../utils/supabase/client';
import PhotoGrid from '../PhotoGrid/PhotoGrid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleUp, faPlus} from '@fortawesome/free-solid-svg-icons';
import { Rnd } from 'react-rnd';
import PrimeText from '../PrimeText/PrimeText';

// src is photo block parent state; selectedPhotos is photo block child state before saving
export default function PhotoBlock({ photo, addPhoto, deletePhoto, isEditable, setPhotoStyle, viewContext, setContentBlocks, index, nestedIndex, }) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(photo?.title || '');
  const [caption, setCaption] = useState(photo?.caption || '');
  const hasMounted = useRef(false);


  useEffect(() => {
    console.log('photo passed to PhotoBlock: ', photo)
  }, [photo])


  useEffect(() => {
    if (!isEditable && hasMounted.current && setContentBlocks) {
      setContentBlocks(prev => {
        const newContent = [...prev];

        if (nestedIndex) {
          newContent[index].content[nestedIndex].content[0].title = title;
          newContent[index].content[nestedIndex].content[0].caption = caption;
        } else {
          newContent[index].content[0].title = title;
          newContent[index].content[0].caption = caption;
        }
        return newContent;
      })
    } else {
      hasMounted.current = true;
    }
  }, [isEditable])

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
  const photoComponent = (
    <EditablePhoto
      photo={photo}
      isEditable={isEditable}
      updatePhotoContent={addPhoto}
      deletePhoto={deletePhoto}
      containerClassName={styles.photoContainer}
      handleTitleChange={(title) => handleTitleChange(index, title)}
      handleCaptionChange={(caption) => handleCaptionChange(index, caption)}
      setPhotoStyle={setPhotoStyle}
    />
  )

  const titleAndCaptionInputs = (
    <div className={styles.titleAndCaption}>
      <input
        type="text"
        placeholder="Add Title (optional)"
        className={styles.titleInput}
        value={isEditable ? title : photo?.title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {/* <textarea
        type="text"
        placeholder="Add Caption (optional)"
        className={styles.captionInput}
        value={isEditable ? caption : photo?.caption}
        onChange={(e) => setCaption(e.target.value)}
      /> */}
      <PrimeText
        isEditable={isEditable}
        setTextState={setCaption}
        src={{content: caption}}

      />
    </div>
  )

  const titleAndCaption = (
    <div className={styles.titleAndCaption}>
      <p className={styles.title}>{photo?.title}</p>
      <PrimeText
        isEditable={isEditable}
        setTextState={setCaption}
        src={{content: caption}}

      />
    </div>
  )

  return (
    <div className={styles.photoBlockWrapper}>

      {/* if we're in the editor view, and there's no photo, and we ARE editing this block, show the photo */}
      {isEditable && !photo?.src &&
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {addPhoto(e, nestedIndex)}}
          className={styles.photoInput}
        />}

      {/* if we're in the editor view, and there's no photo, BUT we're not currently editing this block, show the noPhotosMessage */}
      {viewContext === 'edit' &&  !photo && noPhotosMessage}


      {photo && photoComponent}
      {photo && isEditable && titleAndCaptionInputs }
      {photo && !isEditable && (photo.title || photo.caption) && titleAndCaption}
    </div>
  )
}