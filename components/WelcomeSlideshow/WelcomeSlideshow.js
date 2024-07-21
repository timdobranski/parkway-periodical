'use client'

import styles from './WelcomeSlideshow.module.css'
import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { createClient } from '../../utils/supabase/client';
import dateFormatter from '../../utils/dateFormatter';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../contexts/AdminContext';

export default function WelcomeSlideshow() {
  const supabase = createClient();
  const [autoplay, setAutoplay] = useState(false);
  const [events, setEvents] = useState([]);
  const router = useRouter();
  const { introOver } = useAdmin();

  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     const { data, error } = await supabase
  //       .from('events')
  //       .select('*')
  //       .gt('date', new Date().toISOString()) // Ensure dates are in the future
  //       .order('date', { ascending: true })  // Sort by event_date in ascending order
  //       .limit(5);
  //     if (error) {
  //       console.error('Error fetching events: ', error);
  //     } else {
  //       setEvents(data);
  //     }
  //   }
  //   fetchEvents();
  // }, []);

  useEffect(() => {
    // console.log('INTRO OVER: ', introOver)
    if (introOver === true) {
      setAutoplay(true);
    }
  }, [introOver])

  const welcomeImage = (
    <div className={styles.welcomeSlide}>
      <img src='/images/logos/parkwayNewLogo2.webp' alt='Parkway Logo' className={styles.welcomeLogo} />
    </div>
  );
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
  );
  const storeLink = (
    <div className={styles.storeSlide}>
      <div className={styles.shirtContainer}>
        <img src="/images/store/redShirt.webp" alt="Red Shirt" className={styles.shirtImage} />
        <img src="/images/store/yellowShirt.webp" alt="Yellow Shirt" className={styles.shirtImage} />
        <img src="/images/store/blueShirt.webp" alt="Blue Shirt" className={styles.shirtImage} />
        <img src="/images/store/greenShirt.webp" alt="Green Shirt" className={styles.shirtImage} />
        <img src="/images/store/purpleShirt.webp" alt="Green Shirt" className={styles.shirtImage} />
      </div>
      <div className={styles.storeTextWrapper}>
        <p className={styles.schoolStoreText}>Looking for some new Parkway Academy spirit wear?
        Check out our spirit wear webstore for great shirts, hoodies and more!</p>
        <a href='https://teamlocker.squadlocker.com/#/lockers/parkway-sports-and-health-science-academy' className={styles.shopNow}>Visit Our School Store</a>
      </div>
    </div>
  );
  const archiveSlide = (
    <div className={styles.archiveSlide}>
      <div className={styles.archiveTextWrapper}>
        <h3
          className={`whiteSubTitle ${styles.archiveTitle}`}
          onClick={() => {router.push('/archive')}}
        >
          {`Parkway Archive`}
        </h3>
        <p>Parkway has a long and rich history serving students throughout La Mesa for decades. Check it out in the Parkway Archive!</p>
      </div>
      <div className={styles.archiveImageSectionWrapper}>
        <div className={styles.archiveImageWrapper}>
          <img src='/images/archive/photos/1.webp' alt='Parkway Historical' className={styles.archiveImage} onClick={() => {router.push('/archive')}}/>
          {/* <p className={styles.archiveImageCaption}>Parkway Circa 1963</p> */}
        </div>
      </div>
    </div>
  );
  const upcomingEvents = (
    <div className={styles.upcomingEventsSlide}>
      <a className={styles.viewAllEvents}>View All Events</a>
      <h2 className={`whiteSubTitle ${styles.upcomingEventsHeader}`}>Upcoming Events</h2>
      {events.length ?
        <table className={styles.eventsTable}>
          <tbody className={styles.eventsTableBody}>
            {events.map((event, index) => (
              <tr key={index} className={styles.eventsItem}>
                <td className={styles.eventDate}>{dateFormatter(event.date)} </td>
                <td className={styles.eventTitle}>{event.title}</td>
                <td className={styles.eventDescription}>{event.description}</td>
              </tr>
            ))}
          </tbody>
        </table> :
        <p>No upcoming events to show yet</p>

      }
    </div>
  );

  const slides= [welcomeImage, familyResourceCenter, archiveSlide, storeLink];

  // const slides= [welcomeImage];

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const toggleAutoplay = () => {
    if (!autoplay) {
      setCurrentPhotoIndex((prev) => prev === 4 ? 0 : (prev + 1));
    }
    setAutoplay(!autoplay);
  }


  const handleCarouselChange = (index) => {
    setCurrentPhotoIndex(index);
  };

  const customPrevArrow = (clickHandler, hasPrev) => (
    <FontAwesomeIcon icon={faChevronLeft} onClick={hasPrev ? clickHandler : null} className={hasPrev ? styles.arrowLeft : styles.arrowLeftDisabled} />
  );

  const customNextArrow = (clickHandler, hasNext) => (
    <FontAwesomeIcon icon={faChevronRight} onClick={hasNext ? clickHandler : () => handleCarouselChange(0)} className={hasNext ? styles.arrowRight : styles.arrowRightDisabled} />
  );

  return (
    <>
      <div className={styles.slideshowWrapper} >
        <div className={styles.autoplayWrapper}>
          <FontAwesomeIcon icon={autoplay ? faPause : faPlay} onClick={toggleAutoplay} className={styles.pauseButton} />
          <p>{autoplay ? '' : 'Autoplay off'}</p>
          </div>
        <Carousel
          autoPlay={autoplay}
          interval={5000}
          autoFocus={false}
          renderArrowPrev={customPrevArrow}
          renderArrowNext={customNextArrow}
          preventMovementUntilSwipeScrollTolerance={true}
          swipeScrollTolerance={50}
          emulateTouch={true}
          infiniteLoop={true}
          // dynamicHeight={false}
          showThumbs={false}
          showStatus={false}
          selectedItem={currentPhotoIndex}
          onChange={handleCarouselChange}
        >
          {slides.map((slide, index) => (
            <div key={index}>
              {slide}
            </div>
          ))}
        </Carousel>
      </div>
    </>
  );
}
