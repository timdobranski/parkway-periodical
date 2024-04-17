'use client'

import { useState, useEffect, useRef } from 'react';
import styles from './video.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faRotateRight, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

// update video style takes in an object with width, height, top, and left values set to numbers
export default function Video({ updateVideoUrl, updateBlockStyle, src, isEditable,
  setActiveBlock, blockIndex, removeBlock, toggleEditable, updateVideoOrientation, viewContext }) {
  const [url, setUrl] = useState(src.content);


  useEffect(() => {
    updateVideoUrl && updateVideoUrl(url);
    console.log('url changed: ', url)
  }, [url]);

  useEffect(() => {
    console.log('src changed: ', src)
  }, [src]);

  const handleInputChange = (event) => {
    const inputUrl = event.target.value;
    const embedUrl = getYoutubeEmbedUrl(inputUrl) || getGoogleDriveEmbedUrl(inputUrl);
    setUrl(embedUrl);
    // Automatically set portrait for YouTube Shorts
    if (embedUrl && embedUrl.includes('shorts')) {
      updateVideoOrientation('portrait');
    } else {
      updateVideoOrientation('landscape');
    }
  };
  const getYoutubeEmbedUrl = (url) => {
  // This regex handles both regular YouTube and YouTube Shorts URLs
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? `https://www.youtube.com/embed/${match[2]}` : null;
  };
  const getGoogleDriveEmbedUrl = (url) => {
    const regExp = /^(?:https?:\/\/)?drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)(?:\/view\?[^\/]*)?$/;
    const match = url.match(regExp);
    return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : null;
  };
  const toggleOrientation = () => {
    updateVideoOrientation(src.orientation === 'landscape' ? 'portrait' : 'landscape');
  };
  const emptyVideoLinkInputMessage = (
    <div className={`${styles.emptyVideoInputMessage} ${isEditable ? '' : 'outlined'}`}>
      <FontAwesomeIcon icon={faYoutube} className={styles.iconYoutube}/>
      <p style={{margin: '0'}}>Paste a URL from Youtube or a Google Drive file to preview the video.</p>

    </div>
  )
  const videoOptions = (
    <div className={styles.blockControls}>
      <input
        type="text"
        value={url}
        onChange={handleInputChange}
        placeholder="Enter video URL"
        className={styles.videoInput}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => { if (e.key === 'Enter') { handleInputChange(e) } }}
      />
      {url !== '' && (
        <>
          {/* <FontAwesomeIcon icon={src.orientation === 'landscape' ? faRotateRight : faRotateLeft} className={styles.icon} onClick={toggleOrientation}/> */}
          <FontAwesomeIcon icon={faTrashCan} className={`${styles.icon} ${styles.trashIcon}`} onClick={() => setUrl('')}/>
        </>
      )}
    </div>
  );

  if (!src) { return <p>Loading</p> }

  const videoContainerClass = src.orientation === 'portrait' ? styles.portraitVideoContainer : styles.videoContainer;

  return (
    <>
      {isEditable && videoOptions}
      {(url !== '' || src.content !== '') ? (
        <div className={videoContainerClass}>
          {viewContext === 'edit' && <div className={styles.videoOverlay}></div>}
          <iframe src={src.content} frameBorder="0" allowFullScreen></iframe>
        </div>
      ) : emptyVideoLinkInputMessage}
    </>
  );
}


