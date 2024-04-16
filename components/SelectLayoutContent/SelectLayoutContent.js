'use client'

import styles from './SelectLayoutContent.module.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faImage, faFont, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

export default function SelectLayoutContent ({ addContent, isEditable }) {
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    if (!isEditable) {setExpanded(false)}
  }, [isEditable])

  const toggleExpand = () => setExpanded(prev => !prev);

  const addButton = (
    <FontAwesomeIcon icon={faPlus} className={styles.addIcon} onClick={toggleExpand}/>
  )
  const choices = (
    <div className={styles.selectChoicesWrapper}>
      <FontAwesomeIcon icon={faChevronLeft} className={styles.icon} onClick={toggleExpand}/>
      <FontAwesomeIcon icon={faFont} className={styles.icon}/>
      <FontAwesomeIcon icon={faImage} className={styles.icon}/>
      <FontAwesomeIcon icon={faYoutube} className={styles.icon}/>
    </div>
  )

  return (
    expanded ? choices : addButton
  )
}