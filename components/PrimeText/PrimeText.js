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

  if (src && !src.content && !isEditable) return (
    <div className={styles.PrimeTextContainer} onClick={() => {setActiveBlock(blockIndex)}}>
      <p className={styles.emptyTextBlockMessage}>No text added yet. Click to add.</p>
    </div>
  );

  // return (
  //   <div className={styles.PrimeTextContainer} >
  //     <p
  //       className={styles.textView}
  //       onClick={() => {setActiveBlock(blockIndex)}}
  //       dangerouslySetInnerHTML={{ __html: src?.content }}>
  //     </p>
  //   </div>
  // )



  return (
    // <div className={styles.PrimeTextContainer}>

      <Editor
        value={src.content}
        onTextChange={(e) => setTextState(e.htmlValue)}
        {...(!isEditable && { readOnly: true })}
        />

    // </div>
  )
}