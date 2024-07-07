'use client'

import styles from './archive.module.css';
import { useEffect, useState } from 'react';
import supabase from '../../../utils/supabase';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function Archive() {
  const [schoolYears, setSchoolYears] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const archivePhotos = [
    {
      src: '/images/archive/1.webp',
      caption: `Parkway Middle School Construction, 1960s. The office building now at the center of the campus originally marked the front entrance of the school.
      Other buildings were added over the years, extending the entrance further outward until the office was in the center rather than the front of the school.`
    },
    {
      src: '/images/archive/1.webp',
      caption: 'Parkway Middle School Construction, 1960s'
    },
    {
      src: '/images/archive/1.webp',
      caption: 'Parkway Middle School Construction, 1960s'
    }

  ]

  useEffect(() => {
    const getSchoolYears = async () => {
      const { data, error } = await supabase
        .from('school_years')
        .select('*');

      if (error) {
        console.error('Error fetching school years:', error);
      }

      if (data) {
        console.log('school years data:', data)
        setSchoolYears(data);
      }
    }
    getSchoolYears();
  }, []);

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
  const handleCarouselChange = (index) => {
    setCurrentPhotoIndex(index);
  };


  return (
    <div className='feedWrapper'>
      <div className='slideUp'>
        <h1 className='whiteTitle'>ARCHIVE</h1>
        <a href={'https://lamesahistory.com/'} target="_blank" rel="noopener noreferrer">
          <img src='/images/laMesaHistoryCenter.webp' className={styles.historyCenterLogo}/>
        </a>
        <p className='centeredWhiteText'>{`Here you can explore Parkway's history, from the first years of the school to the present day.
        The slideshow below explores photos and events throughout Parkway's history in La Mesa.`}</p>
        <p className={`centeredWhiteText ${styles.endOfIntroParagraph}`}>
        {`The photos and articles displayed here were kindly provided to us by the La Mesa History Center. You can learn more about them `}
          <a href="https://lamesahistory.com/" target="_blank" rel="noopener noreferrer" className={styles.historyCenterLink}>here</a>.
        </p>



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
          {archivePhotos?.map((photo, index) => (
            <div key={index} className={styles.carouselSlide}>
              <img
                src={photo.src}
                alt={`Photo ${index}`}
                className={styles.slideImg}
                onContextMenu="return false;"
              />
            </div>
          ))}
        </Carousel>
          <p className={`centeredWhiteText ${styles.archivePhotoCaption}`}>{archivePhotos[currentPhotoIndex].caption}</p>


        <label className={`whiteSubTitle ${styles.selectSchoolYearLabel}`}>Periodical Archive</label>
        <p className={`centeredWhiteText ${styles.endOfIntroParagraph}`}>
        {`Here you can browse prior years of Parkway Periodicals' posts. Select a school year from the dropdown below to view archived posts from that year.`}
        </p>
        <select className={styles.select}>
          {!schoolYears.length && <option value="No School Years To Show Yet">No School Years To View Yet</option>}
        </select>
        {!schoolYears.length && <p className={'centeredWhiteText'}>{`Since this is the first year of the Parkway Periodical, we don't have any archived school years yet!`}</p>}
      </div>
    </div>

  )

}