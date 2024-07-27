'use client'

import styles from './PostNavbarRight.module.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faVideo, faFont, faBars, faTv, faTableCells, faCircleQuestion, faX } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

export default function PostNavbarRight({ handleSubmit, addBlock, publishingStatus, updateMode
}) {

  const singlePhotoNoCaption = { type: 'photo', content: [], format: 'single-photo-no-caption' };
  const photoCarousel = { type: 'carousel', content: [], format: 'carousel' };



  return (
    <div className={styles.navbarWrapper}>
      <h3 className={styles.publishButton} onClick={publishingStatus ? null : handleSubmit} >{updateMode ? 'UPDATE' : 'PUBLISH'}</h3>

      <div className={styles.navbarSection}>
        <h3 className={styles.navbarSectionTitle}>Flexible Layouts </h3>
        <div className={styles.navbarSectionItem} onClick={() => addBlock({type: 'flexibleLayout', content: [ {type: 'undecided'}, {type: 'undecided'}]})}>
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
          <h3 className={styles.layoutLabel}>2x</h3>
        </div>

        <div className={styles.navbarSectionItem} onClick={() => addBlock({type: 'flexibleLayout', content: [{type: 'undecided'}, {type: 'undecided'}, {type: 'undecided'}]})}>
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
          <h3 className={styles.layoutLabel}>3x</h3>
        </div>
        <div className={styles.navbarSectionItem} onClick={() => addBlock({type: 'flexibleLayout', content: [{type: 'undecided'}, {type: 'undecided'}, {type: 'undecided'}, {type: 'undecided'}]})}>
          <div className={styles.iconWrapper}>
            <div className={styles.layoutTopRowWrapper}>
              <FontAwesomeIcon icon={faImage} className={styles.layoutIcon} />
              <FontAwesomeIcon icon={faImage} className={styles.layoutIcon} />
              <FontAwesomeIcon icon={faImage} className={styles.layoutIcon} />
              <FontAwesomeIcon icon={faImage} className={styles.layoutIcon} />
            </div>

            <div className={styles.layoutBottomRowWrapper}>
              <FontAwesomeIcon icon={faBars} className={styles.layoutIcon} />
              <FontAwesomeIcon icon={faBars} className={styles.layoutIcon} />
              <FontAwesomeIcon icon={faBars} className={styles.layoutIcon} />
              <FontAwesomeIcon icon={faBars} className={styles.layoutIcon} />
            </div>
          </div>
          <h3 className={styles.layoutLabel}>4x</h3>
        </div>

      </div>

      <div className={styles.navbarSection}>
        <h3 className={styles.navbarSectionTitle}>Text</h3>
        <div onClick={() => addBlock({ type: 'text', content: ''})} className={styles.navbarSectionItem}>
          <FontAwesomeIcon icon={faFont} className={styles.icon} />
          <h3>Text</h3>
        </div>
      </div>

      <div className={styles.navbarSection}>
        <h3 className={styles.navbarSectionTitle}>Photos</h3>
        <div onClick={() => addBlock(singlePhotoNoCaption)} className={styles.navbarSectionItem}>
          <FontAwesomeIcon icon={faImage} className={styles.icon} />
          <h3>Single Photo</h3>
        </div>
        <div onClick={() => addBlock(photoCarousel)} className={styles.navbarSectionItem}>
          <FontAwesomeIcon icon={faTv} className={styles.icon} />
          <h3>Slideshow</h3>
        </div>
      </div>

      <div className={styles.navbarSection}>
        <h3 className={styles.navbarSectionTitle}>Videos</h3>
        <div onClick={() =>
          addBlock({ type: 'video', content: [{
            url: '',
            title: false,
            caption: false,
            orientation: 'landscape',
            style: {
              width: '100%',
              height: 'auto' ,
              x: 325,
              y: 0,
              maxHeight:'50vh'
            }
          }],
          })}
        className={styles.navbarSectionItem}>
          <FontAwesomeIcon icon={faYoutube} className={`${styles.icon} ${styles.youtubeIcon}`} />
          <h3>Youtube</h3>
        </div>
      </div>
    </div>
  )
}