'use client'

import { useState, useEffect, useRef } from 'react';
import styles from './video.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan, faFloppyDisk, faUpDown, faVideo } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';


// update video style takes in an object with width, height, top, and left values set to numbers
export default function Video({ updateVideoUrl, updateBlockStyle, src, isEditable, setActiveBlock, blockIndex, removeBlock, toggleEditable }) {
  const [url, setUrl] = useState('');
  const [blockHeight, setBlockHeight] = useState(parseInt(src.style.height, 10) + src.style.y);
  const [blockContentHeight, setBlockContentHeight] = useState(parseInt(src.style.height, 10) );
  const [blockPosition, setBlockPosition] = useState({x: src.style.x, y: src.style.y});
  const [height, setHeight] = useState(parseInt(src.style.height, 10)); // for use with refactor not using rnd
  const wrapperRef = useRef(null);


  useEffect(() => {
    updateVideoUrl && updateVideoUrl(url);
    console.log('url changed: ', url)
  }, [url]);

  useEffect(() => {
    setBlockHeight(parseInt(blockContentHeight, 10) + blockPosition.y);
  }, [blockContentHeight, blockPosition]);

  useEffect(() => {
    console.log('src changed: ', src)
  }, [src]);

  const startResize = (e) => {
    e.stopPropagation(); // Prevent the onClick of the parent from firing
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = parseInt(src.style.width, 10);
    const startHeight = parseInt(src.style.height, 10);

    const doResize = (moveEvent) => {
      const currentX = moveEvent.clientX;
      const currentY = moveEvent.clientY;

      // Calculate the difference in dimensions
      const widthDiff = currentX - startX;
      const heightDiff = currentY - startY;

      // Calculate the new size maintaining the aspect ratio
      const aspectRatio = startWidth / startHeight;
      let newWidth = startWidth + widthDiff;
      let newHeight = startHeight + heightDiff;

      // Adjust new dimensions to maintain aspect ratio
      if (newWidth / newHeight > aspectRatio) {
        newWidth = newHeight * aspectRatio;
      } else {
        newHeight = newWidth / aspectRatio;
      }

      // Update the block style with new dimensions
      updateBlockStyle({
        width: `${newWidth}px`,
        height: `${newHeight}px`,
        x: src.style.x, // Assuming x and y remain constant during resize
        y: src.style.y
      });
    };

    const stopResize = () => {
      document.removeEventListener('mousemove', doResize);
      document.removeEventListener('mouseup', stopResize);
    };

    document.addEventListener('mousemove', doResize);
    document.addEventListener('mouseup', stopResize);
  };
  const handleInputChange = (event) => {
    const embedUrl = getYoutubeEmbedUrl(event.target.value);
    setUrl(embedUrl);
  };
  const getYoutubeEmbedUrl = (url) => {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };
  const getGoogleDriveEmbedUrl = (url) => {
    const regExp = /^(?:https?:\/\/)?drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/?.*$/;
    const match = url.match(regExp);
    return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : null;
  };
  const video = (
    <>
      {isEditable && <div className={styles.videoOverlay}></div>}
      <iframe
        src={src.content}
        frameBorder="0"
        allowFullScreen
        title="Embedded video"
        className={isEditable ? styles.editableYoutubeVideoWrapper : styles.youtubeVideoWrapper}
      />
    </>
  );
  const invalidVideoLinkMessage = (
    <p>Invalid video link. Links must be YouTube or Google Drive.</p>
  )
  const emptyVideoLinkInputMessage = (
    <div className={styles.emptyVideoInputMessage}>
      <FontAwesomeIcon icon={faYoutube} className={styles.iconYoutube}/>
      <p>Paste a URL from Youtube or a Google Drive file to preview the video.</p>

    </div>
  )
  const checkLinkValidity = () => {
    // console.log('link check result: ', (getYoutubeEmbedUrl(url) || getGoogleDriveEmbedUrl(url)))
    return (getYoutubeEmbedUrl(url) || getGoogleDriveEmbedUrl(url))
  }
  const blockControls = (
    <div className={styles.blockControls}>
      <FontAwesomeIcon icon={isEditable ? faFloppyDisk : faPencil} onClick={() => toggleEditable(blockIndex)} className={styles.iconStatus}/>
      <FontAwesomeIcon icon={faTrashCan} onClick={() => removeBlock(blockIndex)} className={styles.iconTrash}/>
      {/* <FontAwesomeIcon icon={faUpDown} className={styles.iconMove}/> */}
      <input
        type="text"
        value={url}
        onChange={handleInputChange}
        placeholder="Enter video URL"
        className={styles.videoInput}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {if (e.key === 'Enter') {handleInputChange(e)} }}
      />
    </div>
  )
  const handleMouseUp = (e) => {
    if (resizableRef.current) {
      const { width, height } = resizableRef.current.getBoundingClientRect();
      // Assuming src.style.x and src.style.y hold the current x and y positions
      const x = src.style.x; // Use src.style.x or calculate new x based on your logic
      const y = src.style.y; // Use src.style.y or calculate new y based on your logic

      // Call updateBlockStyle with the new dimensions and current or updated x and y positions
      updateBlockStyle({
        width: `${width}px`,
        height: `${height}px`,
        x: x,
        y: y
      });

      console.log(`Updated size and position - Width: ${width}px, Height: ${height}px, X: ${x}, Y: ${y}`);
    }
  };

  if (!src) { return <p>Loading</p> }

  return (
    <div
      ref={wrapperRef}
      style={{
        width: src.style.width,
        height: src.style.height,
        left: 0,
        top: 0,
        position: 'relative',
      }}
      onClick={() => { !isEditable && setActiveBlock(blockIndex)}}
      className={styles.videoBlockWrapper}

    >
      {isEditable && blockControls}
      {isEditable && url !== ''  && <div className='resizeHandle' onMouseDown={startResize}><div></div></div>}
      {(url !== '' || src.content !== '') ? video : emptyVideoLinkInputMessage}
    </div>
  )
}


