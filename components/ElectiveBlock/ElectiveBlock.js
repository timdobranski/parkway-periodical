'use client'

import styles from './ElectiveBlock.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function ElectiveBlock({ electiveData, titleSide }) {
  const [expanded, setExpanded] = useState(false)
  const responsiveArrowButton = (
    <FontAwesomeIcon
      icon={titleSide === 'right' ? (expanded ? faChevronRight :faChevronLeft) : (expanded ? faChevronLeft : faChevronRight)}
      className={titleSide === 'right' ? styles.navIconRight : styles.navIcon}/>
  )
  const mobileArrowButton = (
    <FontAwesomeIcon
      icon={(expanded ? faChevronUp : faChevronDown)}
      className={titleSide === 'right' ? styles.navIconRightMobile : styles.navIconMobile}/>
  )

  const overImage = (
    <div className={` ${titleSide === 'right' ? styles.rightPhotoWrapper : styles.leftPhotoWrapper} ${expanded ? (titleSide === 'left' ? styles.slideOutLeft : styles.slideOutRight) : null}`}
      onClick={() => setExpanded(!expanded)}
    >
      <img src={electiveData.image}className={styles.photo}/>
      {responsiveArrowButton}
      {/* {mobileArrowButton} */}

    </div>
  )
  // const underImage = (
  //   <div className={`
  //   ${titleSide === 'right' ? styles.rightPhotoWrapper : styles.leftPhotoWrapper}
  //   ${expanded ? (titleSide === 'right' ? styles.slideInFromLeft : styles.slideInFromRight) : null}
  //   ${styles.underPhotoWrapper}`}

  //   onClick={() => setExpanded(!expanded)}>
  //     <img src={electiveData.image}className={styles.underPhoto}></img>
  //     <div className={`${titleSide === 'right' ? styles.rightOverlay : styles.leftOverlay}`}></div>
  //   </div>
  // )



  return (
    <>
      <div className={styles.electiveWrapper}>

        <div className={`${titleSide === 'right' ? styles.titleWrapperRight : styles.titleWrapperLeft}`} onClick={() => setExpanded(!expanded)}>
          <h2 className={titleSide === 'right' ? styles.classTitleRight : styles.classTitle}>{electiveData.title}</h2>
          <div className={titleSide === 'right' ? styles.electiveMetadataWrapperRight : styles.electiveMetadataWrapper}>
          <p className={`${electiveData.duration === 'Year Long' ? styles.yearLong : styles.trimester}`}>{electiveData.duration}</p>
          <p className={titleSide === 'right' ? styles.cteRight : styles.cte}>CTE Bridge Course</p>

          </div>

        </div>
        <div className={styles.photoAndDescriptionWrapper}>

          <div className={`${titleSide === 'right' ? styles.descriptionWrapperLeft : styles.descriptionWrapperRight}`}
            onClick={() => setExpanded(!expanded)}
          >
            {/* {electiveData.when && (
              <p className={styles.when}>
                <span className={styles.meetsLabel}>MEETS:</span> {electiveData.when}
              </p>
            )} */}
            <p className={styles.classText}>{electiveData.description}</p>
          </div>

          {overImage}

        </div>

      </div>
    </>
  )
}