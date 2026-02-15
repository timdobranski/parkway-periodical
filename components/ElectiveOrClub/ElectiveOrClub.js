'use client'

import styles from './ElectiveOrClub.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

// sample props:

// const data = {

// }


export default function ElectiveOrClub({ data, titleSide }) {
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
      <img src={data.image} className={styles.photo} alt={data?.title ? `${data.title} photo` : 'Elective or club photo'}/>
      {responsiveArrowButton}
      {/* {mobileArrowButton} */}

    </div>
  )
  const clubMeetTime = (
    <div className={titleSide === 'right' ? styles.clubMeetTimeWrapperRight : styles.clubMeetTimeWrapper}>
      <p className={styles.clubMeetLabel}>MEETS:</p>
      <p className={styles.clubMeetTime}>{data.when}</p>
    </div>
  )
  const electiveMetadata = (
    <div className={titleSide === 'right' ? styles.electiveMetadataWrapperRight : styles.electiveMetadataWrapper}>
      <p className={`${data.duration === 'YEARLONG' ? styles.yearLong : styles.trimester}`}>{data.duration}</p>
      <p className={titleSide === 'right' ? styles.cteRight : styles.cte}>CTE BRIDGE COURSE</p>
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
          <h2 className={titleSide === 'right' ? styles.classTitleRight : styles.classTitle}>{data.title}</h2>

          {data.duration && electiveMetadata}
          {data.when && clubMeetTime}

        </div>

        <div className={styles.photoAndDescriptionWrapper}>
          <div className={`${titleSide === 'right' ? styles.descriptionWrapperLeft : styles.descriptionWrapperRight}`} onClick={() => setExpanded(!expanded)}>
            <p className={styles.classText}>{data.description}</p>
          </div>

          {overImage}

        </div>
      </div>
    </>
  )
}