'use client'

import { useState, useEffect } from 'react';
import styles from './PrimeText.module.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { Editor } from 'primereact/editor';

export default function PrimeText({ isEditable, textState, setTextState }) {

  if (!isEditable) {
    return (
      <div className={styles.PrimeTextContainer} dangerouslySetInnerHTML={{ __html: textState }}>
        {/* HTML content will be rendered here */}
      </div>
    )
  }
  return (
    <div className={styles.PrimeTextContainer}>
      <Editor value={textState} onTextChange={(e) => setTextState(e.htmlValue)} style={{height:'200px'}}/>
    </div>
  )
}