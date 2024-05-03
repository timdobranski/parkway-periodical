'use client'

import { useState, useEffect, useRef } from 'react';
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
  const [crop, setCrop] = useState({unit: '%', width: 100, height: 100, x: 0, y: 0});
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [completedCrop, setCompletedCrop] = useState(null);
  const imageRef = useRef(null);
  const [cropActive, setCropActive] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);

  // useEffect(() => { console.log('fileObj changed. fileObj: ', fileObj)}, [fileObj])
  useEffect(() => {
    console.log('photo in editable photo: ', photo)
  }, [])

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

  const onImageLoaded = (image) => {
    imageRef.current = image;
    // aspect: 16 / 9
    if (lockAspectRatio) {
      const aspectRatio = image.naturalWidth / image.naturalHeight;
      setCrop({ ...crop, aspect: aspectRatio });
    }
  }
  const onCropChange = (crop, percentCrop) => {
    if (precentCrop) {
      setCrop(percentCrop);
    } else {
      setCrop(crop);
    }
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
      const croppedImageBase64 = await getCroppedImg(
        imageRef.current,
        crop,
        `newFile_${index}.webp`  // Assuming 'index' is the identifier for the image
      );

      // Convert base64 to Blob
      const fetchRes = await fetch(croppedImageBase64);
      const blob = await fetchRes.blob();

      // Upload new image to Supabase
      const newFileName = `newFile_${index}.webp`;  // Consider using a more unique naming scheme
      const { error: uploadError } = await supabase
        .storage
        .from('posts')
        .update(`photos/${photo.fileName}`, blob, {
          cacheControl: '3600',  // Cache for 1 hour, adjust as necessary
          upsert: true  // This ensures it replaces the existing file
        });

      if (uploadError) {
        console.log('Error uploading new image: ', uploadError);
        return;
      }

      // Optionally, remove the old image from storage if it's different from the new one
      // const oldFileName = `...`;
      // const { error: deleteError } = await supabase
      //   .storage
      //   .from('photos')
      //   .remove([`photos/${oldFileName}`]);
      // if (deleteError) {
      //   console.log('Error deleting old image: ', deleteError);
      // }

      // Append a timestamp to the image URL to prevent caching
      const imageUrl = `${supabase.storage.from('photos').getPublicUrl(`photos/${newFileName}`).publicURL}?time=${new Date().getTime()}`;

      // Use this 'imageUrl' wherever needed to reflect the updated image
      // Example: setImageSrc(imageUrl);
    }
  };
  const getCroppedImg = async (imageSrc, crop, fileName) => {
    // Download the image data from storage
    const { data, error } = await supabase
      .storage
      .from('posts')
      .download(`photos/${photo.fileName}`);

    if (error) {
      console.log('Error downloading image: ', error);
      return;
    }

    // Create a URL from the Blob
    const imageUrl = URL.createObjectURL(new Blob([data], { type: 'image/webp' }));

    // Create a new image element
    const img = new Image();
    img.src = imageUrl;

    // Ensure the image is loaded before drawing to canvas
    return new Promise((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;
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
          img,
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
        resolve(canvas.toDataURL('image/webp'));
        URL.revokeObjectURL(imageUrl);  // Clean up
      };

      img.onerror = reject;
    });
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
  const image = (
    <img src={photo.src}
      className='gridPhoto'
      alt={`Preview ${index}`}
      ref={imageRef}
    // style={fileObj.style}
    />
  )

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
          {typeof photoIndex === 'number' && <h3 className={styles.photoNumber}>#{photoIndex + 1}</h3>}
          {/* {photo.title && <PrimeText src={{content: photo.title}} isEditable={isEditable} setTextState={handleTitleChange}/>} */}
        </>
      )}
    </div>
  )
}