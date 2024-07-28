'use client'

import styles from './SelectLayoutContent.module.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faImage, faFont, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

export default function SelectLayoutContent ({ addBlock, isEditable, index, viewContext }) {
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    if (!isEditable) {setExpanded(false)}
  }, [isEditable])

  const defaultVideoBlock = {
    type: 'video',
    content: [{
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
      }}
    ]
  }


  const defaultTextBlock = { type: 'text', content: ''}
  const defaultPhotoBlock = { type: 'photo', content: '', style: { width: '100%', height: 'auto', x: 0, y: 0, maxHeight: '50vh' }, format: 'single-photo-no-caption' }

  const toggleExpand = () => setExpanded(prev => !prev);

  const addButton = (
    <div className={styles.addIconWrapper}>
      <FontAwesomeIcon icon={faPlus} className={styles.addIcon} onClick={toggleExpand}/>
    </div>
  )
  const choices = (
    <div className={styles.selectChoicesWrapper}>
      <div className={styles.selectChoice} onClick={toggleExpand}>
        <FontAwesomeIcon icon={faChevronLeft} className={styles.icon} />
        <p>Back</p>
      </div>
      <div className={styles.selectChoice} onClick={() => addBlock(defaultTextBlock, index)}>
        <FontAwesomeIcon icon={faFont} className={`${styles.icon} ${styles.textIcon}`} />
        <p>Text</p>
      </div>
      <div className={styles.selectChoice} onClick={() => addBlock(defaultPhotoBlock, index)} >
        <FontAwesomeIcon icon={faImage} className={`${styles.icon} ${styles.photoIcon}`} />
        <p>Photo</p>
      </div>
      <div className={styles.selectChoice} onClick={() => addBlock(defaultVideoBlock)}>
        <FontAwesomeIcon icon={faYoutube} className={`${styles.icon} ${styles.youtubeIcon}`}  />
        <p>Video</p>
      </div>
    </div>
  )

  // if (viewContext === 'view') {
  //   return (
  //     null
  //   )
  // }


  return (
    expanded ? choices : addButton
  )
}