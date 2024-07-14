'use client'

import styles from './archive.module.css';
import { useEffect, useState, Fragment } from 'react';
import { createClient } from '../../../utils/supabase/client';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import archiveData from './archiveData';

export default function Archive() {
  const supabase = createClient();
  const { archivePhotos, newsArticles } = archiveData;
  const [schoolYears, setSchoolYears] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [photosOrArticles, setPhotosOrArticles] = useState('photos');

  const items = photosOrArticles === 'photos' ? archivePhotos : newsArticles;
  const activeIndex = photosOrArticles === 'photos' ? currentPhotoIndex : currentArticleIndex;


  // useEffect(() => {
  //   const getSchoolYears = async () => {
  //     const { data, error } = await supabase
  //       .from('school_years')
  //       .select('*');

  //     if (error) {
  //       console.error('Error fetching school years:', error);
  //     }

  //     if (data) {
  //       console.log('school years data:', data)
  //       setSchoolYears(data);
  //     }
  //   }
  //   getSchoolYears();
  // }, []);

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
    photosOrArticles === 'photos' ? setCurrentPhotoIndex(index) : setCurrentArticleIndex(index);
  };


  return (
    <div className='feedWrapper'>
      <div className='slideUp'>
        <h1 className='whiteTitle'>ARCHIVE</h1>

        <p className='centeredWhiteText'>{`Here you can explore Parkway's history, from the first years of the school to the present day.
        The slideshow below explores photos and events throughout Parkway's history in La Mesa.`}</p>
        <p className={`centeredWhiteText ${styles.endOfIntroParagraph}`}>
          {`The photos and articles displayed here were kindly provided to us by the La Mesa History Center. You can learn more about them `}
          <a href="https://lamesahistory.com/" target="_blank" rel="noopener noreferrer" className={styles.historyCenterLink}>here</a>.
        </p>

        <div className={styles.photosOrArticlesWrapper}>
          <p className={`${photosOrArticles === 'photos' ? styles.active : styles.inactive} ${styles.historicPhotos}`} onClick={() => setPhotosOrArticles('photos')}>HISTORIC PHOTOS</p>
          <a href={'https://lamesahistory.com/'} target="_blank" rel="noopener noreferrer">
            <img src='/images/laMesaHistoryCenter.webp' className={styles.historyCenterLogo}/>
          </a>
          <p className={`${photosOrArticles === 'articles' ? styles.active : styles.inactive} ${styles.newsArticles}`} onClick={() => setPhotosOrArticles('articles')}>NEWS ARTICLES</p>
        </div>
        <div className={styles.archiveCarouselWrapper}>
          <Carousel
            renderArrowPrev={customPrevArrow}
            renderArrowNext={customNextArrow}
            preventMovementUntilSwipeScrollTolerance={true}
            swipeScrollTolerance={50}
            emulateTouch={true}
            dynamicHeight={false}
            autoPlay={false}
            showThumbs={false}
            showStatus={true}
            showIndicators={false}
            selectedItem={activeIndex}
            onChange={handleCarouselChange}
          >
            {
              items?.map((photo, index) => (
                <Fragment key={index}>
                  <div className={styles.carouselSlide}>
                    <img
                      src={photo.src}
                      alt={`Photo ${index}`}
                      className={styles.slideImg}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                    {
                    items[activeIndex].title &&
                    <>
                      <p className={`centeredWhiteText ${styles.archivePhotoTitle}`}>{items[activeIndex].title}</p>
                      <p className={styles.articleMetadata}>{`${items[activeIndex].date} via ${items[activeIndex].source}`}</p>
                    </>
                    }
                    <p className={`centeredWhiteText ${styles.archivePhotoCaption}`}>{items[activeIndex].caption}</p>
                  </div>
                </Fragment>
              ))}
          </Carousel>
        </div>

        <label className={`whiteSubTitle ${styles.selectSchoolYearLabel}`}>Periodical Archive</label>
        <p className={`centeredWhiteText ${styles.endOfIntroParagraph}`}>
          {`Browse prior years of Parkway Periodicals' posts below. Select a school year from the dropdown menu below to view archived posts from that year.`}
        </p>
        <select className={styles.select}>
          {!schoolYears.length && <option value="No School Years To Show Yet">No School Years To View Yet</option>}
        </select>
        {!schoolYears.length && <p className={'centeredWhiteText'}>{`Since this is the first year of the Parkway Periodical, we don't have any archived school years yet!`}</p>}
      </div>
    </div>

  )

}