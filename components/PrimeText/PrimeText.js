'use client'

import { useState, useEffect } from 'react';
import styles from './PrimeText.module.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Rnd } from "react-rnd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan, faFloppyDisk, faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';

import { Editor } from 'primereact/editor';

export default function PrimeText({ isEditable, toggleEditable, src, blockIndex,
  updateBlockStyle, setTextState, setActiveBlock, onClick, removeBlock
}) {


  // deprecated DOMNodeInserted event listener
  useEffect(() => {
    if (!isEditable) return;
    // Select the elements inside the Rnd component that you want to make non-draggable
    const nonDraggableElements = document.querySelectorAll('.p-editor-content');
    // Function to prevent dragging
    const preventDrag = (e) => e.stopPropagation();

    // Add event listeners to make these elements non-draggable
    nonDraggableElements.forEach(element => {
      element.addEventListener('mousedown', preventDrag);
    });

    // Cleanup function to remove the event listeners
    return () => {
      nonDraggableElements.forEach(element => {
        element.removeEventListener('mousedown', preventDrag);
      });
    };
  }, [isEditable]);

  useEffect(() => {
    console.log('src changed: ', src)
  }, [src]);

  // If not editable, return just the text
  if (!isEditable) {

    if (src && !src.content) return (
      <div className={styles.PrimeTextContainer} onClick={() => {setActiveBlock(blockIndex)}}>
        <p
          style={{
            height: src.style.height,
            width: src.style.width,
            left: src.style.x,
            top: src.style.y,
            position: 'absolute',
            border: 'dashed black 2px'
          }}
        >No text added yet. Click to add.</p>
      </div>
    );
    return (
      <div className={styles.PrimeTextContainer} >
        <p
          onClick={() => {setActiveBlock(blockIndex)}}
          style={{
            height: src?.style?.height,
            width: src?.style?.width,
            left: src?.style?.x,
            top: src?.style?.y,
            position: 'absolute',
          }}
          dangerouslySetInnerHTML={{ __html: src?.content }}>
        </p>
      </div>
    )
  }
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
  const onDragStop = (e, d) => {
    // Extract the existing width and height from src.style
    const { width, height } = src.style;
    updateBlockStyle({width, height, y: d.y, x: d.x});
  };
  const onResizeStop = (e, direction, ref, delta, position) => {
    // Extract the existing top and left from src.style
    const top = src.style.y;
    const left = src.style.x;
    updateBlockStyle({width: ref.offsetWidth, height: ref.offsetHeight, y:top, x:left});
  };

  return (
    // <div className={styles.PrimeTextContainer}>
    <Rnd
      // bounds='.blockWrapper'
      size={{width: src.style.width, height: src.style.height}}
      position={{x: src.style.x, y: src.style.y}}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      resizeHandleStyles={handleStyles}
      minWidth={200}
      // lockAspectRatio={true}
      style={{display: 'flex'}}
    >
      <div className={styles.blockControls}>
        <FontAwesomeIcon icon={isEditable ? faFloppyDisk : faPencil} onClick={() => toggleEditable(blockIndex)} className={styles.iconStatus}/>
        <FontAwesomeIcon icon={faTrashCan} onClick={() => removeBlock(blockIndex)} className={styles.iconTrash}/>
        <FontAwesomeIcon icon={faUpDownLeftRight} className={styles.iconMove}/>
      </div>
      <Editor value={src.content} onTextChange={(e) => setTextState(e.htmlValue)} />
    </Rnd>
    // </div>
  )
}