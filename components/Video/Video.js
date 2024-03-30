'use client'

import { useState, useEffect } from 'react';
import styles from './video.module.css'
import { Rnd } from 'react-rnd';


export default function Video({ updateVideoUrl, src, isEditable, setActiveBlock }) {
  const [url, setUrl] = useState(src || '');

  useEffect(() => {
    updateVideoUrl(url);
  }, [isEditable, url]);

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
      className={styles.youtubeVideoWrapper} // Apply styles directly to iframe if not using Rnd
    />
  );
  const handleStyles = {
    topRight: {
      top: '-10px',
      right: '-10px',
      width: '20px',
      height: '20px',
      background: 'rgba(0, 0, 0, .5)',
      border: 'solid 4px black',
      cursor: 'nesw-resize',
    },
    bottomRight: {
      bottom: '-10px',
      right: '-10px',
      width: '20px',
      height: '20px',
      background: 'rgba(0, 0, 0, .5)',
      border: 'solid 4px black',
      cursor: 'nwse-resize',
    },
    bottomLeft: {
      bottom: '-10px',
      right: '10px',
      width: '20px',
      height: '20px',
      background: 'rgba(0, 0, 0, .5)',
      border: 'solid 4px black',
      cursor: 'nesw-resize',
    },
    topLeft: {
      top: '-10px',
      right: '-10px',
      width: '20px',
      height: '20px',
      background: 'rgba(0, 0, 0, .5)',
      border: 'solid 4px black',
      cursor: 'nwse-resize',
    },
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
        // onKeyDown={(e) => {if (e.key === 'Enter') {setActiveBlock(null)} }}
        onKeyDown={(e) => {if (e.key === 'Enter') {handleInputChange(e)} }}
      />}


      {src ? (
        isEditable ? (
          // Wrap the iframe with Rnd when isEditable is true
          <Rnd
            // bounds='.postPreview'
            // lockAspectRatio={true}
            default={{ width:'1000px', height:'562.5px' , x:0, y:0 }}
            // style={{ 'max-height': '50vh', }}
            // onDragStart={(event) => {event.preventDefault()}}
            onDragStop={() => {}}
            onResizeStop={() => {}}
            resizeHandleStyles={handleStyles}
          >
            <div className={styles.videoOverlay}></div>
            {video}
          </Rnd>
        ) : (
          // Directly render the iframe when isEditable is false
          video
        )
      ) : null}
    </div>
  )
}


