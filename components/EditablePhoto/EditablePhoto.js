'use client'

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faCropSimple, faUpRightAndDownLeftFromCenter, faLock, faLockOpen, faAdd, faFont } from '@fortawesome/free-solid-svg-icons';
import styles from './editablePhoto.module.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Rnd } from 'react-rnd';
import PrimeText from '../PrimeText/PrimeText';

export default function EditablePhoto({
  photo, isEditable, updatePhotoContent, handleRemovePhoto, containerClassName,
  index, setSelectedPhotos, handleTitleChange, handleCaptionChange}) {
  const [crop, setCrop] = useState({unit: '%', width: 100, height: 100, x: 0, y: 0});
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [completedCrop, setCompletedCrop] = useState(null);
  const imageRef = useRef(null);
  const [cropActive, setCropActive] = useState(false);

  // useEffect(() => { console.log('fileObj changed. fileObj: ', fileObj)}, [fileObj])
    // useEffect(() => {
    //   console.log('photo in editable photo: ', photo)
    // }, [])

  useEffect(() => {
    if (lockAspectRatio && imageRef) {
      const aspectRatio = imageRef.naturalWidth / imageRef.naturalHeight;
      setCrop({ ...crop, aspect: aspectRatio });
    } else {
      setCrop({ ...crop, aspect: undefined });
    }
  }, [lockAspectRatio, imageRef]);

  useEffect(() => {
    if (!isEditable) {
      setCropActive(false);
    }
  }, [isEditable])
  // CROP HANDLERS
  // const enforceCropConstraints = () => {
  //   const maxWidth = unit === 'percent' ? 100 : imageRef.naturalWidth;
  //   const maxHeight = unit === 'percent' ? 100 : imageRef.naturalHeight;
  //   setCropSize({
  //     width: Math.min(cropSize.width, maxWidth),
  //     height: Math.min(cropSize.height, maxHeight)
  //   });
  // };
  const onImageLoaded = (image) => {
    imageRef.current = image;
    // aspect: 16 / 9
    if (lockAspectRatio) {
      const aspectRatio = image.naturalWidth / image.naturalHeight;
      setCrop({ ...crop, aspect: aspectRatio });
    }
  }
  const onCropChange = (crop, percentCrop) => {
    setCrop(crop);
  };
  const toggleCrop = () => {
    setCropActive(!cropActive);
    // Reset to initial crop when enabling crop mode
    if (!cropActive && !crop) {
      setCrop({ unit: '%', width: 50, aspect: 16 / 9 });
    }
  };
  const finalizeCrop = () => {
    console.log('inside finalizeCrop: completedCrop: ', completedCrop)
    if (completedCrop && imageRef.current) {
      makeClientCrop(completedCrop);
      toggleCrop();
    }
    setCrop({unit: '%', width: 100, height: 100, x: 0, y: 0,})

  };
  const makeClientCrop = async (crop) => {
    if (imageRef.current && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef.current,
        crop,
        `newFile_${index}.webp` // Assuming index is the identifier for the image
      );
      // Use setSelectedPhotos to update the src of the current fileObj
      setSelectedPhotos(prevPhotos => {
        // Create a copy of the array to avoid mutating the state directly
        const updatedPhotos = [...prevPhotos];
        // Update the src for the fileObj at the specific index
        const updatedFileObj = { ...updatedPhotos[index], src: croppedImageUrl, file: croppedImageUrl };
        updatedPhotos[index] = updatedFileObj;
        // Return the updated array for the state update
        return updatedPhotos;
      });
    }
  };
  const getCroppedImg = async (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelCrop = {
      x: crop.x * scaleX,
      y: crop.y * scaleY,
      width: crop.width * scaleX,
      height: crop.height * scaleY,
    };
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // Convert the canvas to a base64 data URL in WebP format
    return canvas.toDataURL('image/webp');
  };
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
        <FontAwesomeIcon icon={faCropSimple} className={styles.cropIcon} />
      </div>
      <div className={styles.photoEditMenuIconWrapper}>
        <p className={photo.caption ? styles.caption : styles.noCaption}>Add Title</p>
      </div>
      <div className={styles.photoEditMenuIconWrapper}>
        <p className={photo.caption ? styles.caption : styles.noCaption}
        >Add Caption</p>
      </div>
      <div className={styles.photoEditMenuIconWrapper} onClick={() => handleRemovePhoto(index)}>
        <FontAwesomeIcon icon={faTrashCan} className={styles.removePhotoIcon}  />
      </div>
    </div>
  )
  const image = (
    <img src={photo.src}
      className='gridPhoto'
      alt={`Preview ${index}`}
      ref={imageRef}
    // style={fileObj.style}
    />
  )
  if (!photo || !photo.src) { return <p>No photo added yet</p> }

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
            {image}
          </ReactCrop>
          {cropControls}
        </>
      ) : (
        <>
          {isEditable && editMenu}
          {image}
          {/* {photo.title && <PrimeText src={{content: photo.title}} isEditable={isEditable} setTextState={handleTitleChange}/>} */}
        </>
      )}
    </div>
  )
}