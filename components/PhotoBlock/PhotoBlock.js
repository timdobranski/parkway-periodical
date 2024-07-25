'use client'

import { useState, useEffect, useRef } from 'react';
import styles from './photoBlock.module.css';
import EditablePhoto from '../EditablePhoto/EditablePhoto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleUp, faPlus} from '@fortawesome/free-solid-svg-icons';
import ContentBlockTitleAndCaption from '../ContentBlockTitleAndCaption/ContentBlockTitleAndCaption';


// src is photo block parent state; selectedPhotos is photo block child state before saving
export default function PhotoBlock({ photo, addPhoto, deletePhoto, isEditable, setPhotoStyle, viewContext, setContentBlocks, index, nestedIndex, isLayout }) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(photo?.title || false);
  const [caption, setCaption] = useState(photo?.caption || false);

  const [showTitle, setShowTitle] = useState(false);
  const [showCaption, setShowCaption] = useState(false);

  const hasMounted = useRef(false);

  // if the title or caption are not false, show them. empty strings will still be shown
  useEffect(() => {
    if (title !== false) {
      console.log('title is not false, setting showTitle to true')
      setShowTitle(true);
    } else {
      console.log('title is false, setting showTitle to false')
      setShowTitle(false);
    }
  }, [title])

  useEffect(() => {
    if (caption !== false) {
      setShowCaption(true);
    } else {
      console.log('title is false, setting showTitle to false')
      setShowCaption(false);
    }
  }, [caption])

  useEffect(() => {
    console.log('showTitle changed: ', showTitle)
    if (hasMounted.current && showTitle === false) {
      setTitle(false);
    }
  }, [showTitle])

  useEffect(() => {

  }, [showCaption])

  // toggles the title or caption between false and an empty string. false prevents render, empty string allows for input
  const toggleText = (captionOrTitle) => {
    console.log('inside toggle text')
    if (captionOrTitle === 'caption') {
      if (caption === false) {
        setCaption('');
      } else {
        setCaption(false);
      }
    } else {
      console.log('')
      if (title === false) {
        console.log('title is false, resetting it to an empty string')
        setTitle('');
      } else {
        console.log('title is not false, setting it to false')
        setTitle(false);
      }
    }
  }


  useEffect(() => {
    console.log('photo passed to PhotoBlock: ', photo)
  }, [photo])

  const updateTitleAndCaption = () => {
    setContentBlocks(prev => {
      const newContent = [...prev];

      if (nestedIndex) {
        newContent[index].content[nestedIndex].content[0].title = title || ''; // if title is false, set to an empty string
        newContent[index].content[nestedIndex].content[0].caption = caption || '';
      } else {
        newContent[index].content[0].title = title;
        newContent[index].content[0].caption = caption;
      }
      return newContent;
    })
  }

  useEffect(() => {
    if (!isEditable && hasMounted.current && setContentBlocks) {
      updateTitleAndCaption();
    } else {
      hasMounted.current = true;
    }
  }, [isEditable])

  // const handleTitleChange = (index, newTitle) => {
  //   console.log('new title: ', newTitle);
  //   setSelectedPhotos(files =>
  //     files.map((fileObj, idx) => idx === index ? { ...fileObj, title: newTitle } : fileObj)
  //   );
  // };
  // const handleCaptionChange = (index, newCaption) => {
  //   setSelectedPhotos(files =>
  //     files.map((fileObj, idx) => { return idx === index ? { ...fileObj, caption: newCaption } : fileObj})
  //   );
  // };
  const noPhotosMessage = (
    <p className={styles.noPhotoMessage}>No photo provided</p>
  )

  const photoComponent = (
    <EditablePhoto
      photo={photo}
      isEditable={isEditable}
      updatePhotoContent={addPhoto}
      deletePhoto={deletePhoto}
      containerClassName={styles.photoContainer}
      // handleTitleChange={(title) => handleTitleChange(index, title)}
      // handleCaptionChange={(caption) => handleCaptionChange(index, caption)}
      setPhotoStyle={setPhotoStyle}
      isLayout={isLayout}
      toggleText={toggleText}
      showTitle={showTitle} // to determine styling for title and caption buttons in edit controls
      showCaption={showCaption}
    />
  )

  const titleAndCaptionInputs = (
    <div className={styles.titleAndCaption}>
      { showTitle !== false &&
      <input
        type="text"
        placeholder="Add Title"
        className={styles.titleInput}
        value={isEditable ? title : photo?.title}
        onChange={(e) => setTitle(e.target.value)}
      />}

      { showCaption !== false &&
        <textarea
          type="text"
          placeholder="Add Caption"
          className={styles.captionInput}
          value={isEditable ? caption : photo?.caption}
          onChange={(e) => setCaption(e.target.value)}
        />}
    </div>
  )

  const titleAndCaption = (
    <div className={styles.titleAndCaption}>
      <p className={styles.title}>{photo?.title}</p>
      <p className={styles.caption}>{photo?.caption}</p>
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
      {/* <ContentBlockTitleAndCaption
        toggleText={toggleText} // needs to be passed in rather than local to enable edit menu buttons to toggle text
        showTitle={showTitle} // needs to be passed in rather than local to enable edit menu buttons to toggle text
        showCaption={showCaption} // needs to be passed in rather than local to enable edit menu buttons to toggle text
        setShowTitle={setShowTitle}
        setShowCaption={setShowCaption}
        isEditable={isEditable}
        content={photo}

      /> */}
    </div>
  )
}