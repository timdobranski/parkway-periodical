'use client'

import { useState, useEffect } from 'react';
import styles from './photoBlock.module.css';
import PhotoCarousel from '../PhotoCarousel/PhotoCarousel'
import EditablePhoto from '../EditablePhoto/EditablePhoto';
import supabase from '../../utils/supabase';
import PhotoGrid from '../PhotoGrid/PhotoGrid';
import { Rnd } from 'react-rnd';

// src is photo block parent state; selectedPhotos is photo block child state before saving
export default function PhotoBlock({ updatePhotoContent, src, isEditable, setActiveBlock, blockIndex }) {

  useEffect(() => {
    console.log('src in PhotoBlock: ', src)
  }, [src])

  const addPhoto = async (event) => {
    const file = event.target.files[0];
    const fileInput = event.target;
    if (!file) return;

    try {
      // Upload the image to your Supabase bucket
      // Replace 'your-bucket-name' with the name of your bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;  // Generating a random file name
      const { data, error } = await supabase
        .storage
        .from('posts/photos')
        .upload(fileName, file);

      if (error) throw error;

      // Get the URL of the uploaded file
      const { data: publicURL, error: urlError } = supabase
        .storage
        .from('posts/photos')
        .getPublicUrl(fileName);

      if (urlError) throw urlError;
      console.log('publicUrl: ', publicURL);
      updatePhotoContent({src: publicURL.publicUrl, caption: '', title: '', fileName: fileName});
    } catch (error) {
      console.error('Error uploading image: ', error.message);
    }
    fileInput.value = null;
  };

  const deletePhoto = async (filename) => {
    // console.log('filename being deleted: ', filename)
    const { data, error } = await supabase
      .storage
      .from('posts')
      .remove([`photos/${filename}`])

    if (error) { throw error; } else { updatePhotoContent({src: '', caption: '', title: ''}); }
  };
  const handleTitleChange = (index, newTitle) => {
    console.log('new title: ', newTitle);
    setSelectedPhotos(files =>
      files.map((fileObj, idx) => idx === index ? { ...fileObj, title: newTitle } : fileObj)
    );
  };
  const handleCaptionChange = (index, newCaption) => {
    setSelectedPhotos(files =>
      files.map((fileObj, idx) => { return idx === index ? { ...fileObj, caption: newCaption } : fileObj})
    );
  };
  const renderPreview = () => {

    if (!src.content || src.length === 0) {
      return <p className={styles.noPhotoMessage}>No photo provided</p>;
    }

    // Determine what to render based on src.format
    let content;
    switch (src.format) {
      case 'single-photo-no-caption':
      case 'single-photo-caption-below':
      case 'single-photo-caption-above':
      case 'single-photo-caption-left':
      case 'single-photo-caption-right':
      case '3xColumn':
      case '2xColumn':
      case 'grid':
        content = (
          <EditablePhoto
            photo={src.content}
            isEditable={isEditable}
            updatePhotoContent={addPhoto}
            deletePhoto={deletePhoto}
            containerClassName={styles.photoContainer}
            handleTitleChange={(title) => handleTitleChange(index, title)}
            handleCaptionChange={(caption) => handleCaptionChange(index, caption)}
          />
        );
        break;
      case 'carousel':
        content = (
          <PhotoCarousel
            photos={selectedPhotos}
            isEditable={isEditable}
            handleTitleChange={handleTitleChange}
            handleCaptionChange={handleCaptionChange}
          />
        )
        break;
      default:
        content = <p>Switch default error</p>;
    }
    return content
  };


  return (
    <div className={styles.photoBlockWrapper}>
      {isEditable &&
        <input
          type="file"
          accept="image/*"
          onChange={addPhoto}
          className={styles.photoInput}
        />}

      {renderPreview()}
    </div>
  )
}