'use client'

import styles from './CroppablePhoto.module.css'
import { useState, useEffect, useRef } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import supabase from '../../utils/supabase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrop, faPencil } from '@fortawesome/free-solid-svg-icons'

export default function CroppablePhoto({ photo, ratio = 1, bucket, filePath, setCropActive }) {
  const [crop, setCrop] = useState(
    {
      unit: 'px',
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      aspect: ratio
    }
  );
  const [completedCrop, setCompletedCrop] = useState(null);
  const imageRef = useRef(null);

  const onImageLoaded = (image) => {
    imageRef.current = image;
    return false; // Required to prevent ReactCrop from breaking the crop object.
  };

  const onCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  const onCropChange = (newCrop) => {
    setCrop({ ...newCrop, aspect: ratio });
  };

  useEffect(() => {
    console.log('crop state: ', completedCrop)
  }, [completedCrop])



  const uploadCroppedPhoto = async (e) => {
    console.log('INSIDE UPLOAD CROPPED PHOTO FUNCTION...')
    e.preventDefault()
    if (!completedCrop || !imageRef.current) {
      if (!completedCrop) {
        console.log('No completed crop; returning...')
      }
      if (!imageRef.current) {
        console.log('No imageRef; returning...');
      }
      return;
    }

    const canvas = document.createElement('canvas');
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      imageRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'cropped.webp', { type: 'image/webp' });

      const { data, error } = await supabase.storage
        .from(bucket) // Ensure this is your actual bucket name
        .upload(`${filePath}`, file, { upsert: true });

      if (error) {
        console.error('Error uploading file:', error);
        return;
      }
      // Handle the uploaded photo URL (e.g., set it to state or display it)
    }, 'image/webp');
    setCropActive(false);
  };

  return (
    <>
      <div className={styles.croppablePhotoWrapper}>
        {/* <p>Crop Photo</p> */}
        <ReactCrop
        // src={photo}
          crop={crop}
          circularCrop={true}
          // ruleOfThirds
          onImageLoaded={onImageLoaded}
          onComplete={onCropComplete}
          onChange={onCropChange}
          aspect={ratio}
        >
          <img src={photo} ref={imageRef} alt="Crop preview" className={styles.croppableImage} crossOrigin="anonymous"/>
        </ReactCrop>
      </div>
      <button onClick={(e) => uploadCroppedPhoto(e)} className={styles.saveCropButton}>SAVE</button>
      <button onClick={() => setCropActive(false)}>Cancel</button>
    </>
  );
}