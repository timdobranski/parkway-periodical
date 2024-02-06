'use client'

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faCropSimple, faUpRightAndDownLeftFromCenter, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import styles from './editablePhoto.module.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function EditablePhoto({
  fileObj, updatePhotoContent, handleTitleChange, handleCaptionChange, handleRemovePhoto,
  onDragStart, onDragOver, onDrop, index, selectedPhotos, setSelectedPhotos }) {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    // aspect: 16 / 9
  });
  const [cropSize, setCropSize] = useState({ width: 100, height: 100 }); // In percent or pixels
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageRef, setImageRef] = useState(null);
  const [cropActive, setCropActive] = useState(false);
  const [unit, setUnit] = useState('percent'); // Options: 'percent' or 'pixels'
  const [debouncedCropSize, setDebouncedCropSize] = useState(cropSize);
  const debounceTimer = useRef(null);

  useEffect(() => { console.log('fileObj: ', fileObj)}, [fileObj])

  useEffect(() => {
    if (lockAspectRatio && imageRef) {
      const aspectRatio = imageRef.naturalWidth / imageRef.naturalHeight;
      setCrop({ ...crop, aspect: aspectRatio });
    } else {
      setCrop({ ...crop, aspect: undefined });
    }
  }, [lockAspectRatio, imageRef]);

  useEffect(() => {
    const newWidth = unit === 'percent' ? debouncedCropSize.width : pixelsToPercent(debouncedCropSize.width, 'width');
    const newHeight = unit === 'percent' ? debouncedCropSize.height : pixelsToPercent(debouncedCropSize.height, 'height');
    setCrop({ ...crop, width: newWidth, height: newHeight });
  }, [debouncedCropSize, unit, imageRef]);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedCropSize(cropSize);
    }, 500);
    return () => clearTimeout(debounceTimer.current);
  }, [cropSize]);

  const enforceCropConstraints = () => {
    const maxWidth = unit === 'percent' ? 100 : imageRef.naturalWidth;
    const maxHeight = unit === 'percent' ? 100 : imageRef.naturalHeight;
    setCropSize({
      width: Math.min(cropSize.width, maxWidth),
      height: Math.min(cropSize.height, maxHeight)
    });
  };

  useEffect(() => {
    enforceCropConstraints();
  }, [unit, imageRef]);

  const onImageLoaded = (image) => {
    setImageRef(image);
    if (lockAspectRatio) {
      const aspectRatio = image.naturalWidth / image.naturalHeight;
      setCrop({ ...crop, aspect: aspectRatio });
    }
  };
  const updateCropSize = (newSize) => {
    setCropSize(newSize);
    setCrop({ ...crop, width: newSize.width, height: newSize.height });
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
  const handleWidthChange = (e) => {
    const value = e.target.value;
    const newWidth = unit === 'percent' ? value : percentToPixels(value, 'width');
    setCropSize({ ...cropSize, width: newWidth });
  };
  const handleHeightChange = (e) => {
    const value = e.target.value;
    const newHeight = unit === 'percent' ? value : percentToPixels(value, 'height');
    setCropSize({ ...cropSize, height: newHeight });
  };
  const pixelsToPercent = (value, dimension) => {
    if (!imageRef) return 0;
    const imageSize = dimension === 'width' ? imageRef.naturalWidth : imageRef.naturalHeight;
    return (value / imageSize) * 100;
  };
  // Convert percent to pixels
  const percentToPixels = (value, dimension) => {
    if (!imageRef) return 0;
    const imageSize = dimension === 'width' ? imageRef.naturalWidth : imageRef.naturalHeight;
    return (value / 100) * imageSize;
  };

  if (!fileObj) { return null }

  return (
    <div
      className={styles.draggableWrapper}
    >
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
        overlayColor="rgba(0, 0, 0, 0.6)"
      >
      <img src={fileObj.src} className={styles.photoPreview} alt={`Preview ${index}`} />
      </ReactCrop>
    ) : (
      <img src={fileObj.src}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      className={styles.photoPreview} alt={`Preview ${index}`} />
    )}
      {cropActive && (
        <div className={styles.cropControlsWrapper}>
          <div className={styles.cropManualDimensions}>
              <p>Width</p>
               <input
              type="number"
              value={cropSize.width}
              onChange={(e) => setCropSize({ ...cropSize, width: e.target.value })}
              placeholder="Width"
              className={styles.cropManualDimensionsInput}
            />
            <p>Height</p>
            <input
              type="number"
              value={cropSize.height}
              onChange={(e) => setCropSize({ ...cropSize, height: e.target.value })}
              placeholder="Height"
              className={styles.cropManualDimensionsInput}
            />

            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="percent">Percent</option>
              <option value="pixels">Pixels</option>
            </select>
            </div>
            <span className={styles.lockWrapper}>
            <p>Aspect Ratio Lock:</p>
            <FontAwesomeIcon icon={lockAspectRatio ? faLock : faLockOpen} onClick={() => setLockAspectRatio(!lockAspectRatio)} className={styles.lockIcon} />
            </span>
      <button onClick={finalizeCrop}>Confirm Crop</button>
      </div>
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