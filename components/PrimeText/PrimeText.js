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

export default function PrimeText({ isEditable, textState, setTextState }) {

  useEffect(() => {
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
  }, []);

  if (!isEditable) {
    return (
      <div className={styles.PrimeTextContainer} dangerouslySetInnerHTML={{ __html: textState }}>
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



  return (
    <Rnd
      bounds='.postPreview'
      // size={{width: src.style.width, height: src.style.height}}
      // position={{x: src.style.x, y: src.style.y}}
      // onDragStop={onDragStop}
      // onResizeStop={onResizeStop}
      resizeHandleStyles={handleStyles}
      // lockAspectRatio={true}
      style={{display: 'flex'}}
      // minHeight={200}
      minWidth={200}
      maxHeight={800}
      maxWidth={1250}
    >
      <div className={styles.blockControls}>
        <FontAwesomeIcon icon={isEditable ? faFloppyDisk : faPencil} onClick={() => toggleEditable(blockIndex)} className={styles.iconStatus}/>
        <FontAwesomeIcon icon={faTrashCan} onClick={() => removeBlock(blockIndex)} className={styles.iconTrash}/>
        <FontAwesomeIcon icon={faUpDownLeftRight} className={styles.iconMove}/>
      </div>

      <div className={styles.PrimeTextContainer}>
        <Editor value={textState} onTextChange={(e) => setTextState(e.htmlValue)} />
      </div>
    </Rnd>
  )
}