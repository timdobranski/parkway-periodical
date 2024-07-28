'use client'

import { useState, useEffect, useRef } from 'react';
import styles from './video.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faRotateRight, faRotateLeft, faFont, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import ContentBlockTitleAndCaption from '../ContentBlockTitleAndCaption/ContentBlockTitleAndCaption';

// src is the full video object with type, content, title, caption, styles, and orientation properties
// update video style takes in an object with width, height, top, and left values set to numbers
export default function VideoBlock({
  video,
  isEditable,
  updateVideoUrl,
  blockIndex,
  updateVideoOrientation,
  viewContext,
  isLayout,
  setContentBlocks,
  nestedIndex,
  toggleTitleOrCaption
}) {

  const [url, setUrl] = useState(video?.url);

  // console.log('isEditable inside video block: ', isEditable)
  useEffect(() => {
    if (url || url === '') {
      updateVideoUrl && updateVideoUrl(url);
      console.log('url changed: ', url)
    }
  }, [url]);

  useEffect(() => {
    console.log('video prop changed: ', video)
  }, [video]);

  const handleInputChange = (event) => {
    const inputUrl = event.target.value;
    const embedUrl = getYoutubeEmbedUrl(inputUrl) || getGoogleDriveEmbedUrl(inputUrl);
    setUrl(embedUrl);
    // Automatically set portrait for YouTube Shorts
    if (embedUrl && embedUrl.includes('shorts')) {
      updateVideoOrientation('portrait');
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
      <p>Paste a URL from Youtube to preview the video.</p>
      <input
        type="text"
        value={url}
        onChange={handleInputChange}
        placeholder="Enter video URL"
        className={styles.videoInput}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => { if (e.key === 'Enter') { handleInputChange(e) } }}
      />

    </div>
  )
  const videoEditMenu = (
    <div className={styles.videoEditMenu}>
      <div className={styles.videoEditMenuIconWrapper}>
        <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} className={styles.captionIcon} />
        <p>Resize</p>
      </div>
      <div className={`${video?.title !== false ? styles.activeIconWrapper : styles.videoEditMenuIconWrapper}`} onClick={() => toggleTitleOrCaption('title')}>
        <FontAwesomeIcon icon={faFont} className={styles.captionIcon} />
        <p>Title</p>
      </div>
      <div className={`${video?.caption !== false ? styles.activeIconWrapper : styles.videoEditMenuIconWrapper}`} onClick={() => toggleTitleOrCaption('caption')}>
        <FontAwesomeIcon icon={faFont} className={styles.captionIcon} />
        <p>Caption</p>
      </div>
      <div className={`${styles.videoEditMenuIconWrapper}`}>
        <FontAwesomeIcon icon={faTrash} className={`${styles.captionIcon} ${styles.trashIcon}`} />
        <p>Remove</p>
      </div>

    </div>
  );

  if (!video) { return <p>Loading</p> }

  const videoContainerClass = video?.orientation === 'portrait' ? styles.portraitVideoContainer : styles.videoContainer;

  return (
    <div className={styles.videoBlockWrapper}>
      {isEditable && url && videoEditMenu}
      {(url !== '' || video.url !== '') ? (
        <div className={videoContainerClass}>
          {viewContext === 'edit' && <div className={styles.videoOverlay}></div>}
          <iframe src={video.url} frameBorder="0" allowFullScreen></iframe>
        </div>
      ) : emptyVideoLinkInputMessage}

      { !isLayout &&
      <ContentBlockTitleAndCaption
        content={video}
        isEditable={isEditable}
        setContentBlocks={setContentBlocks}
        index={blockIndex}
        nestedIndex={nestedIndex}
      />}

    </div>
  );
}


