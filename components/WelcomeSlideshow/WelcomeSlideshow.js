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
      <img src='/images/logos/parkwayNewLogo2.webp' alt='Parkway Logo' className={styles.welcomeLogo} />
    </div>
  )

  const upcomingEvents = (
    <div className={styles.upcomingEventsSlide}>
      <h2 className={`whiteSubTitle ${styles.upcomingEventsHeader}`}>Upcoming Events</h2>
      <ul className={styles.eventsList}>
        <li className={styles.eventsItem}>Date: School Dance</li>
        <li className={styles.eventsItem}>Date: Promotion Practice</li>
        <li className={styles.eventsItem}>Date: Bowling Party</li>
        <li className={styles.eventsItem}>Date: 8th Grade Promotion</li>
      </ul>
    </div>
  )
  const familyResourceCenter = (
    <div className={styles.familyResourceCenter}>
      <div className={styles.frcTitleWrapper}>
        <p className={styles.frcSubtitle}>{` Visit Parkway's`}</p>
        <h3 className={`whiteSubTitle ${styles.frcTitle}`}>
          <a href="https://sites.google.com/lmsvsd.net/familyresourcecenter/home?authuser=0" target="_blank" rel="noopener noreferrer">
            {`Family Resource Center`}
          </a>
        </h3>
        <p className={styles.frcSubtitle2}>{`The Family Resource Center is an online hub for helpful content designed to keep families connected to the
        social-emotional content we are learning as a school, as well as community resources, attendance information,
        and parent training opportunities.`}</p>
      </div>
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
      <div className={styles.storeTextWrapper}>
        <p className={styles.schoolStoreText}>Looking for some new Parkway Academy spirit wear?
        Check out our spirit wear webstore for great shirts, hoodies and more!</p>
        <a href='https://teamlocker.squadlocker.com/#/lockers/parkway-sports-and-health-science-academy' className={styles.shopNow}>Visit Our School Store</a>
      </div>
    </div>
  )
  const newContentSlide = (
    <div className={styles.featuredContentSlide}>
      <p>{`Spotlight: `}</p>
      <p>Randomly Chosen Elective or Club Featured Here</p>
    </div>
  )
  const [slides, setSlides] = useState([welcomeImage, familyResourceCenter, upcomingEvents, storeLink,  newContentSlide]);
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
              <div
                key={index}
              >
                {slide}
              </div>

            )
          })}
        </Carousel>
      </div>
    </>
  )
}