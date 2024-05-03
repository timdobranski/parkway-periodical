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
import supabase from '../../utils/supabase';

export default function EditablePhoto({
  photo, isEditable, updatePhotoContent, deletePhoto, containerClassName,
  index, setSelectedPhotos, handleTitleChange, handleCaptionChange, photoIndex}) {
  const imageRef = useRef(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100, aspect: 16 / 9, unit: '%'});
  const [completedCrop, setCompletedCrop] = useState(null);
  const [cropActive, setCropActive] = useState(false);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [imageVersion, setImageVersion] = useState(0);


  // useEffect(() => { console.log('fileObj changed. fileObj: ', fileObj)}, [fileObj])
  // Handle image loaded
  const onImageLoaded = useCallback((img) => {
    imageRef.current = img;
  }, []);

  // Update crop
  const onCropChange = (newCrop) => {
    setCrop(newCrop);
  };
  const updatePhotoInSupabase = async (file) => {
    const { data, error } = await supabase
      .storage
      .from('posts')
      .update(`photos/${photo.fileName}`, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {throw error}

    if (data) {
      // Successfully updated the image, increment the image version to force re-render
      setImageVersion(prev => prev + 1);
      setCropActive(false);  // Disable crop mode
    }
  };


  // Finalize crop
  const finalizeCrop = () => {
    if (imageRef.current && completedCrop) {
      const { width, height, x, y } = completedCrop;
      const canvas = document.createElement('canvas');
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        imageRef.current,
        x * scaleX,
        y * scaleY,
        width * scaleX,
        height * scaleY,
        0,
        0,
        width,
        height
      );

      canvas.toBlob(blob => {
        updatePhotoInSupabase(blob)
      });
    }
  };

  const toggleCrop = () => setCropActive(!cropActive);
  const cropControls = (
    <div className={styles.cropControlsWrapper}>
      <span className={styles.lockWrapper}>
        <p>Aspect Ratio Lock:</p>
        <FontAwesomeIcon icon={lockAspectRatio ? faLock : faLockOpen} onClick={() => setLockAspectRatio(!lockAspectRatio)} className={styles.lockIcon} />
      </span>
      <button onClick={finalizeCrop}>Confirm Crop</button>
    </div>
  )
  const editMenu = (
    <div className={styles.photoEditMenu}>
      <div className={styles.photoEditMenuIconWrapper} onClick={toggleCrop}>
        <FontAwesomeIcon icon={faImage} className={styles.cropIcon} />
      </div>
      <div className={styles.photoEditMenuIconWrapper} onClick={toggleCrop}>
        <FontAwesomeIcon icon={faCropSimple} className={styles.cropIcon} />
      </div>
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
    // style={fileObj.style}
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