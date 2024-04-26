'use client'

import styles from './WelcomeSlideshow.module.css'
import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function WelcomeSlideshow() {
  const welcomeImage = (
    <div className={styles.welcomeSlide}>
      <img src='/images/parkwayNewLogo2.webp' alt='Parkway Logo' className={styles.welcomeLogo} />
    </div>
  )

  const upcomingEvents = (
    <div className={styles.upcomingEventsSlide}>
      <h2 className={`whiteSubTitle ${styles.upcomingEventsHeader}`}>Upcoming Events</h2>
      <ul>
        <li>School Dance</li>
        <li>Promotion Practice</li>
        <li>Bowling Party</li>
        <li>8th Grade Promotion</li>
      </ul>
    </div>
  )

  const storeLink = (
    <div className={styles.storeSlide}>
      <div className={styles.shirtContainer}>
            <img src="/images/store/blueShirt.webp" alt="Blue Shirt" className={styles.shirtImage} />
            <img src="/images/store/redShirt.webp" alt="Red Shirt"  className={styles.shirtImage} />
            <img src="/images/store/yellowShirt.webp" alt="Yellow Shirt"className={styles.shirtImage} />
            <img src="/images/store/greenShirt.webp" alt="Green Shirt"  className={styles.shirtImage} />
            <img src="/images/store/purpleShirt.webp" alt="Green Shirt"  className={styles.shirtImage} />
      </div>
      <div className={styles.storeText}>
        <p className={styles.schoolStoreText}>Show your school spirit with our Parkway gear! </p>
        <a href='https://teamlocker.squadlocker.com/#/lockers/parkway-sports-and-health-science-academy' className={styles.shopNow}>Visit Our School Store</a>
        </div>
    </div>
  )
  const newContentSlide = (
    <div className={styles.featuredContentSlide}>
    <p>Parkway Spotlight:</p>
    <p>Hip Hop Dance Elective</p>
  </div>
  )
  const [slides, setSlides] = useState([welcomeImage, storeLink,  newContentSlide, upcomingEvents]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  // 5 different content slides:
  // welcome image
  // upcoming events
  // recent new content
  // store
  // social media?

  const handleCarouselChange = (index) => {
    setCurrentPhotoIndex(index);
  };
  const customPrevArrow = (clickHandler, hasPrev) => {
    return (
      <FontAwesomeIcon icon={faChevronLeft} onClick={hasPrev ? clickHandler : null} className={hasPrev ? styles.arrowLeft : styles.arrowLeftDisabled}/>
    );
  }
  const customNextArrow = (clickHandler, hasNext) => {
    return (
      <FontAwesomeIcon icon={faChevronRight} onClick={hasNext ? clickHandler : null} className={hasNext ? styles.arrowRight : styles.arrowRightDisabled}/>
    );
  }


  return (
    <>
      <div className={styles.slideshowWrapper}>
        <Carousel
          renderArrowPrev={customPrevArrow}
          renderArrowNext={customNextArrow}
          preventMovementUntilSwipeScrollTolerance={true}
          swipeScrollTolerance={50}
          emulateTouch={true}
          dynamicHeight={false}
          autoPlay={false}
          showThumbs={false}
          showStatus={false}
          selectedItem={currentPhotoIndex}
          onChange={handleCarouselChange}
        >
          {slides.map((slide, index) => {
            console.log('slide: ', slide)
            return (
              slide

            )
          })}
        </Carousel>
      </div>
    </>
  )
}