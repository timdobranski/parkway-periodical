'use client'

import styles from './CroppablePhoto.module.css'
import { useState, useEffect, useRef } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { createClient } from '../../utils/supabase/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrop, faPencil } from '@fortawesome/free-solid-svg-icons'
import userPhotos from '../../utils/userPhotos';

// uploadOrSet prop determines whether to upload photo immediately after crop, or just set it in the parent component's state using setCroppedPhoto
export default function CroppablePhoto({ photo, ratio = 1, bucket, filePath, setCropActive, afterUpload, uploadOrSet, setCroppedPhoto }) {
  const supabase = createClient();
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

  useEffect(() => {
    const width = 100; // Set your desired default width here
    const height = width / ratio;

    setCrop({
      unit: 'px',
      width: width,
      height: height,
      x: 0,
      y: 0,
      aspect: ratio
    });
  }, [ratio, photo]);

  useEffect(() => {
    console.log('crop changed: ', crop);
  }, [crop, photo])


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

    // Adjust the canvas size to match the original image's dimensions for the cropped area
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');

    // Use the original image's dimensions for the crop area calculations
    ctx.drawImage(
      imageRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp'));
    const file = new File([blob], 'cropped.webp', { type: 'image/webp' });
    const url = `${filePath}/cropped?t=${Date.now()}`

    if (uploadOrSet === 'set') {
      // Use setCroppedPhoto to assign the URL to the cropped image
      setCroppedPhoto(file);

    } else {
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(`${url}`, file, { upsert: true });

        if (error) {
          console.error('Error uploading file:', error);
          return;
        }
        // const { success, error, value } = await userPhotos.setProfilePhoto(email, 'cropped', file)

        // console.log('Uploaded file path:', `${filePath}/cropped`);
        await afterUpload();
      } catch (error) {
        console.error('Error during upload or fetching cropped photo:', error);
      }
    }
  };


  return (
    <>
      <div className={styles.croppablePhotoWrapper}>
        <button onClick={(e) => uploadCroppedPhoto(e)} className={styles.saveCropButton}>Set Crop</button>

        <ReactCrop
        // src={photo}
          crop={crop}
          circularCrop={ratio === 1 ? true : false}
          // ruleOfThirds
          onImageLoaded={onImageLoaded}
          onComplete={onCropComplete}
          onChange={onCropChange}
          aspect={ratio}
        >
          <img src={photo} ref={imageRef} alt="Crop preview" className={styles.croppableImage} crossOrigin="anonymous"/>
        </ReactCrop>
      </div>
      {/* <button onClick={() => setCropActive(false)}>Cancel</button> */}
    </>
  );
}