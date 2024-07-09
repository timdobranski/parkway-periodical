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
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [photosOrArticles, setPhotosOrArticles] = useState('photos');
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
  const newsArticles = [
    {
      src: '/images/articles/article1.webp',
      title: `Parkway Jr. Hi Start This Year`,
      caption: `A completion date of April 1961 is hoped for the Parkway Junior High School
      to be built on Dallas street, adjacent to Fletcher Parkway, in north La Mesa, Dr. Ted Dixon, asspciate superintendent of the
      La Mesa-Spring Valley School District, said today. Construction may be able to start in July, Dixon said, depending on final approval
      and apportionment of funds from the state before a contract can be awarded. Archetect for the project is Clyde Hufbauer.
      Originally the junior high school was not scheduled to be built until 1961 or 1962, Dixon said. Date of construction was moved
      up because of a tremendous influx of residents, necessitating speeded up planning.`
    },
    {
      src: '/images/articles/article1.webp',
      title: `Parkway Jr. Hi Start This Year`,
      caption: `A completion date of April 1961 is hoped for the Parkway Junior High School
      to be built on Dallas street, adjacent to Fletcher Parkway, in north La Mesa, Dr. Ted Dixon, asspciate superintendent of the
      La Mesa-Spring Valley School District, said today. Construction may be able to start in July, Dixon said, depending on final approval
      and apportionment of funds from the state before a contract can be awarded. Archetect for the project is Clyde Hufbauer.
      Originally the junior high school was not scheduled to be built until 1961 or 1962, Dixon said. Date of construction was moved
      up because of a tremendous influx of residents, necessitating speeded up planning.`
    },
    {
      src: '/images/articles/article1.webp',
      title: `Parkway Jr. Hi Start This Year`,
      caption: `A completion date of April 1961 is hoped for the Parkway Junior High School
      to be built on Dallas street, adjacent to Fletcher Parkway, in north La Mesa, Dr. Ted Dixon, asspciate superintendent of the
      La Mesa-Spring Valley School District, said today. Construction may be able to start in July, Dixon said, depending on final approval
      and apportionment of funds from the state before a contract can be awarded. Archetect for the project is Clyde Hufbauer.
      Originally the junior high school was not scheduled to be built until 1961 or 1962, Dixon said. Date of construction was moved
      up because of a tremendous influx of residents, necessitating speeded up planning.`
    }
  ]
  const items = photosOrArticles === 'photos' ? archivePhotos : newsArticles;
  const activeIndex = photosOrArticles === 'photos' ? currentPhotoIndex : currentArticleIndex;

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
          <p className={`${photosOrArticles === 'photos' ? styles.active : styles.inactive}`} onClick={() => setPhotosOrArticles('photos')}>HISTORIC PHOTOS</p>
          <p className={`${photosOrArticles === 'articles' ? styles.active : styles.inactive}`} onClick={() => setPhotosOrArticles('articles')}>NEWS ARTICLES</p>
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
            showStatus={false}
            selectedItem={activeIndex}
            onChange={handleCarouselChange}
          >
            {

              items?.map((photo, index) => (
                <>
                  <div key={index} className={styles.carouselSlide}>
                    <img
                      src={photo.src}
                      alt={`Photo ${index}`}
                      className={styles.slideImg}
                      onContextMenu="return false;"
                    />
                    {items[activeIndex].title && <p className={`centeredWhiteText ${styles.archivePhotoTitle}`}>{items[activeIndex].title}</p>}
                    <p className={`centeredWhiteText ${styles.archivePhotoCaption}`}>{items[activeIndex].caption}</p>
                  </div>
                </>
              ))}
          </Carousel>
          <a href={'https://lamesahistory.com/'} target="_blank" rel="noopener noreferrer">
            <img src='/images/laMesaHistoryCenter.webp' className={styles.historyCenterLogo}/>
          </a>
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