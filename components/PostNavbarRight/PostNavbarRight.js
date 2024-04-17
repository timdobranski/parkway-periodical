'use client'

import styles from './PostNavbarRight.module.css';
import { useState, useEffect } from 'react';
import  { RichUtils,  } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faVideo, faFont, faBars, faTv, faTableCells } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

export default function PostNavbarRight({
  onAddText, onAddPhoto, onAddVideo,
  onAddLayout,
  editorState, handleSubmit, addBlock,
  activeBlock, activeBlockType, updateEditorState,
}) {

  const isTextBlockActive = activeBlock !== null && activeBlockType === 'text';

  return (
    <div className={styles.navbarWrapper}>
      <h3 className={styles.publishButton} onClick={handleSubmit} >PUBLISH</h3>

      <div className={styles.navbarSection}>
        <h3 className={styles.navbarSectionTitle}>Flexible Layouts</h3>
        <div className={styles.navbarSectionItem} onClick={() => onAddLayout(2)}>
          <div className={styles.iconWrapper}>
            <div className={styles.layoutTopRowWrapper}>
              <FontAwesomeIcon icon={faImage} className={styles.layoutIcon} />
              <FontAwesomeIcon icon={faImage} className={styles.layoutIcon} />
            </div>

            <div className={styles.layoutBottomRowWrapper}>
              <FontAwesomeIcon icon={faBars} className={styles.layoutIcon} />
              <FontAwesomeIcon icon={faBars} className={styles.layoutIcon} />
            </div>
          </div>
          <h3>2 Column</h3>
        </div>

        <div className={styles.navbarSectionItem} onClick={() => onAddLayout(3)}>
          <div className={styles.iconWrapper}>
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
          <h3>3 Column</h3>

        </div>

      </div>

      <div className={styles.navbarSection}>
        <h3 className={styles.navbarSectionTitle}>Specific Layouts</h3>
        {/* <div className={styles.navbarSectionRow}> */}

        <div className={styles.navbarSectionItem} onClick={() => onAddPhoto('single-photo-caption-right')}>
          <div className={styles.iconWrapper}>
            <div className={styles.layoutSingleRowWrapper}>
              <FontAwesomeIcon icon={faImage} className={styles.layoutIcon} />
              <FontAwesomeIcon icon={faBars} className={styles.layoutIcon} />
            </div>
          </div>
          <h3>Photo / Text</h3>

        </div>
        <div className={styles.navbarSectionItem} onClick={() => onAddPhoto('single-photo-caption-left')}>
          <div className={styles.iconWrapper}>
            <div className={styles.layoutSingleRowWrapper}>
              <FontAwesomeIcon icon={faBars} className={styles.layoutIcon} />
              <FontAwesomeIcon icon={faImage} className={styles.layoutIcon} />
            </div>
          </div>
          <h3>Text / Photo</h3>

        </div>
        <div className={styles.navbarSectionItem} onClick={() => onAddPhoto('single-photo-caption-below')}>
          <div className={styles.iconWrapper}>
            <div className={styles.layoutTopRowWrapper}>
              <FontAwesomeIcon icon={faImage} className={styles.layoutIcon} />
            </div>
            <div className={styles.layoutBottomRowWrapper}>
              <FontAwesomeIcon icon={faBars} className={styles.layoutIcon} />
            </div>
          </div>
          <h3>Photo Above</h3>

        </div>

        <div className={styles.navbarSectionItem} onClick={() => onAddPhoto('2xColumn')}>
          <div className={styles.iconWrapper}>
            <div className={styles.layoutTopRowWrapper}>
              <FontAwesomeIcon icon={faImage} className={styles.layoutIcon} />
              <FontAwesomeIcon icon={faImage} className={styles.layoutIcon} />
            </div>

            <div className={styles.layoutBottomRowWrapper}>
              <FontAwesomeIcon icon={faBars} className={styles.layoutIcon} />
              <FontAwesomeIcon icon={faBars} className={styles.layoutIcon} />
            </div>
          </div>
          <h3>2 Column Photo</h3>
        </div>

        <div className={styles.navbarSectionItem} onClick={() => onAddPhoto('3xColumn')}>
          <div className={styles.iconWrapper}>
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
          <h3>3 Column Photo</h3>

        </div>

      </div>

      {/* <div className={styles.divider}></div> */}


      <div className={styles.navbarSection}>
        <h3 className={styles.navbarSectionTitle}>Text</h3>
        <div onClick={onAddText} className={styles.navbarSectionItem}>
          <FontAwesomeIcon icon={faFont} className={styles.icon} />
          <h3>Header</h3>
        </div>
        <div onClick={onAddText} className={styles.navbarSectionItem}>
          <FontAwesomeIcon icon={faFont} className={styles.icon} />
          <h3>Text</h3>
        </div>
      </div>

      {/* <div className={styles.divider}></div> */}

      <div className={styles.navbarSection}>
        <h3 className={styles.navbarSectionTitle}>Photos</h3>
        <div onClick={() => onAddPhoto('single-photo-no-caption')} className={styles.navbarSectionItem}>
          <FontAwesomeIcon icon={faImage} className={styles.icon} />
          <h3>Single Photo</h3>
        </div>
        {/* <div onClick={() => onAddPhoto('grid')} className={styles.navbarSectionItem}>
          <FontAwesomeIcon icon={faTableCells} className={styles.icon} />
          <h3>Photo Gallery</h3>
        </div> */}
        <div onClick={() => onAddPhoto('carousel')} className={styles.navbarSectionItem}>
          <FontAwesomeIcon icon={faTv} className={styles.icon} />
          <h3>Photo Carousel</h3>
        </div>
      </div>

      {/* <div className={styles.divider}></div> */}

      <div className={styles.navbarSection}>
        <h3 className={styles.navbarSectionTitle}>Videos</h3>
        <div onClick={onAddVideo} className={styles.navbarSectionItem}>
          <FontAwesomeIcon icon={faYoutube} className={`${styles.icon} ${styles.youtubeIcon}`} />
          <h3>Youtube</h3>
        </div>
      </div>
    </div>
  )
}