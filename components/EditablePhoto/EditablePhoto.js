'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCropSimple, faUpRightAndDownLeftFromCenter, faLock, faLockOpen, faPen, faAlignJustify,
  faAlignLeft, faAlignCenter, faAlignRight, faUpDown, faGripLines, faChevronUp, faChevronDown, faImage } from '@fortawesome/free-solid-svg-icons';
import styles from './editablePhoto.module.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Rnd } from 'react-rnd';
import PrimeText from '../PrimeText/PrimeText';
import { createClient } from '../../utils/supabase/client';

export default function EditablePhoto({
  photo, isEditable, updatePhotoContent, deletePhoto, containerClassName,
  index, setSelectedPhotos, handleTitleChange, handleCaptionChange, photoIndex, photoContext}) {
  const supabase = createClient()
  const imageRef = useRef(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100, aspect: 16 / 9, unit: '%'});
  const [completedCrop, setCompletedCrop] = useState(null);
  const [cropActive, setCropActive] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [imageVersion, setImageVersion] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Loading Image...')

  useEffect(() => {
    setLoadingMessage('Loading...');
  }, [photo.src, imageVersion]);

  // Handle image loaded
  const onImageLoaded = useCallback((img) => {
    imageRef.current = img;
  }, []);

  useEffect(() => {
    if (!isEditable) {setCropActive(false)}
  }, [isEditable])

  // Update crop
  const onCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const updatePhotoInSupabase = async (file) => {
    console.log('photo passed to editablePhoto component:', photo);
    console.log('file passed to updatePhotoInSupabase:', file);
    try {
      // Try updating the file first
      const { data: updateData, error: updateError } = await supabase
        .storage
        .from('posts')
        .update(`photos/${photo.fileName}`, file, {
          cacheControl: '3600', upsert: true
        });

      // If the file does not exist, upload it
      if (updateError) {
        console.log('Error updating file in editablePhoto crop: ', updateError.message);
        return;
      }

      // Successfully uploaded the image, increment the image version to force re-render
      setImageVersion(prev => prev + 1);
      setCropActive(false);  // Disable crop mode


    } catch (error) {
      console.error('Error updating/uploading file:', error);
    }
  };


  // Finalize crop
  const finalizeCrop = () => {
    if (imageRef.current && completedCrop) {
      const { width, height, x, y } = completedCrop;
      const canvas = document.createElement('canvas');
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
      canvas.width = width * scaleX;
      canvas.height = height * scaleY;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        imageRef.current,
        x * scaleX,
        y * scaleY,
        width * scaleX,
        height * scaleY,
        0,
        0,
        width * scaleX,
        height * scaleY
      );

      canvas.toBlob(blob => {
        updatePhotoInSupabase(blob);
      });
    }
  };

  const toggleCrop = () => setCropActive(!cropActive);

  const cropControls = (
    <div className={styles.cropControlsWrapper}>
      <button onClick={finalizeCrop}>Confirm Crop</button>
    </div>
  )

  const selectPhotoAndCrop = (
    <>
      <div className={styles.photoEditMenuIconWrapper} onClick={toggleCrop}>
        <FontAwesomeIcon icon={faImage} className={styles.cropIcon} />
      </div>
      <div className={styles.photoEditMenuIconWrapper} onClick={toggleCrop}>
        <FontAwesomeIcon icon={faCropSimple} className={styles.cropIcon} />
      </div>
    </>
  )
  const editMenu = (
    <div className={styles.photoEditMenu}>
      {selectPhotoAndCrop}
      <div className={styles.photoEditMenuIconWrapper}>
        <FontAwesomeIcon icon={faPen} className={styles.captionIcon} />
      </div>
      <div className={styles.photoEditMenuIconWrapper}>
        <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} className={styles.captionIcon} />
      </div>
      <div className={styles.photoEditMenuIconWrapper}>
        <FontAwesomeIcon icon={faAlignJustify}
          className={styles.captionIcon}
          onClick={() => menuExpanded !== 'horizontalAlignment' ? setMenuExpanded('horizontalAlignment') : setMenuExpanded(false)} />
        <div className={`${styles.expandedMenu} ${menuExpanded === 'horizontalAlignment' ? '' : 'hidden'}`}>
          <FontAwesomeIcon icon={faAlignLeft} className={styles.expandedIcon} />
          <FontAwesomeIcon icon={faAlignCenter} className={styles.expandedIcon} />
          <FontAwesomeIcon icon={faAlignRight} className={styles.expandedIcon} />
        </div>
      </div>
      <div className={styles.photoEditMenuIconWrapper}>
        <FontAwesomeIcon icon={faUpDown}
          className={styles.captionIcon}
          onClick={() => menuExpanded !== 'verticalAlignment' ? setMenuExpanded('verticalAlignment') : setMenuExpanded(false)} />
        <div className={`${styles.expandedMenu} ${menuExpanded === 'verticalAlignment' ? '' : 'hidden'}`}>
          <FontAwesomeIcon icon={faChevronUp} className={styles.expandedIcon} />
          <FontAwesomeIcon icon={faGripLines} className={styles.expandedIcon} />
          <FontAwesomeIcon icon={faChevronDown} className={styles.expandedIcon} />
        </div>
      </div>

      <div className={styles.photoEditMenuIconWrapper} onClick={() => deletePhoto(photo.fileName)}>
        <FontAwesomeIcon icon={faTrash} className={styles.removePhotoIcon}  />
      </div>
    </div>
  )
  const imageElement = (
    <img
      src={`${photo.src}?v=${imageVersion}`}
      className='gridPhoto'
      alt={`Preview ${index}`}
      ref={imageRef}
      crossOrigin="anonymous"
      onLoad={() => setLoadingMessage('')}
      style={photo.style}
    />
  )

  if (!photo.src) {
    return null;
  }



  return (
    <div className={styles.photoWrapper}>

      { cropActive ? (
        <>
          <ReactCrop
            crop={crop}
            onImageLoaded={onImageLoaded}
            onChange={onCropChange}
            onComplete={setCompletedCrop}
            overlayColor="rgba(0, 0, 0, 0.6)"
          >
            {imageElement}
          </ReactCrop>
          {cropControls}
        </>
      ) : (
        <>
          {isEditable && editMenu}
          {imageElement}
          {typeof photoIndex === 'number' && <h3 className={styles.photoNumber}>#{photoIndex + 1}</h3>}
          {/* {photo.title && <PrimeText src={{content: photo.title}} isEditable={isEditable} setTextState={handleTitleChange}/>} */}
        </>
      )}
    </div>
  )
}