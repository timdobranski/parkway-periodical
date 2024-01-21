'use client'

import { useState, useEffect } from 'react';
import styles from './photoBlock.module.css';
import PhotoCarousel from '../PhotoCarousel/PhotoCarousel'
import PhotoGrid from '../PhotoGrid/PhotoGrid';
import EditablePhoto from '../EditablePhoto/EditablePhoto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faCropSimple, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function PhotoBlock({ updatePhotoContent, src, isEditable, setActiveBlock, blockIndex }) {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  // when the editable status changes, if there are photos uploaded, save them
  useEffect(() => {
    if (!isEditable && selectedPhotos.length > 0) {
      let urls = [];
      let readersToComplete = selectedPhotos.reduce((count, fileObj) =>
          count + (fileObj.file instanceof File ? 1 : 0), 0);

      if (readersToComplete === 0) {
          updatePhotoContent(selectedPhotos.map(({ src, caption, title }) => ({ src, caption, title })));
          return;
      }
      selectedPhotos.forEach(fileObj => {
          if (fileObj.file instanceof File) {
              const reader = new FileReader();
              reader.onloadend = () => {
                  urls.push({ src: reader.result, caption: fileObj.caption, title: fileObj.title });
                  if (--readersToComplete === 0) {
                    console.log('urls to be set as content in photo block: ', urls)
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
    console.log('photos passed to PhotoBlock(src): ', src)
    if (src && src.content && src.content.length > 0) {
      const fileObjects = src.content.map(photo => ({
        file: null, // No file object available for existing photos
        caption: photo.caption || '',
        src: photo.src, // Keep the existing URL
        title: photo.title
      }));
      setSelectedPhotos(fileObjects);
    } else {
      setSelectedPhotos([]);
    }
  }, [src]);

  useEffect(() => {
    console.log('uploaded photos: ', selectedPhotos);
  }, [selectedPhotos])

  const handleFileChange = (event) => {
    const newFileObjects = Array.from(event.target.files).map(file => ({
      file,
      caption: '',
      title: ''
    }));
    setSelectedPhotos(existingFiles => [...existingFiles, ...newFileObjects]);
  };
  const handleRemovePhoto = (index) => {
    setSelectedPhotos(files => files.filter((_, idx) => idx !== index));
    document.querySelector('input[type="file"]').value = '';

  };
  const handleTitleChange = (index, newTitle) => {
    setSelectedPhotos(files =>
      files.map((fileObj, idx) => idx === index ? { ...fileObj, title: newTitle } : fileObj)
    );
  };
  const handleCaptionChange = (index, newCaption) => {
    setSelectedPhotos(files =>
      files.map((fileObj, idx) => { return idx === index ? { ...fileObj, caption: newCaption } : fileObj})
    );
  };
  const renderEditableView = () => {
    let gridClass = '';
    if (selectedPhotos.length === 1) {
      gridClass = styles.photosGridSingle;
    } else if (selectedPhotos.length % 3 === 0 || (selectedPhotos.length % 2 !== 0 && selectedPhotos.length % 3 !== 0)) {
      gridClass = styles.photosGridThreeColumns;
    } else if (selectedPhotos.length % 2 === 0) {
      gridClass = styles.photosGridTwoColumns;
    }

    return (
      <div className={styles.previewWrapper}>
        <input type="file" accept="image/*" onChange={handleFileChange} multiple className={styles.photoInput}/>

        <div className={`${styles.photosGrid} ${gridClass}`}>
          {selectedPhotos.map((fileObj, index) => (
            <EditablePhoto
            key={index}
            fileObj={fileObj}
            updatePhotoContent={updatePhotoContent}
            handleTitleChange={handleTitleChange}
            handleCaptionChange={handleCaptionChange}
            handleRemovePhoto={handleRemovePhoto}
            index={index}
            />
            ))}
        </div>
      </div>
    );
  };
  const renderPreview = () => {
    console.log('inside renderPreview, src: ', src);
    // This function handles rendering content when isEditable is false
    if (!src || src.length === 0) {
      return <p className={styles.noPhotoMessage}>No photo provided</p>;
    }

    switch (src.format) {
      case 'single-photo-caption-below':
      case 'single-photo-caption-above':
      case 'single-photo-caption-left':
      case 'single-photo-caption-right':
      case '3xColumn':
      case '2xColumn':
      case 'grid':
        return <PhotoGrid photos={src} />;
      case 'carousel':
        return <PhotoCarousel photos={src} />;
      default:
        return <p>Invalid photo format: {src.format}</p>;
    }
  };

  return isEditable ? renderEditableView() : src.content && src.content.length > 0 ? renderPreview() : 'loading';

}