'use client'

import styles from './PostNavbar.module.css';
import { useState, useEffect } from 'react';
import  { RichUtils,  } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faVideo, faFont, faUndo, faRedo, faBold, faPalette, faHighlighter, faAlignLeft, faAlignRight, faAlignCenter, faListOl, faListUl } from '@fortawesome/free-solid-svg-icons';
import TextControls from '../TextControls/TextControls';

export default function PostNavbar({
  onAddText, onAddPhoto, onAddVideo,
  editorState, onToggleBold,
  activeBlock, activeBlockType, updateEditorState,
  onToggleLeftAlign, onToggleCenterAlign, onToggleRightAlign,
}) {

  const isTextBlockActive = activeBlock !== null && activeBlockType === 'text';



  return (
    <div className={styles.navbarWrapper}>
      {/* <div className={styles.rowsWrapper}> */}
      <div className={styles.navbarRow}>
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
      <div onClick={onAddVideo} className={styles.navbarItem}>
        {/* <FontAwesomeIcon icon={faVideo} className={styles.icon} /> */}
        <h3 className={styles.publishButton}>PUBLISH</h3>
      </div>
      </div>
      {/* <div className={styles.divider}></div> */}

      <div className={styles.editRow}>
        <TextControls
          editorState={editorState}
          onToggleBold={onToggleBold}
          onToggleLeftAlign={() => onToggleLeftAlign()}
          onToggleCenterAlign={() => onToggleCenterAlign()}
          onToggleRightAlign={() => onToggleRightAlign()}
          // setEditorState={updateEditorState}
          // onToggle={handleToggle}
          // onUndo={handleUndo}
          // onRedo={handleRedo}
          // onAlignmentToggle={applyTextAlignment}
          // addColorToMap={addColorToMap}
          // applyColor={applyColor}
          isActive={isTextBlockActive}
        />
      {/* </div> */}
      </div>
    </div>
  )
}