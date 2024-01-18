'use client'

import styles from './PostNavbar.module.css';
import { useState, useEffect } from 'react';
import  { RichUtils,  } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faVideo, faFont, faBars, faTv, faTableCells } from '@fortawesome/free-solid-svg-icons';
import TextControls from '../TextControls/TextControls';

export default function PostNavbar({
  onAddText, onAddPhoto, onAddVideo,
  editorState, handleSubmit,
  activeBlock, activeBlockType, updateEditorState,
}) {

  const isTextBlockActive = activeBlock !== null && activeBlockType === 'text';

  return (
    <div className={styles.navbarWrapper}>
      <div className={styles.navbarSection}>
        <h3 className={styles.navbarSectionTitle}>Add Layouts</h3>
        <div className={styles.navbarSectionRow}>
        <div className={styles.navbarSectionItem}>
          <div className={styles.layoutWrapper}>
            <div className={styles.layoutSingleRowWrapper}>
              <FontAwesomeIcon icon={faImage} className={styles.layoutIconFullHeight} />
              <FontAwesomeIcon icon={faBars} className={styles.layoutIconFullHeight} />
            </div>
          </div>
        </div>
        <div className={styles.navbarSectionItem}>
          <div className={styles.layoutWrapper}>
            <div className={styles.layoutSingleRowWrapper}>
              <FontAwesomeIcon icon={faBars} className={styles.layoutIconFullHeight} />
              <FontAwesomeIcon icon={faImage} className={styles.layoutIconFullHeight} />
            </div>
          </div>
        </div>


      <div className={styles.navbarSectionItem}>
        <div className={styles.layoutWrapper}>
          <div className={styles.layoutTopRowWrapper}>
            <FontAwesomeIcon icon={faImage} className={styles.layoutIcon} />
            <FontAwesomeIcon icon={faImage} className={styles.layoutIcon} />
            <FontAwesomeIcon icon={faImage} className={styles.layoutIcon} />
          </div>

          <div className={styles.layoutBottomRowWrapper}>
            <FontAwesomeIcon icon={faBars} className={styles.layoutIcon} />
            <FontAwesomeIcon icon={faBars} className={styles.layoutIcon} />
            <FontAwesomeIcon icon={faBars} className={styles.layoutIcon} />
          </div>
        </div>
        </div>
        </div>
        </div>

        <div className={styles.navbarSection}>
          <div className={styles.divider}></div>
        </div>


        <div className={styles.navbarSection}>
        <h3 className={styles.navbarSectionTitle}>Add Content</h3>
        <div className={styles.navbarSectionRow}>
          <div onClick={onAddText} className={styles.navbarSectionItem}>
            <FontAwesomeIcon icon={faFont} className={styles.icon} />
            <h3>Text</h3>
          </div>
          <div onClick={onAddPhoto} className={styles.navbarSectionItem}>
            <FontAwesomeIcon icon={faTableCells} className={styles.icon} />
            <h3>Photo Grid</h3>
          </div>
          <div onClick={onAddPhoto} className={styles.navbarSectionItem}>
            <FontAwesomeIcon icon={faTv} className={styles.icon} />
            <h3>Photo Carousel</h3>
          </div>
          <div onClick={onAddVideo} className={styles.navbarSectionItem}>
            <FontAwesomeIcon icon={faVideo} className={styles.icon} />
            <h3>Video</h3>
          </div>
        </div>
        </div>

        <h3 className={styles.publishButton} onClick={handleSubmit} >PUBLISH</h3>

    </div>
  )
}