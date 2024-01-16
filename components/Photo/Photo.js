'use client'

import { useState, useEffect } from 'react';
import styles from './photo.module.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableCells, faTv } from '@fortawesome/free-solid-svg-icons';

export default function Photo({ updatePhotoContent, src, isEditable, updatePhotoFormat, format, setActiveBlock }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [photoFormat, setPhotoFormat] = useState(format); // grid, single, carousel
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
  // if there are selected files, render previews
  useEffect(() => {
    console.log('photo isEditable changed: ', isEditable);
    if (!isEditable && selectedFiles.length > 0) {
      let urls = [];
      let readersToComplete = selectedFiles.reduce((count, fileObj) =>
          count + (fileObj.file instanceof File ? 1 : 0), 0);

      if (readersToComplete === 0) {
          updatePhotoContent(selectedFiles.map(({ src, caption }) => ({ src, caption })));
          return;
      }

      selectedFiles.forEach(fileObj => {
          if (fileObj.file instanceof File) {
              const reader = new FileReader();
              reader.onloadend = () => {
                  urls.push({ src: reader.result, caption: fileObj.caption });
                  if (--readersToComplete === 0) {
                      updatePhotoContent(urls);
                  }
              };
              reader.readAsDataURL(fileObj.file);
          } else {
              urls.push({ src: fileObj.src, caption: fileObj.caption });
          }
      });
    }
  }, [isEditable]);




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
      files.map((fileObj, idx) => { return idx === index ? { ...fileObj, caption: newCaption } : fileObj})
    );
  };

  const renderPreviews = () => {
    console.log('selectedFiles in renderPreviews: ', selectedFiles)
    return selectedFiles.map((fileObj, index) => {
      const imageUrl = fileObj.file ? URL.createObjectURL(fileObj.file) : fileObj.src;
      return (
        <div key={index} className={styles.photoPreviewContainer}>
          {/* {selectedFiles.length > 1 ? formatSelectionInterface() : null} */}
          <img src={imageUrl} alt={`Preview ${index}`} className={styles.photoPreview} />
          <input
            type="text"
            value={fileObj.caption}
            onChange={(e) => handleCaptionChange(index, e.target.value)}
            placeholder="Enter caption"
            className={styles.captionInput}
            onKeyDown={(e) => {if (e.key === 'Enter') {setActiveBlock(null)} }}
          />
        </div>
      );
    });
  };
  const renderPhotosGrid = (photos) => {
    console.log('photos passed to renderphotosGrid: ', photos)
    return (
      <div className={styles.photosGrid}>
        {photos.map((photo, index) => (
          console.log('photo caption: ', photo.caption),
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
