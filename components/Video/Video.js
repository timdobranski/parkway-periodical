'use client'

import { useState, useEffect, useRef } from 'react';
import styles from './video.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faRotateRight, faRotateLeft, faFont, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import ContentBlockTitleAndCaption from '../ContentBlockTitleAndCaption/ContentBlockTitleAndCaption';
import { Rnd } from 'react-rnd';
import { useMediaQuery } from 'react-responsive';


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
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const [size, setSize] = useState({ width: '100%', height: '100%' });
  const [resizeActive, setResizeActive] = useState(false);
  const videoContainerClass = video?.orientation === 'portrait' ? styles.portraitVideoContainer : styles.videoContainer;
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const videoStyle = isMobile ? {} : video.style;


  // console.log('isEditable inside video block: ', isEditable)
  useEffect(() => {
    if (url || url === '') {
      updateVideoUrl && updateVideoUrl(url);
    }
  }, [url]);

  useEffect(() => {
    console.log('video object in contentblocks style changed: ', video.style)

  }, [video.style])

  useEffect(() => {
    if (resizeActive && videoRef.current && wrapperRef.current) {
      const videoHeight = videoRef.current.offsetHeight;
      console.log('video height in resizeActive, size useEffect:', videoHeight); // Debugging line
      wrapperRef.current.style.height = `${videoHeight}px`;
    } else if (!resizeActive && wrapperRef.current) {
      wrapperRef.current.style.height = 'auto';
    }
  }, [resizeActive]);

  useEffect(() => {
    if (!isEditable) {
      setResizeActive(false);
    }
  }, [isEditable])


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
  // adds or updates video style without resetting any existing values in the style object
  const setVideoStyle = (style) => {
    setContentBlocks(prev => {
      const newContent = [...prev];
      if (nestedIndex || nestedIndex === 0) {
        console.log('NEW CONTENT: ', newContent)
        console.log('block index: ', blockIndex)
        console.log('nested index: ', nestedIndex)
        if (newContent[blockIndex]?.content[nestedIndex]?.content[0]?.style) {
        newContent[blockIndex].content[nestedIndex].content[0].style = {
          ...newContent[blockIndex].content[nestedIndex].content[0].style,
          ...style,
        };
      }
      } else {
        newContent[blockIndex].content[0].style = {
          ...newContent[blockIndex].content[0].style,
          ...style,
        };
      }
      return newContent;
    });
  };
  const videoElement = (
    <div className={videoContainerClass} ref={videoRef} style={videoStyle} onClick={() => { if(isEditable && !resizeActive) {setResizeActive(true)}}}>
      {viewContext === 'edit' && <div className={styles.videoOverlay}></div>}
      <iframe src={video.url} frameBorder="0" allowFullScreen></iframe>
    </div>
  )

  const renderResizeView = () => (
    <>
      <div className={styles.resizeControls}>
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
            zIndex:'1000',
            width: '30px',
            height: '30px',
            bottom: '2px',
            right: '2px',
            backgroundColor: 'white',
            outline: 'solid red 2px',
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%)' /* Define the triangle shape */

          },
        }}
        resizeHandleClasses={{bottomRight: styles.bottomRightResizeHandle}}
      >
      <div className={videoContainerClass} ref={videoRef} >
      {viewContext === 'edit' && <div className={styles.videoOverlay}></div>}
      <iframe src={video.url} frameBorder="0" allowFullScreen></iframe>
    </div>
      </Rnd>
    </>
  );
  const onResizeStop = (e, direction, ref, delta, position) => {
    const newWidthPercentage = ref.style.width; // Width as a percentage (string with %)
    const numericWidth = parseFloat(newWidthPercentage); // Extract numeric part
    const newHeightPercentage = (numericWidth * 9 / 16) + "%";

    const newSize = {
      width: newWidthPercentage,
      paddingBottom: `${parseFloat(newWidthPercentage) * 9 / 16}%`

    };

    setSize(newSize);
    setVideoStyle(newSize);
    setResizeActive(false);
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
      <div className={styles.videoEditMenuIconWrapper} onClick={() => setResizeActive(!resizeActive)}>
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


  return (
    <div className={styles.videoBlockWrapper} ref={wrapperRef}>
      {isEditable && url && videoEditMenu}
      {(url !== '' || video.url !== '') ?
        resizeActive ? renderResizeView() : (videoElement)
        :
        emptyVideoLinkInputMessage}

      { !isLayout && !resizeActive &&
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


