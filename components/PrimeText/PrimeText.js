'use client'

import { useState, useEffect, useRef } from 'react';
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
  const editorRef = useRef(null);


  // deprecated DOMNodeInserted event listener
  // useEffect(() => {
  //   if (isEditable && editorRef.current) {
  //     editorRef.current.focus();
  //   }
  // }, [isEditable, editorRef]);


  return (
    <Editor
      key={isEditable ? 'editable' : 'readonly'}
      ref={editorRef}
      value={src.content}
      onTextChange={(e) => setTextState(e.htmlValue)}
      placeholder='No text added yet. Click to add some text'
      {...(!isEditable && { readOnly: true })}
      {...(!isEditable && { showHeader: false })}
      showHeader={isEditable}
      focus='true'
    />
  )
}