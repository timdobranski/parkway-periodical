'use client'

import styles from './CroppablePhoto.module.css'
import { useState, useEffect, useRef } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import supabase from '../../utils/supabase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrop, faPencil } from '@fortawesome/free-solid-svg-icons'

// Props:
// photo - a string url of the photo
// ratio - a number for the aspect ratio
// bucket - the name of the supabase storage bucket
// filepath - the path to the folder of the file
// setCropActive - a function that that can be passed a boolean to unmount the component when the crop is complete
// getCroppedPhoto -

export default function CroppablePhoto({ photo, ratio = 1, bucket, filePath, setCropActive, getCroppedPhoto }) {
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
    console.log('INSIDE UPLOAD CROPPED PHOTO FUNCTION...');
    e.preventDefault();
    if (!completedCrop || !imageRef.current) {
      if (!completedCrop) {
        console.log('No completed crop; returning...');
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

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp'));
    const file = new File([blob], 'cropped.webp', { type: 'image/webp' });

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(`${filePath}/cropped`, file, { upsert: true });

      if (error) {
        console.error('Error uploading file:', error);
        return;
      }

      console.log('Uploaded file path:', `${filePath}/cropped`);
      setCropActive(false);

      // Ensure that getCroppedPhoto is awaited
      if (getCroppedPhoto) {
        await getCroppedPhoto();
      }
    } catch (error) {
      console.error('Error during upload or fetching cropped photo:', error);
    }
  };

  return (
    <>
      <div className={styles.croppablePhotoWrapper}>
        <p>Crop Photo</p>
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