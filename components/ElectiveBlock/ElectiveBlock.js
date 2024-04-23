'use client'

import styles from './ElectiveBlock.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function ElectiveBlock({ electiveData, color }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      {/* <h2 className={styles.classTitle}>{electiveData.title}</h2> */}

      <div className={styles.electiveWrapper}>
        {/* <div className={styles.infoWrapper}> */}
        <div className={`${color === 'red' ? styles.titleWrapperRed : styles.titleWrapperBlue}`} onClick={() => setExpanded(!expanded)}>
          <h2 className={color === 'red' ? styles.classTitleRight : styles.classTitle}>{electiveData.title}</h2>
          {electiveData.cte && <p className={styles.cte}>CTE Bridge Course</p>}
          {/* <FontAwesomeIcon icon={color === 'red' ? (expanded ? faChevronRight :faChevronLeft) : (expanded ? faChevronLeft : faChevronRight)} className={styles.navIcon}/> */}
        </div>
        <div className={`${color === 'red' ? styles.descriptionWrapperLeft : styles.descriptionWrapperRight}`}
          onClick={() => setExpanded(!expanded)}
        >
          <p className={styles.classText}>{electiveData.description}</p>
          {/* <p className={styles.classText}>Taught By: Mr. Martin</p> */}
          <p className={`${electiveData.duration === 'Year Long' ? styles.yearLong : styles.trimester}`}>{electiveData.duration}</p>
        </div>
        {/* </div> */}



        <div
          className={` ${color === 'red' ? styles.redPhotoWrapper : styles.bluePhotoWrapper} ${expanded ? (color === 'red' ? styles.slideOutLeft : styles.slideOutRight) : null}`}
          onClick={() => setExpanded(!expanded)}
        >
          <img src={electiveData.image}className={styles.photo}></img>
          <div className={`${color === 'red' ? styles.redOverlay : styles.blueOverlay}`}></div>
          <FontAwesomeIcon
            icon={color === 'red' ? (expanded ? faChevronRight :faChevronLeft) : (expanded ? faChevronLeft : faChevronRight)}
            className={color === 'red' ? styles.navIconRight : styles.navIcon}/>
        </div>

      </div>
    </>
  )
}