'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCropSimple, faUpRightAndDownLeftFromCenter,faFont, faAlignJustify, faAlignLeft, faAlignCenter, faAlignRight, faUpDown, faGripLines, faChevronUp, faChevronDown, faImage } from '@fortawesome/free-solid-svg-icons';
import styles from './editablePhoto.module.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Rnd } from 'react-rnd';
import PrimeText from '../PrimeText/PrimeText';
import { createClient } from '../../utils/supabase/client';

export default function EditablePhoto({
  photo, isEditable, deletePhoto, index,
  photoIndex, photoContext, setPhotoStyle, isLayout, toggleTitleOrCaption, carousel, setContentBlocks }) {
  const supabase = createClient()
  const imageRef = useRef(null);
  const wrapperRef = useRef(null); // Ref for the photo wrapper to enable dynamic height resizing when photo is resized

  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100, aspect: 16 / 9, unit: '%'});
  const [completedCrop, setCompletedCrop] = useState(null);
  const [cropActive, setCropActive] = useState(false);

  // const [menuExpanded, setMenuExpanded] = useState(false);
  const [imageVersion, setImageVersion] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Loading Image...')

  const [resizeActive, setResizeActive] = useState(false);
  const [size, setSize] = useState({ width: '100%', height: '100%' }); // sets the size of the rnd element (red border)


  // handle image loaded
  const onImageLoaded = useCallback(() => {
    if (imageRef.current) {
      const { width, height } = imageRef.current.getBoundingClientRect();
      // console.log('width and height in ONLOAD function:', width, height);
      setSize({ width, height });
    }
  }, []);


  useEffect(() => {
    console.log('PHOTO: ', photo);
  }, [photo]);

  // useEffect(() => {
  //   if (imageRef.current && imageRef.current.complete) {
  //     onImageLoaded();
  //   }
  // }, [photo.src, imageVersion, onImageLoaded]);



  // if not editable, disable crop and resize
  useEffect(() => {
    if (!isEditable) {setCropActive(false); setResizeActive(false)}
  }, [isEditable])

  // Update the wrapper's height on resize
  useEffect(() => {
    if (resizeActive && imageRef.current && wrapperRef.current) {
      const imageHeight = imageRef.current.offsetHeight;
      console.log('Image height:', imageHeight); // Debugging line
      wrapperRef.current.style.height = `${imageHeight}px`;
    } else if (wrapperRef.current) {
      wrapperRef.current.style.height = 'auto';
    }
  }, [resizeActive, size]);

  const onResizeStop = (e, direction, ref, delta, position) => {
    const newSize = {
      width: ref.style.width,
      // height: 'auto'
    };
    setSize(newSize);
    setPhotoStyle(newSize); // working

    // Optionally: save newSize to a database or state
  };
  // update the wrapper's height on resize
  const onResize = (e, direction, ref, delta, position) => {
    const newSize = {
      width: ref.style.width,
      height: ref.style.height,
    };
    setSize(newSize);
    if (wrapperRef.current) {
      wrapperRef.current.style.height = newSize.height;
    }
  };



  // Update crop
  const onCropChange = (newCrop) => {
    setCrop(newCrop);
  };
  // when the photo is cropped, replace the old version in supabase
  const updatePhotoInSupabase = async (file, newFileName) => {
    try {
      // Delete the old file from Supabase storage
      const { error: deleteError } = await supabase
        .storage
        .from('posts')
        .remove([`photos/${photo.fileName}`]);

      if (deleteError) {
        console.error('Error deleting old photo:', deleteError.message);
        return;
      }

      // Upload the new file with the new filename
      const { error: uploadError } = await supabase
        .storage
        .from('posts')
        .upload(`photos/${newFileName}`, file, {
          cacheControl: '3600',
          upsert: false, // Ensure it doesn't overwrite existing files
        });

      if (uploadError) {
        console.error('Error uploading new photo:', uploadError.message);
        return;
      }

      // Get the public URL of the newly uploaded file
      const { data } = supabase.storage.from('posts').getPublicUrl(`photos/${newFileName}`);
      const newUrl = data.publicUrl;

      // Update contentBlocks with the new file name and URL
      setContentBlocks(prevBlocks => {
        const updatedBlocks = [...prevBlocks];

        if (updatedBlocks[index] && updatedBlocks[index].content) {
          if (typeof nestedIndex !== 'undefined') {
            if (updatedBlocks[index].content[nestedIndex] && updatedBlocks[index].content[nestedIndex].content) {
              updatedBlocks[index].content[nestedIndex].content[0].fileName = newFileName;
              updatedBlocks[index].content[nestedIndex].content[0].src = newUrl;
            }
          } else {
            if (updatedBlocks[index].content[0]) {
              updatedBlocks[index].content[0].fileName = newFileName;
              updatedBlocks[index].content[0].src = newUrl;
            }
          }
        }

        return updatedBlocks;
      });

    } catch (error) {
      console.error('Error during file update process:', error);
    }
  };

  // Finalize crop
  const finalizeCrop = () => {
    console.log('Finalizing crop...');
    if (imageRef.current && completedCrop) {
      console.log('Image and completedCrop exist:');
      const { width, height, x, y } = completedCrop;
      const canvas = document.createElement('canvas');
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
      canvas.width = width * scaleX;
      canvas.height = height * scaleY;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        imageRef.current,
        x * scaleX,
        y * scaleY,
        width * scaleX,
        height * scaleY,
        0,
        0,
        width * scaleX,
        height * scaleY
      );

      canvas.toBlob(async blob => {
        // Generate a new filename for the cropped image
        const newFileName = `photo_${Date.now()}.jpg`;
        console.log('Starting upload process...');

        // Await the completion of the photo update process
        await updatePhotoInSupabase(blob, newFileName);

        // After the updatePhotoInSupabase has completed successfully, disable crop mode
        console.log('Photo upload complete, disabling crop mode.');
        setCropActive(false);
      });
    }
  };

  const toggleCrop = () => setCropActive(!cropActive);
  const toggleResize = () => setResizeActive(!resizeActive);

  const cropControls = (
    <div className={styles.cropControlsWrapper}>
      <button onClick={() => setCropActive(false)}>Back</button>
      <button onClick={finalizeCrop}>Confirm Crop</button>
    </div>
  )

  const carouselStyles = {
    position: 'relative',
    top: '0'
  }

  const editMenu = (
    <div className={`${isLayout ? styles.layoutPhotoEditMenu : styles.photoEditMenu}`}style={(carousel && isEditable) ? carouselStyles : {}}>
      <div className={styles.photoEditMenuIconWrapper} onClick={toggleCrop}>
        <FontAwesomeIcon icon={faCropSimple} className={styles.cropIcon} />
        <p>Crop</p>
      </div>
      {!carousel && <div className={styles.photoEditMenuIconWrapper} onClick={toggleResize}>
        <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} className={styles.captionIcon} />
        <p>Resize</p>
      </div>}
      {!carousel && <div className={`${photo.title !== false ? styles.activeIconWrapper : styles.photoEditMenuIconWrapper}`} onClick={() => toggleTitleOrCaption('title')}>
        <FontAwesomeIcon icon={faFont} className={styles.captionIcon} />
        <p>Title</p>
      </div>}
      {!carousel && <div className={`${photo.caption !== false ? styles.activeIconWrapper : styles.photoEditMenuIconWrapper}`} onClick={() => toggleTitleOrCaption('caption')}>
        <FontAwesomeIcon icon={faFont} className={styles.captionIcon} />
        <p>Caption</p>
      </div>}
      <div className={styles.photoEditMenuIconWrapper} onClick={() => deletePhoto(photo.fileName)}>
        <FontAwesomeIcon icon={faTrash} className={styles.removePhotoIcon}  />
        <p>Remove</p>
      </div>
      {/* <div className={styles.photoEditMenuIconWrapper}>
        <FontAwesomeIcon icon={faAlignJustify}
          className={styles.captionIcon}
          onClick={() => menuExpanded !== 'horizontalAlignment' ? setMenuExpanded('horizontalAlignment') : setMenuExpanded(false)} />
        <div className={`${styles.expandedMenu} ${menuExpanded === 'horizontalAlignment' ? '' : 'hidden'}`}>
          <FontAwesomeIcon icon={faAlignLeft} className={styles.expandedIcon} />
          <FontAwesomeIcon icon={faAlignCenter} className={styles.expandedIcon} />
          <FontAwesomeIcon icon={faAlignRight} className={styles.expandedIcon} />
        </div>
      </div> */}
      {/* <div className={styles.photoEditMenuIconWrapper}>
        <FontAwesomeIcon icon={faUpDown}
          className={styles.captionIcon}
          onClick={() => menuExpanded !== 'verticalAlignment' ? setMenuExpanded('verticalAlignment') : setMenuExpanded(false)} />
        <div className={`${styles.expandedMenu} ${menuExpanded === 'verticalAlignment' ? '' : 'hidden'}`}>
          <FontAwesomeIcon icon={faChevronUp} className={styles.expandedIcon} />
          <FontAwesomeIcon icon={faGripLines} className={styles.expandedIcon} />
          <FontAwesomeIcon icon={faChevronDown} className={styles.expandedIcon} />
        </div>
      </div> */}
    </div>
  )
  const imageElement = (
    <img
      src={`${photo.src}`}
      className='gridPhoto'
      alt={`Preview ${index}`}
      ref={imageRef}
      crossOrigin="anonymous"
      onLoad={onImageLoaded}
      loading='lazy'
      onClick={() => {
        if (isEditable && !cropActive && !resizeActive && !carousel) {
          setResizeActive(true);
        }
      }}
      style={photo.style}
    />
  )

  // if no photo, return null
  if (!photo.src) {
    return null;
  }

  const renderCropView = () => (
    <>
      <ReactCrop
        crop={crop}
        onImageLoaded={onImageLoaded}
        onChange={onCropChange}
        onComplete={setCompletedCrop}
        overlayColor="rgba(0, 0, 0, 0.6)"
      >
        {imageElement}
      </ReactCrop>
      {cropControls}
    </>
  );

  const renderResizeView = () => (
    <>
      <div className={styles.resizeControls}>
        <button className={styles.stopResizeButton}onClick={() => setResizeActive(false)}>Set Size</button>
        {/* <button onClick={toggleResize}>Back</button> */}
      </div>
      <Rnd
        size={size}
        onResize={onResize}
        onResizeStop={onResizeStop}
        disableDragging
        lockAspectRatio
        minHeight="100px"
        minWidth="100px"
        maxWidth="100%"
        maxHeight='100vh'
        className={styles.rndElement}
        resizeHandleStyles={{
          bottomRight: {
            width: '30px',
            height: '30px',
            bottom: '2px',
            right: '2px',
            backgroundColor: 'white',
            border: 'solid red 2px',
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%)' /* Define the triangle shape */

          },
        }}
        resizeHandleClasses={{bottomRight: styles.bottomRightResizeHandle}}
        // bounds="parent"
      >
        {imageElement}
      </Rnd>
    </>
  );

  const renderDefaultView = () => (
    <>
      {isEditable && editMenu}
      {imageElement}
      {typeof photoIndex === 'number' && <h3 className={styles.photoNumber}>{photoIndex + 1}</h3>}
      {/* {photo.title && <PrimeText src={{content: photo.title}} isEditable={isEditable} setTextState={handleTitleChange}/>} */}
    </>
  );

  const getView = () => {
    if (cropActive) {
      return renderCropView();
    } else if (resizeActive) {
      return renderResizeView();
    } else {
      return renderDefaultView();
    }
  };

  return (
    <div className={styles.photoWrapper} ref={wrapperRef}>
      {getView()}
    </div>
  )
}