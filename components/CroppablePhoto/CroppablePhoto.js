'use client'

import styles from './CroppablePhoto.module.css'
import { useState, useEffect } from 'react'
import Cropper from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import supabase from '../../utils/supabase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrop, faPencil } from '@fortawesome/free-solid-svg-icons'

export default function CroppablePhoto ({ photo, ratio, filepath }) {
  const [crop, setCrop] = useState({ aspect: ratio })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [imageRef, setImageRef] = useState(null)
  const [cropActive, setCropActive] = useState(false);

  const onImageLoaded = (image) => {
    setImageRef(image)
  }

  const onCropComplete = (crop) => {
    setCompletedCrop(crop)
  }

  const onCropChange = (crop, percentCrop) => {
    setCrop(crop)
  }

  const uploadCroppedPhoto = async () => {
    if (!completedCrop || !imageRef) {
      return
    }

    const canvas = document.createElement('canvas')
    const scaleX = imageRef.naturalWidth / imageRef.width
    const scaleY = imageRef.naturalHeight / imageRef.height
    canvas.width = completedCrop.width
    canvas.height = completedCrop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      imageRef,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    )

    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'cropped.webp', { type: 'image/webp' })

      const { data, error } = await supabase.storage
        .from('users') // Ensure this is your actual bucket name
        .upload(`${filepath}/cropped`, file, { upsert: true })

      if (error) {
        console.error('Error uploading file:', error)
        return
      }

      const { publicURL, error: urlError } = supabase.storage
        .from('users')
        .getPublicUrl(`${filepath}/cropped`)

      if (urlError) {
        console.error('Error getting public URL:', urlError)
        return
      }
      setCropActive(false);
      // Handle the uploaded photo URL (e.g., set it to state or display it)
      console.log('Uploaded photo URL:', publicURL)
    }, 'image/webp')
  }

  if (!cropActive) {
    return (
      <div className={styles.previewWrapper}>
        <div className={styles.previewImageWrapper}>
          <img src={photo} className={styles.photoPreview} key='userPhoto' />
        </div>
        <FontAwesomeIcon icon={faPencil} className={styles.cropIcon} onClick={() => setCropActive(true)}/>
      </div>
    )
  }

  return (
    <div className={styles.croppablePhotoWrapper}>
      <Cropper
        src={photo}
        crop={crop}
        ruleOfThirds
        onImageLoaded={onImageLoaded}
        onComplete={onCropComplete}
        onChange={onCropChange}
      />
      <button onClick={uploadCroppedPhoto}>Upload Cropped Photo</button>
      <button onClick={() => setCropActive(false)}>Cancel</button>

    </div>
  )
}
