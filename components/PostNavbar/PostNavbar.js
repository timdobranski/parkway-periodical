'use client'

import styles from './PostNavbar.module.css';
import { useState, useEffect } from 'react';
import  { RichUtils,  } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faVideo, faFont, faUndo, faRedo, faBold, faPalette, faHighlighter, faAlignLeft, faAlignRight, faAlignCenter, faListOl, faListUl } from '@fortawesome/free-solid-svg-icons';
import TextControls from '../TextControls/TextControls';

export default function PostNavbar({
  onAddText, onAddPhoto, onAddVideo,
  editorState, handleSubmit,
  activeBlock, activeBlockType, updateEditorState,
}) {

  const isTextBlockActive = activeBlock !== null && activeBlockType === 'text';


  return (
    <div className={styles.navbarWrapper}>

      {/* <div className={styles.navbarRow}> */}
        <div onClick={onAddText} className={styles.navbarItem}>
        <FontAwesomeIcon icon={faFont} className={styles.icon} />
        <h3>Add Text</h3>
        </div>
      <div onClick={onAddPhoto} className={styles.navbarItem}>
        <FontAwesomeIcon icon={faImage} className={styles.icon} />
        <h3>Add Photos</h3>
      </div>
      <div onClick={onAddVideo} className={styles.navbarItem}>
        <FontAwesomeIcon icon={faVideo} className={styles.icon} />
        <h3>Add a Video</h3>
      </div>

        <h3 className={styles.publishButton} onClick={handleSubmit} >PUBLISH</h3>

    </div>
  )
}