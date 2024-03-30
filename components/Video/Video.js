'use client'

import { useState, useEffect } from 'react';
import styles from './video.module.css'
import { Rnd } from 'react-rnd';

// update video style takes in an object with width, height, top, and left values set to numbers
export default function Video({ updateVideoUrl, updateVideoStyle, src, isEditable, setActiveBlock, blockIndex }) {
  const [url, setUrl] = useState(src.content || '');

  useEffect(() => {
    updateVideoUrl(url);
  }, [url]);

  useEffect(() => {
    console.log('src inside video component changed: ', src)
  }, [])

  const handleInputChange = (event) => {
    setUrl(event.target.value);
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
    <iframe
      draggable
      src={getYoutubeEmbedUrl(url) || getGoogleDriveEmbedUrl(url)}
      frameBorder="0"
      allowFullScreen
      title="Embedded video"
      className={styles.youtubeVideoWrapper}
    />
  );

  const onDragStop = (e, d) => {
    // Extract the existing width and height from src.style
    const { width, height } = src.style;

    // Update the parent component's state with the new position and existing size
    updateVideoStyle({width, height, y: d.y, x: d.x});
  };

  const onResizeStop = (e, direction, ref, delta, position) => {
    // Extract the existing top and left from src.style
    const top = src.style.y;
    const left = src.style.x;

    // Update the parent component's state with the new size and existing position
    updateVideoStyle({width: ref.offsetWidth, height: ref.offsetHeight, y:top, x:left});
  };

  const invalidVideoLink = (
    <p>Invalid video link. Links must be YouTube or Google Drive.</p>
  )
  const emptyVideoLinkInput = (
    <p>Paste a URL from Youtube or a Google Drive file to preview the video.</p>
  )
  const handleStyles = {
    topRight: {
      top: '-10px',
      right: '-10px',
      width: '20px',
      height: '20px',
      background: 'rgba(0, 0, 0, .8)',
      border: 'solid 2px rgba(0, 195, 255, 1)',
      cursor: 'nesw-resize',
      borderRadius: '50%'
    },
    bottomRight: {
      bottom: '-10px',
      right: '-10px',
      width: '20px',
      height: '20px',
      background: 'rgba(0, 0, 0, .8)',
      border: 'solid 2px rgba(0, 195, 255, 1)',
      cursor: 'nwse-resize',
      borderRadius: '50%'
    },
    bottomLeft: {
      bottom: '-10px',
      right: '10px',
      width: '20px',
      height: '20px',
      background: 'rgba(0, 0, 0, .8)',
      border: 'solid 2px rgba(0, 195, 255, 1)',
      cursor: 'nesw-resize',
      borderRadius: '50%'
    },
    topLeft: {
      top: '-10px',
      right: '-10px',
      width: '20px',
      height: '20px',
      background: 'rgba(0, 0, 0, .8)',
      border: 'solid 2px rgba(0, 195, 255, 1)',
      cursor: 'nwse-resize',
      borderRadius: '50%'
    },
  }
  const checkLinkValidity = () => {
    // console.log('link check result: ', (getYoutubeEmbedUrl(url) || getGoogleDriveEmbedUrl(url)))
    return (getYoutubeEmbedUrl(url) || getGoogleDriveEmbedUrl(url))
  }



  return (
    <div className={styles.videoBlockWrapper}>
      {isEditable &&
      <input
        type="text"
        value={url}
        onChange={handleInputChange}
        placeholder="Enter video URL"
        className={styles.videoInput}
        onKeyDown={(e) => {if (e.key === 'Enter') {handleInputChange(e)} }}
      />}


      {src && src !== '' ? (
        isEditable ? (
          // Wrap the iframe with Rnd when isEditable is true
          <Rnd
            bounds='.postPreview'
            // default={src.style}
            size={{width: src.style.width, height: src.style.height}}
            position={{x: src.style.x, y: src.style.y}}
            onDragStop={onDragStop}
            onResizeStop={onResizeStop}
            resizeHandleStyles={handleStyles}
            // lockAspectRatio={true}
            // style={{ 'position:': 'relative', }}
          >
            <div className={styles.videoOverlay}></div>
            {video}
          </Rnd>
        ) : (
          // Directly render the iframe when isEditable is false
          <div
            style={{height: src.style.height, width: src.style.width, left: src.style.x, top: src.style.y, position: 'absolute'}}
            onClick={() => setActiveBlock(blockIndex)}
          >
            <div className={styles.videoOverlay}></div>
            {video}
          </div>
        )
      ) : <p>No video link added yet</p>}
    </div>
  )
}


