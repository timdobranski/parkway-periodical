'use client'

import { useState, useEffect, useRef } from 'react';
import styles from './photoBlock.module.css';
import EditablePhoto from '../EditablePhoto/EditablePhoto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleUp, faPlus} from '@fortawesome/free-solid-svg-icons';
import ContentBlockTitleAndCaption from '../ContentBlockTitleAndCaption/ContentBlockTitleAndCaption';


// src is photo block parent state; selectedPhotos is photo block child state before saving
export default function PhotoBlock({
  photo,
  addPhoto,
  deletePhoto,
  isEditable,
  setPhotoStyle,
  viewContext,
  setContentBlocks,
  index,
  nestedIndex,
  isLayout,
  toggleTitleOrCaption
}) {

  const [loading, setLoading] = useState(false);
  // const [title, setTitle] = useState(photo?.title || false);
  // const [caption, setCaption] = useState(photo?.caption || false);

  // const [showTitle, setShowTitle] = useState(false);
  // const [showCaption, setShowCaption] = useState(false);

  const hasMounted = useRef(false);


  // this needs to update the caption or title value inside the content block so the titleAndCaption component can update


  // pass to title and caption buttons in edit controls
  // toggles the title or caption between false and an empty string. false prevents render, empty string allows for input
  // const toggleText = (captionOrTitle) => {
  //   console.log('inside toggle text')
  //   if (captionOrTitle === 'caption') {
  //     if (caption === false) {
  //       setCaption('');
  //     } else {
  //       setCaption(false);
  //     }
  //   } else {
  //     console.log('')
  //     if (title === false) {
  //       console.log('title is false, resetting it to an empty string')
  //       setTitle('');
  //     } else {
  //       console.log('title is not false, setting it to false')
  //       setTitle(false);
  //     }
  //   }
  // }


  useEffect(() => {
    console.log('photo passed to PhotoBlock: ', photo)
  }, [photo])




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
      setPhotoStyle={setPhotoStyle}
      isLayout={isLayout}
      toggleTitleOrCaption={(titleOrCaption) => {toggleTitleOrCaption(titleOrCaption, index, nestedIndex)}}
    />
  )



  return (
    <div className={styles.photoBlockWrapper}>

      {/* if we're in the editor view, and there's no photo, and we ARE editing this block, show the photo */}
      {isEditable && !photo?.src &&
        <input
          data-testid="singlePhotoInput"
          type="file"
          accept="image/*"
          onChange={(e) => {addPhoto(e, nestedIndex)}}
          className={styles.photoInput}
        />}

      {/* if we're in the editor view, and there's no photo, BUT we're not currently editing this block, show the noPhotosMessage */}
      {viewContext === 'edit' &&  !photo && noPhotosMessage}


      {photo && photoComponent}
      { !isLayout &&
      <ContentBlockTitleAndCaption
        content={photo}
        isEditable={isEditable}
        setContentBlocks={setContentBlocks}
        index={index}
        nestedIndex={nestedIndex}
      />}
    </div>
  )
}