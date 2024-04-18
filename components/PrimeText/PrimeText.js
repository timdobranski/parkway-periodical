'use client'

import { useState, useEffect, useRef } from 'react';
import styles from './PrimeText.module.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { Editor } from 'primereact/editor';

export default function PrimeText({ isEditable, toggleEditable, src, blockIndex,
  updateBlockStyle, setTextState, setActiveBlock, onClick, removeBlock, toolbar, viewContext
}) {

  // useEffect(() => {
  //   if (isEditable && editorRef.current) {
  //     editorRef.current.focus();
  //   }
  // }, [isEditable, editorRef]);

  return (
    <Editor
      key={isEditable ? 'editable' : 'readonly'}

      value={src.content}
      onTextChange={(e) => setTextState(e.htmlValue)}
      placeholder='No text added yet. Click to add some text'
      {...(!isEditable && { readOnly: true })}
      {...(!isEditable && { showHeader: false })}
      showHeader={isEditable || false}
      headerTemplate={toolbar}
    />
  )
}