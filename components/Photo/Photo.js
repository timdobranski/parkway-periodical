'use client'

import { useState, useEffect } from 'react';
import styles from './photo.module.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableCells, faTv } from '@fortawesome/free-solid-svg-icons';

export default function Photo({ updatePhotoContent, src, isEditable, updatePhotoFormat, format }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [photoFormat, setPhotoFormat] = useState(format); // grid, single, carousel

  // if there are selected files, render previews
  useEffect(() => {
    let urls = [];
    let readersCompleted = 0;

    selectedFiles.forEach(fileObj => {
        if (fileObj && fileObj.file instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                urls.push({ src: reader.result, caption: fileObj.caption });
                readersCompleted++;
                if (readersCompleted === selectedFiles.length) {
                    updatePhotoContent(urls);
                }
            };
            reader.readAsDataURL(fileObj.file);
        }
    });
}, [selectedFiles]);


  useEffect(() => {
    if (src && src.length > 0) {
      const fileObjects = src.map(photo => ({
        file: null, // No file object available for existing photos
        caption: photo.caption || '',
        src: photo.src // Keep the existing URL
      }));
      setSelectedFiles(fileObjects);
    } else {
      setSelectedFiles([]); // Reset if src is empty
    }
  }, [src]);

  const handleFileChange = (event) => {
    // Create objects for each file with an empty caption
    const fileObjects = Array.from(event.target.files).map(file => ({ file, caption: '' }));
    setSelectedFiles(fileObjects);
  };

  const handleCaptionChange = (index, newCaption) => {
    setSelectedFiles(files =>
      files.map((fileObj, idx) => idx === index ? { ...fileObj, caption: newCaption } : fileObj)
    );
  };

  const renderPreviews = () => {
    return selectedFiles.map((fileObj, index) => {
      const imageUrl = fileObj.file ? URL.createObjectURL(fileObj.file) : fileObj.src;
      return (
        <div key={index} className={styles.photoPreviewContainer}>
          {formatSelectionInterface()}
          <img src={imageUrl} alt={`Preview ${index}`} className={styles.photoPreview} />
          <input
            type="text"
            value={fileObj.caption}
            onChange={(e) => handleCaptionChange(index, e.target.value)}
            placeholder="Enter caption"
            className={styles.captionInput}
          />
        </div>
      );
    });
  };
  const renderPhotosGrid = (photos) => {
    return (
      <div className={styles.photosGrid}>
        {photos.map((photo, index) => (
          <div key={index} className={styles.gridPhotoContainer}>
            <img src={photo.src} alt={`Photo ${index}`} className={styles.gridPhoto} />
            {photo.caption && <p className={styles.photoCaption}>{photo.caption}</p>}
          </div>
        ))}
      </div>
    );
  };
  const renderPhotosCarousel = (photos) => {
    return (
      <div className={styles.carouselWrapper}>
      <Carousel dynamicHeight={true} autoPlay={false} showThumbs={true}>
        {photos.map((photoObj, index) => (
          <div key={index} className={styles.carouselSlide}>
            <img src={photoObj.src} alt={`Photo ${index}`} />
            {photoObj.caption && (
              <p className={styles.carouselCaption}>{photoObj.caption}</p>
            )}
          </div>
        ))}
      </Carousel>
      </div>
    );
  };

  const formatSelectionInterface = () => {
    return (
      <div className={styles.formatSelection}>
        <FontAwesomeIcon
          icon={faTableCells}
          className={`${styles.icon} ${photoFormat === 'grid' ? styles.selectedIcon : ''}`}
          onClick={() => {
            setPhotoFormat('grid');
            updatePhotoFormat('grid');
          }}
        />
        <FontAwesomeIcon
          icon={faTv}
          className={`${styles.icon} ${photoFormat === 'carousel' ? styles.selectedIcon : ''}`}
          onClick={() => {
            setPhotoFormat('carousel');
            updatePhotoFormat('carousel');
          }}
        />
      </div>
    );
  };


  if (isEditable) {
    return (
      <div className={styles.previewWrapper}>
        <input type="file" accept="image/*" onChange={handleFileChange} multiple className={styles.photoInput}/>
        {selectedFiles.length > 1 && formatSelectionInterface()}
        <div className={styles.photoWrapper}>{renderPreviews()}</div>
      </div>
    );
  } else {
    if (!src || src.length === 0) {
      return <p className={styles.noPhotoMessage}>No photo provided</p>;
    }

    switch (photoFormat) {
      case 'grid':
        return renderPhotosGrid(src);
      case 'carousel':
        return renderPhotosCarousel(src);
      default:
        return <p>Invalid photo format</p>;
    }
  }
}
