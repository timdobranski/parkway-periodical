'use client'

import { useState, useEffect } from 'react';
import styles from './photoBlock.module.css';
import PhotoCarousel from '../PhotoCarousel/PhotoCarousel'
import PhotoGrid from '../PhotoGrid/PhotoGrid';
// import EditablePhoto from '../EditablePhoto/EditablePhoto';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faX, faCropSimple, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
// import Image from 'next/image';

// src is photo block parent state; selectedPhotos is photo block child state before saving
export default function PhotoBlock({ updatePhotoContent, src, isEditable, setActiveBlock, blockIndex }) {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [draggedPhotoIndex, setDraggedPhotoIndex] = useState(null);

  // when the editable status changes, if there are photos uploaded, save them
  useEffect(() => {    if (!isEditable && selectedPhotos.length > 0) {
    let urls = [];
    let readersToComplete = selectedPhotos.reduce((count, fileObj) =>
      count + (fileObj.file instanceof File ? 1 : 0), 0);

    if (readersToComplete === 0) {
      updatePhotoContent(selectedPhotos.map(({ src, caption, title, style }) => ({ src, caption, title, style })));
      return;
    }
    selectedPhotos.forEach(fileObj => {
      if (fileObj.file instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          urls.push({ src: reader.result, caption: fileObj.caption, title: fileObj.title, style: fileObj.style });
          if (--readersToComplete === 0) {
            // console.log('urls to be set as content in photo block: ', urls)
            updatePhotoContent(urls);
          }
        };
        reader.readAsDataURL(fileObj.file);
      } else {
        urls.push({ src: fileObj.src, caption: fileObj.caption, title: fileObj.title, style: fileObj.style });
      }
    });
  }
  }, [isEditable]);

  // if there are existing photos, add them to selectedPhotos
  useEffect(() => {
    console.log('photos passed to PhotoBlock(src): ', src)
    if (src && src.content && src.content.length > 0) {
      const fileObjects = src.content.map(photo => ({
        file: null, // No file object available for existing photos
        caption: photo.caption || '',
        src: photo.src, // Keep the existing URL
        title: photo.title,
        style: photo.style
      }));
      setSelectedPhotos(fileObjects);
    } else {
      setSelectedPhotos([]);
    }
  }, [src]);

  useEffect(() => {
    console.log('selectedPhotos state changed: ', selectedPhotos);
  }, [selectedPhotos])

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    let readersToComplete = files.length;

    const newFileObjects = files.map(file => ({
      file,
      src: '', // Temporarily set src to an empty string
      caption: '',
      title: '',
    }));

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newFileObjects[index].src = reader.result; // Set the src to the data:image URL
        if (--readersToComplete === 0) {
          // Once all files are processed, update the state
          setSelectedPhotos(existingFiles => [...existingFiles, ...newFileObjects]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  const onDragStart = (e, index) => {
    e.stopPropagation();
    setDraggedPhotoIndex(index);
  };
  const onDragOver = (e) => {
    e.preventDefault(); // Necessary for onDrop to fire
  };
  const onDrop = (e, dropIndex) => {
    if (draggedPhotoIndex !== null) {
      const newPhotos = [...selectedPhotos];
      // Swap the photos
      [newPhotos[draggedPhotoIndex], newPhotos[dropIndex]] = [newPhotos[dropIndex], newPhotos[draggedPhotoIndex]];
      setSelectedPhotos(newPhotos);
      setDraggedPhotoIndex(null);
    }
  };
  const handleRemovePhoto = (index) => {
    setSelectedPhotos(files => files.filter((_, idx) => idx !== index));
    document.querySelector('input[type="file"]').value = '';

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
    if (!src || src.length === 0) {
      return <p className={styles.noPhotoMessage}>No photo provided</p>;
    }

    // Determine what to render based on src.format
    let content;
    switch (src.format) {
      case 'single-photo-caption-below':
      case 'single-photo-caption-above':
      case 'single-photo-caption-left':
      case 'single-photo-caption-right':
        // content = (
        //   <div className={isEditable ? styles.editablePhotoBlockWrapper : styles.photoBlockWrapper}>
        //     {isEditable &&
        //       <input
        //         type="file"
        //         accept="image/*"
        //         onChange={handleFileChange}
        //         {...(!src.format.includes('single') && { multiple: true })}
        //         className={styles.photoInput}
        //       />
        //     }
        //     <SinglePhoto
        //       format={src.format}
        //       captionPosition = {src.format.split('-').pop()}
        //       photos={selectedPhotos}
        //       setActiveBlock={setActiveBlock}
        //       blockIndex={blockIndex}
        //       onClick={() => setActiveBlock(blockIndex)}
        //       updatePhotoContent={updatePhotoContent}
        //       handleTitleChange={handleTitleChange}
        //       handleCaptionChange={handleCaptionChange}
        //       handleRemovePhoto={handleRemovePhoto}
        //       selectedPhotos={selectedPhotos}
        //       setSelectedPhotos={setSelectedPhotos}
        //     />
        //   </div>
        // );
        // break;
      case '3xColumn':
      case '2xColumn':
      case 'grid':
        content = (
          <div className={isEditable ? styles.editablePhotoBlockWrapper : styles.photoBlockWrapper}>
            {isEditable &&
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                {...(!src.format.includes('single') && { multiple: true })}
                className={styles.photoInput}
              />
            }
            <PhotoGrid
              format={src.format}
              isEditable={isEditable}
              photos={selectedPhotos}
              setActiveBlock={setActiveBlock}
              blockIndex={blockIndex}
              onClick={() => setActiveBlock(blockIndex)}
              updatePhotoContent={updatePhotoContent}
              handleTitleChange={handleTitleChange}
              handleCaptionChange={handleCaptionChange}
              handleRemovePhoto={handleRemovePhoto}
              selectedPhotos={selectedPhotos}
              setSelectedPhotos={setSelectedPhotos}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          </div>
        );
        break;
      case 'carousel':
        content = (
          <div className={isEditable ? styles.editablePhotoBlockWrapper : styles.photoBlockWrapper}>

            {isEditable ?
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  {...(!src.format.includes('single') && { multiple: true })}
                  className={styles.photoInput}
                />
                <PhotoGrid
                  format={'2xColumn'}
                  isEditable={isEditable}
                  photos={selectedPhotos}
                  setActiveBlock={setActiveBlock}
                  blockIndex={blockIndex}
                  onClick={() => setActiveBlock(blockIndex)}
                  updatePhotoContent={updatePhotoContent}
                  handleTitleChange={handleTitleChange}
                  handleCaptionChange={handleCaptionChange}
                  handleRemovePhoto={handleRemovePhoto}
                  selectedPhotos={selectedPhotos}
                  setSelectedPhotos={setSelectedPhotos}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                />
              </> :
              <PhotoCarousel photos={selectedPhotos} />
            }

          </div>
        )
        break;
      default:
        content = <p>Invalid photo format: {src.format}</p>;
    }

    return content;
  };

  return renderPreview();

}