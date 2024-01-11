'use client'

import { useState, useEffect } from 'react';
import styles from './photo.module.css';

export default function Photo({ updatePhotoContent, src, isEditable }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [photoFormat, setPhotoFormat] = useState('grid') // grid, single, carousel

  useEffect(() => {
    if (selectedFiles.length > 0) {
      let urls = [];
      let readersCompleted = 0;

      selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          urls.push(reader.result); // Add URL to the urls array
          readersCompleted++;

          // When all readers are complete, update the content
          if (readersCompleted === selectedFiles.length) {
            updatePhotoContent(urls);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }, [selectedFiles, updatePhotoContent]);

  useEffect(() => {
    if (isEditable && selectedFiles.length > 0) {
      // Call updatePhotoContent with the selected files when they change
      updatePhotoContent(selectedFiles);
    }
  }, [selectedFiles, isEditable]);

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };
  // render previews immediately after upload
  const renderPreviews = () => {
    return selectedFiles.map((file, index) => (
      <img
        key={index}
        src={URL.createObjectURL(file)}
        alt={`Preview ${index}`}
        className={styles.photoPreview}
      />
    ));
  };
  // render a preview of a grid style display
  const renderPhotosGrid = (photos) => {
    console.log('photos: ', photos)
    return (
      <div className={styles.photosGrid}>
        {photos.map((photoSrc, index) => (
          <img key={index} src={photoSrc} alt={`Photo ${index}`} className={styles.gridPhoto} />
        ))}
      </div>
    );
  };


  if (isEditable) {
    return (
      <>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          multiple
        />
        <div className={styles.photoWrapper}>{renderPreviews()}</div>
      </>
    );
  } else {
    if (!src || src.length === 0) {
      return <p>No photo provided</p>;
    }

    switch (photoFormat) {
      case 'grid':
        return renderPhotosGrid(src);
      case 'single':
        return renderPhotosSingle(src);
      case 'carousel':
        return renderPhotosCarousel(src);
      default:
        return <p>Invalid photo format</p>;
    }
  }
}