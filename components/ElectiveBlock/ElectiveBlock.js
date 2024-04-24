'use client'

import styles from './ElectiveBlock.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function ElectiveBlock({ electiveData, color }) {
  const [expanded, setExpanded] = useState(false)
  const responsiveArrowButton = (
    <FontAwesomeIcon
      icon={color === 'red' ? (expanded ? faChevronRight :faChevronLeft) : (expanded ? faChevronLeft : faChevronRight)}
      className={color === 'red' ? styles.navIconRight : styles.navIcon}/>
  )
  const mobileArrowButton = (
    <FontAwesomeIcon
      icon={(expanded ? faChevronLeft : faChevronRight)}
      className={color === 'red' ? styles.navIconRightMobile : styles.navIconMobile}/>
  )

  const overImage = (
    <div className={` ${color === 'red' ? styles.redPhotoWrapper : styles.bluePhotoWrapper} ${expanded ? (color === 'red' ? styles.slideOutLeft : styles.slideOutRight) : null}`}
      onClick={() => setExpanded(!expanded)}
    >
      <img src={electiveData.image}className={styles.photo}/>
    {responsiveArrowButton}
    {mobileArrowButton}

    </div>
  )
  const underImage = (
    <div className={`
    ${color === 'red' ? styles.redPhotoWrapper : styles.bluePhotoWrapper}
    ${expanded ? (color === 'red' ? styles.slideInFromLeft : styles.slideInFromRight) : null}
    ${styles.underPhotoWrapper}`}

    onClick={() => setExpanded(!expanded)}>
      <img src={electiveData.image}className={styles.underPhoto}></img>
      <div className={`${color === 'red' ? styles.redOverlay : styles.blueOverlay}`}></div>
    </div>
  )



  return (
    <>
      <div className={styles.electiveWrapper}>

        <div className={`${color === 'red' ? styles.titleWrapperRed : styles.titleWrapperBlue}`} onClick={() => setExpanded(!expanded)}>
          <h2 className={color === 'red' ? styles.classTitleRight : styles.classTitle}>{electiveData.title}</h2>
          {electiveData.cte && <p className={styles.cte}>CTE Bridge Course</p>}
        </div>
        <div className={styles.photoAndDescriptionWrapper}>

          <div className={`${color === 'red' ? styles.descriptionWrapperLeft : styles.descriptionWrapperRight}`}
            onClick={() => setExpanded(!expanded)}
          >
            <p className={styles.classText}>{electiveData.description}</p>
            <p className={`${electiveData.duration === 'Year Long' ? styles.yearLong : styles.trimester}`}>{electiveData.duration}</p>
          </div>

          {overImage}
        </div>

      </div>
    </>
  )
}