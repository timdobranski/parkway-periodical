'use client'

import { useState, useEffect } from 'react';
import styles from './video.module.css'
import { Rnd } from 'react-rnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan, faFloppyDisk, faUpDownLeftRight, faVideo } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';


// update video style takes in an object with width, height, top, and left values set to numbers
export default function Video({ updateVideoUrl, updateBlockStyle, src, isEditable, setActiveBlock, blockIndex, removeBlock, toggleEditable }) {
  const [url, setUrl] = useState('');
  const [blockHeight, setBlockHeight] = useState(parseInt(src.style.height, 10) + src.style.y);
  const [blockContentHeight, setBlockContentHeight] = useState(parseInt(src.style.height, 10) );
  const [blockPosition, setBlockPosition] = useState({x: src.style.x, y: src.style.y});
  //
  useEffect(() => {
    updateVideoUrl(url);
  }, [url]);
  useEffect(() => {
    setBlockHeight(parseInt(blockContentHeight, 10) + blockPosition.y);
  }, [blockContentHeight, blockPosition]);

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
    updateBlockStyle({width, height, y: d.y, x: d.x});
  };
  const onResizeStop = (e, direction, ref, delta, position) => {
    // The fixed width of the parent container
    const parentWidth = 1121;
    // The new width of the content after the resize
    const newContentWidth = ref.offsetWidth;
    // Calculate the new x value to center the content horizontally within the parent
    const newX = (parentWidth - newContentWidth) / 2;
    // Use the existing top from src.style for the y position
    const top = src.style.y;
    // Update the parent component's state with the new size and centered x position
    updateBlockStyle({ width: newContentWidth, height: ref.offsetHeight, y: top, x: newX });
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
  // if editable and no url
  if (isEditable && url === '') {
    return (
      <div key={blockIndex} className='blockWrapper' style={{height: blockHeight + 'px'}}>
        <Rnd
          // bounds='.blockWrapper'
          size={{width: src.style.width, height: src.style.height}}
          position={{x: (src.style.x + (.5 * parseInt(src.style.width, 10))), y: src.style.y}}
          onDragStart={(event) => {event.preventDefault()}}
          onDrag={(e, d) => { setBlockPosition({x: d.x, y: d.y})}}
          onResize={(e, direction, refToElement, delta, position) => {
            setBlockPosition({ x: position.x, y: position.y });
            setBlockContentHeight(parseInt(refToElement.style.height, 10));
          }}
          onDragStop={onDragStop}
          onResizeStop={onResizeStop}
          dragAxis='y'
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'solid 2px black',
            backgroundColor: 'rgba(0, 0, 0, .1)',
          }}

        >
          <div className={styles.blockControls}>
            <FontAwesomeIcon icon={isEditable ? faFloppyDisk : faPencil} onClick={() => toggleEditable(blockIndex)} className={styles.iconStatus}/>
            <FontAwesomeIcon icon={faTrashCan} onClick={() => removeBlock(blockIndex)} className={styles.iconTrash}/>
            <FontAwesomeIcon icon={faUpDownLeftRight} className={styles.iconMove}/>
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
          <FontAwesomeIcon icon={faYoutube} className={styles.iconYoutube} />

          <p style={{height: src.style.height, width: src.style.width, textAlign: 'center' }}>No video link added yet</p>
        </Rnd>
      </div>
    )
  }
  if (!isEditable && url === '') {
    return (
      <div className={styles.videoBlockWrapper}>
        <div
          style={{
            height: src?.style?.height,
            width: src?.style?.width,
            left: src?.style?.x,
            top: src?.style?.y,
            position: 'absolute',
            border: 'dashed 2px black',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
          }}
          onClick={() => setActiveBlock(blockIndex)}
        >
          <FontAwesomeIcon icon={faYoutube} className={styles.iconYoutube} />
          <p>Click to add video link</p>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.videoBlockWrapper}>

      {
        isEditable ? (
          // Wrap the iframe with Rnd when isEditable is true
          <div key={blockIndex} className='blockWrapper' style={{height: blockHeight + 'px'}}>

            <Rnd
              // bounds='.blockWrapper'
              dragAxis='y'
              size={{width: src.style.width, height: src.style.height}}
              position={{x: src.style.x, y: src.style.y}}
              onDragStart={(event) => {event.preventDefault()}}
              onDrag={(e, d) => { setBlockPosition({x: d.x, y: d.y})}}
              onResize={(e, direction, refToElement, delta, position) => {
                setBlockPosition({ x: position.x, y: position.y });
                setBlockContentHeight(parseInt(refToElement.style.height, 10));
              }}
              onDragStop={onDragStop}
              onResizeStop={onResizeStop}
              resizeHandleStyles={url ? handleStyles : null}
              // maxHeight={url ? 1 : null}
              // maxWidth={url ? 1 : null}
              lockAspectRatio={true}
            >
              <div className={styles.blockControls}>
                <FontAwesomeIcon icon={isEditable ? faFloppyDisk : faPencil} onClick={() => toggleEditable(blockIndex)} className={styles.iconStatus}/>
                <FontAwesomeIcon icon={faTrashCan} onClick={() => removeBlock(blockIndex)} className={styles.iconTrash}/>
                <FontAwesomeIcon icon={faUpDownLeftRight} className={styles.iconMove}/>
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
              <div className={styles.videoOverlay}></div>
              {video}
            </Rnd>
          </div>
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
      }
    </div>
  )
}


