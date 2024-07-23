'use client'

import styles from './SelectLayoutContent.module.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faImage, faFont, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

export default function SelectLayoutContent ({ addBlock, isEditable, index }) {
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    if (!isEditable) {setExpanded(false)}
  }, [isEditable])

  const defaultVideoBlock = { type: 'video', content: '', orientation: 'landscape', style: { width: '100%', height: 'auto' , x: 325, y: 0, maxHeight:'50vh' }}
  const defaultTextBlock = { type: 'text', content: ''}
  const defaultPhotoBlock = { type: 'photo', content: '', style: { width: '100%', height: 'auto', x: 0, y: 0, maxHeight: '50vh' }, format: 'single-photo-no-caption' }

  const toggleExpand = () => setExpanded(prev => !prev);

  const addButton = (
    <FontAwesomeIcon icon={faPlus} className={styles.addIcon} onClick={toggleExpand}/>
  )
  const choices = (
    <div className={styles.selectChoicesWrapper}>
      <FontAwesomeIcon icon={faChevronLeft} className={styles.icon} onClick={toggleExpand}/>
      <FontAwesomeIcon icon={faFont} className={styles.icon} onClick={() => addBlock(defaultTextBlock, index)} />
      <FontAwesomeIcon icon={faImage} className={styles.icon} onClick={() => addBlock(defaultPhotoBlock, index)} />
      <FontAwesomeIcon icon={faYoutube} className={styles.icon} onClick={() => addBlock(defaultVideoBlock)} />
    </div>
  )

  return (
    expanded ? choices : addButton
  )
}