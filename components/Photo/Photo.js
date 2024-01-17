'use client'

import { useState, useEffect } from 'react';
import styles from './photo.module.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableCells, faTv, faX } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function Photo({ updatePhotoContent, src, isEditable, updatePhotoFormat, format, setActiveBlock }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [photoFormat, setPhotoFormat] = useState(format); // grid, single, carousel
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const handleCarouselChange = (index) => {
    setCurrentPhotoIndex(index);
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
  // if there are selected files, render previews
  useEffect(() => {
    if (!isEditable && selectedFiles.length > 0) {
      let urls = [];
      let readersToComplete = selectedFiles.reduce((count, fileObj) =>
          count + (fileObj.file instanceof File ? 1 : 0), 0);

      if (readersToComplete === 0) {
          updatePhotoContent(selectedFiles.map(({ src, caption, title }) => ({ src, caption, title })));
          return;
      }

      selectedFiles.forEach(fileObj => {
          if (fileObj.file instanceof File) {
              const reader = new FileReader();
              reader.onloadend = () => {
                  urls.push({ src: reader.result, caption: fileObj.caption, title: fileObj.title });
                  if (--readersToComplete === 0) {
                      updatePhotoContent(urls);
                  }
              };
              reader.readAsDataURL(fileObj.file);
          } else {
              urls.push({ src: fileObj.src, caption: fileObj.caption, title: fileObj.title });
          }
      });
    }
  }, [isEditable]);

  // if there are existing photos, render them
  useEffect(() => {
    console.log('src in useEffect: ', src)
    if (src && src.length > 0) {
      const fileObjects = src.map(photo => ({
        file: null, // No file object available for existing photos
        caption: photo.caption || '',
        src: photo.src, // Keep the existing URL
        title: photo.title
      }));
      setSelectedFiles(fileObjects);
    } else {
      setSelectedFiles([]); // Reset if src is empty
    }
  }, [src]);

  const handleFileChange = (event) => {
    const newFileObjects = Array.from(event.target.files).map(file => ({
      file,
      caption: '',
      title: '', // Add title property
    }));
    setSelectedFiles(existingFiles => [...existingFiles, ...newFileObjects]);
  };
  const handleRemovePhoto = (index) => {
    setSelectedFiles(files => files.filter((_, idx) => idx !== index));
  };
  const handleTitleChange = (index, newTitle) => {
    setSelectedFiles(files =>
      files.map((fileObj, idx) => idx === index ? { ...fileObj, title: newTitle } : fileObj)
    );
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
        <>
        <div key={index} className={styles.photoPreviewContainer}>
          <div className={styles.photoWrapper}>
            <FontAwesomeIcon icon={faX} className={styles.removePhotoIcon} onClick={() => handleRemovePhoto(index)} />
            <img src={imageUrl} className={styles.photoPreview} alt={`Preview ${index}`} />
          </div>
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
            rows={4}  // Example: Set the number of rows to make it visibly larger
          />
        </div>
        </>
      );
    });
  };
  const renderPhotosGrid = (photos) => {
    // console.log('photos passed to renderphotosGrid: ', photos)
    return (
      <div className={styles.photosGrid}>
        {photos.map((photo, index) => (
          console.log('photo caption: ', photo.caption),
          <div key={index} className={styles.gridPhotoContainer}>
            <img src={photo.src} alt={`Photo ${index}`} className={styles.gridPhoto} />
            {photo.title && <p className={styles.photoTitle}>{photo.title}</p>}
            {photo.caption && <p className={styles.photoCaption}>{photo.caption}</p>}
          </div>
        ))}
      </div>
    );
  };
  const renderPhotosCarousel = (photos) => {
    return (
      <div className={styles.carouselWrapper}>
      <Carousel
        dynamicHeight={true}
        autoPlay={false}
        showThumbs={true}
        selectedItem={currentPhotoIndex}
        onChange={handleCarouselChange}
      >
        {photos.map((photoObj, index) => (
          <div key={index} className={styles.carouselSlide}>
            <img src={photoObj.src} alt={`Photo ${index}`} />
            {photoObj.title && (
              <p className={styles.carouselCaption}>{photoObj.title}</p>
            )}
          </div>
        ))}
      </Carousel>
      {photos[currentPhotoIndex] && photos[currentPhotoIndex].caption && (
        <p className={styles.currentPhotoCaption}>
          {photos[currentPhotoIndex].caption}
        </p>
      )}
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
