'use client'

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faCropSimple, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import styles from './editablePhoto.module.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function EditablePhoto({ fileObj, updatePhotoContent, handleTitleChange, handleCaptionChange, handleRemovePhoto, index }) {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    aspect: 16 / 9
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [src, setSrc] = useState(fileObj.file ? URL.createObjectURL(fileObj.file) : fileObj.src);
  const [imageRef, setImageRef] = useState(null);
  const [cropActive, setCropActive] = useState(false);

  const onImageLoaded = (image) => {
    setImageRef(image);
  };
  const onCropChange = (crop, percentCrop) => {
    setCrop(percentCrop);
  };
  const toggleCrop = () => {
    setCropActive(!cropActive);
    // Reset to initial crop when enabling crop mode
    if (!cropActive && !crop) {
      setCrop({ unit: '%', width: 50, aspect: 16 / 9 });
    }
  };
  const finalizeCrop = () => {
    if (crop && imageRef) {
      makeClientCrop(crop);
    }
  };
  const makeClientCrop = async (crop) => {
    if (imageRef && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef,
        crop,
        'newFile.jpeg'
      );
      setSrc(croppedImageUrl);
    }
  };
  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(fileUrl);
        const fileUrl = window.URL.createObjectURL(blob);
        resolve(fileUrl);
      }, 'image/jpeg');
    });
  }

  if (!fileObj || !src) { return null }

  return (
    <div>
      <div className={styles.photoWrapper}>
        <div className={styles.photoEditMenu}>
          <div className={styles.photoEditMenuIconWrapper} onClick={toggleCrop}>
          <FontAwesomeIcon icon={faCropSimple} className={styles.cropIcon} />
          <h3 className={styles.photoEditMenuIconLabel}>Crop</h3>
        </div>

          <div className={styles.photoEditMenuIconWrapper}>
            <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} className={styles.resizeIcon}/>
            <h3 className={styles.photoEditMenuIconLabel}>Resize</h3>
          </div>

          <div className={styles.photoEditMenuIconWrapper} onClick={() => handleRemovePhoto(index)}>
            <FontAwesomeIcon icon={faX} className={styles.removePhotoIcon}  />
            <h3 className={styles.photoEditMenuIconLabel}>Remove</h3>
          </div>
        </div>

        {cropActive ? (
      <ReactCrop
        src={src}
        crop={crop}
        onImageLoaded={onImageLoaded}
        onChange={onCropChange}
      >
        <img src={src} className={styles.photoPreview} alt={`Preview ${index}`} />
      </ReactCrop>
    ) : (
      <img src={src} className={styles.photoPreview} alt={`Preview ${index}`} />
    )}
      {cropActive && (
      <button onClick={finalizeCrop}>Confirm Crop</button>
    )}
      </div>
      <input
        value={fileObj.title}
        onChange={(e) => handleTitleChange(index, e.target.value)}
        placeholder="Enter title"
        className={styles.titleInput}
      />
      <textarea
        value={fileObj.caption}
        onChange={(e) => handleCaptionChange(index, e.target.value)}
        placeholder="Enter caption (optional)"
        className={styles.captionInput}
        onKeyDown={(e) => { if (e.key === 'Enter') { setActiveBlock(null) } }}
        rows={4}
      />
    </div>
  )
}