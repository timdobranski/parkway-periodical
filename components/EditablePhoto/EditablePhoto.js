'use client'

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faCropSimple, faUpRightAndDownLeftFromCenter, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import styles from './editablePhoto.module.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function EditablePhoto({
  fileObj, updatePhotoContent, handleTitleChange, handleCaptionChange, handleRemovePhoto, containerClassName,
  onDragStart, onDragOver, onDrop, index, selectedPhotos, setSelectedPhotos }) {
  const [crop, setCrop] = useState({unit: '%', width: 100, height: 100, x: 0, y: 0,
    // aspect: 16 / 9
  });
  const [cropSize, setCropSize] = useState({ width: 100, height: 100 }); // In percent or pixels
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [completedCrop, setCompletedCrop] = useState(null);
  const imageRef = useRef(null);
  const [cropActive, setCropActive] = useState(false);
  const [unit, setUnit] = useState('percent'); // Options: 'percent' or 'pixels'
  const [debouncedCropSize, setDebouncedCropSize] = useState(cropSize);
  const debounceTimer = useRef(null);
  const [resizeActive, setResizeActive] = useState(false);

  useEffect(() => { console.log('fileObj changed. fileObj: ', fileObj)}, [fileObj])

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
  useEffect(() => {
    enforceCropConstraints();
  }, [unit, imageRef]);

  // CROP HANDLERS
  const enforceCropConstraints = () => {
    const maxWidth = unit === 'percent' ? 100 : imageRef.naturalWidth;
    const maxHeight = unit === 'percent' ? 100 : imageRef.naturalHeight;
    setCropSize({
      width: Math.min(cropSize.width, maxWidth),
      height: Math.min(cropSize.height, maxHeight)
    });
  };
  const onImageLoaded = (image) => {
    imageRef.current = image;
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
    console.log('inside finalizeCrop: completedCrop: ', completedCrop)
    if (completedCrop && imageRef.current) {
      makeClientCrop(completedCrop);
      toggleCrop();
    }
  };
  const makeClientCrop = async (crop) => {
    if (imageRef.current && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef.current,
        crop,
        `newFile_${index}.jpeg` // Assuming index is the identifier for the image
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
  const percentToPixels = (value, dimension) => {
    if (!imageRef) return 0;
    const imageSize = dimension === 'width' ? imageRef.naturalWidth : imageRef.naturalHeight;
    return (value / 100) * imageSize;
  };
  const cropControls = (
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
  )
  // RESIZE HANDLERS
  const handleResize = () => {
    setResizeActive(true);

    // Update the fileObj with the new style information
    updateFileObjWithStyle(newWidth, newHeight);
  };
  // Function to update the fileObj with new style
  const updateFileObjWithStyle = (newWidth, newHeight) => {
    console.log('updateFileObjWithStyle ran')
    setSelectedPhotos(prevPhotos => {
      const updatedPhotos = [...prevPhotos];
      const updatedFileObj = {
        ...updatedPhotos[index],
        style: { width: newWidth, height: newHeight } // Assuming you want to store dimensions in a 'style' key
      };
      updatedPhotos[index] = updatedFileObj;
      return updatedPhotos;
    });
  };

  if (!fileObj) { return null }

  return (
    // <div className={styles.draggableWrapper}>
    <div className={`${styles.draggableWrapper} ${styles[containerClassName]}`}>

      <div className={styles.photoWrapper}>
        {!cropActive &&
        <div className={styles.photoEditMenu}>
          <div className={styles.photoEditMenuIconWrapper} onClick={toggleCrop}>
            <FontAwesomeIcon icon={faCropSimple} className={styles.cropIcon} />
            <h3 className={styles.photoEditMenuIconLabel}>Crop</h3>
          </div>
          <div className={styles.photoEditMenuIconWrapper}onClick={handleResize}>
            <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} className={styles.resizeIcon}/>
            <h3 className={styles.photoEditMenuIconLabel}>Resize</h3>
          </div>
          <div className={styles.photoEditMenuIconWrapper} onClick={() => handleRemovePhoto(index)}>
            <FontAwesomeIcon icon={faX} className={styles.removePhotoIcon}  />
            <h3 className={styles.photoEditMenuIconLabel}>Remove</h3>
          </div>
        </div>
        }

        {
          cropActive ? (
            <ReactCrop
              crop={crop}
              onImageLoaded={onImageLoaded}
              onChange={onCropChange}
              onComplete={setCompletedCrop}
              overlayColor="rgba(0, 0, 0, 0.6)"
            >
              <img src={fileObj.src} className='gridPhoto' alt={`Preview ${index}`} ref={imageRef} style={fileObj.style}/>
            </ReactCrop>
          ) : resizeActive ? (
          // Your resize component or logic here
            null
          ) : (
            <img src={fileObj.src}
              draggable
              style={fileObj.style}
              onDragStart={(e) => onDragStart(e, index)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, index)}
              className='gridPhoto' alt={`Preview ${index}`} />
          )
        }

        {cropActive && cropControls}
      </div>
      {/* {cropActive ? (
        null
      ) : (
        <div className={styles.captionTitleContainer}>
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
      } */}
    </div>
  )
}