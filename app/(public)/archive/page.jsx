/* eslint-disable @next/next/no-img-element */
'use client'

import styles from './archive.module.css';
import { useEffect, useState, Fragment } from 'react';
import { createClient } from '../../../utils/supabase/client';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import archiveData from './archiveData';
import PostTitle from '../../../components/PostTitle/PostTitle';
import PrimeText from '../../../components/PrimeText/PrimeText';
import PhotoBlock from '../../../components/PhotoBlock/PhotoBlock';
import PhotoCarousel from '../../../components/PhotoCarousel/PhotoCarousel';
import Video from '../../../components/Video/Video';
import ContentLayout from '../../../components/ContentLayout/ContentLayout';
import dateFormatter from '../../../utils/dateFormatter';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

export default function Archive() {
  const supabase = createClient();
  const { archivePhotos, newsArticles } = archiveData;
  const [schoolYears, setSchoolYears] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [archivedPosts, setArchivedPosts] = useState([]);
  const [loadingArchivedPosts, setLoadingArchivedPosts] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [photosOrArticles, setPhotosOrArticles] = useState('photos');
  // const [expandedPhotoCaption, setExpandedPhotoCaption] = useState(false);
  // const [expandedArticleCaption, setExpandedArticleCaption] = useState(false);

  const items = photosOrArticles === 'photos' ? archivePhotos : newsArticles;
  const activeIndex = photosOrArticles === 'photos' ? currentPhotoIndex : currentArticleIndex;


  useEffect(() => {
    const getSchoolYears = async () => {
      const { data, error } = await supabase
        .from('school_years')
        .select('label, is_current')
        .order('label', { ascending: false });

      if (error) {
        console.error('Error fetching school years:', error);
        return;
      }

      const years = data || [];
      setSchoolYears(years);

      const defaultYear = years.find((y) => !y.is_current)?.label || years[0]?.label || '';
      setSelectedSchoolYear(defaultYear);
    };

    getSchoolYears();
  }, []);

  useEffect(() => {
    const fetchArchivedPosts = async () => {
      if (!selectedSchoolYear) {
        setArchivedPosts([]);
        return;
      }

      setLoadingArchivedPosts(true);
      const { data, error } = await supabase
        .from('posts')
        .select('id, content, author, created_at, sortOrder')
        .eq('schoolYear', selectedSchoolYear)
        .order('sortOrder', { ascending: false })
        .order('id', { ascending: false });

      if (error) {
        console.error('Error fetching archived posts:', error);
        setArchivedPosts([]);
        setLoadingArchivedPosts(false);
        return;
      }

      const parsed = (data || []).map((post) => ({
        ...post,
        content: typeof post.content === 'string' ? JSON.parse(post.content) : post.content,
      }));

      setArchivedPosts(parsed);
      setLoadingArchivedPosts(false);
    };

    fetchArchivedPosts();
  }, [selectedSchoolYear]);

  useEffect(() => {

  }, [currentArticleIndex])

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
    // photosOrArticles === 'photos' ? setCurrentPhotoIndex(false) : setCurrentArticleIndex(false);

    photosOrArticles === 'photos' ? setCurrentPhotoIndex(index) : setCurrentArticleIndex(index);
  };


  return (
    <div className='feedWrapper'>
      <div className='slideUp'>
        <h1 className='whiteTitle'>ARCHIVE</h1>

        <p className='centeredWhiteText'>{`Here you can explore Parkway's history, from the first years of the school to the present day.
        The slideshow below explores photos and events throughout Parkway's history in La Mesa.`}</p>
        <p className={`centeredWhiteText ${styles.endOfIntroParagraph}`}>
          {`The photos and articles displayed here were kindly provided to us by generous alumni of Parkway and the La Mesa History Center. You can learn more about the La Mesa
          History Center `}
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
            showStatus={false}
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

                    {(items[activeIndex].title || items[activeIndex].caption) &&

                    <div className={`${styles.captionAndTitleWrapper}`}
                    // onClick={photosOrArticles === 'photos' ?
                    //   () => setExpandedPhotoCaption(expandedPhotoCaption === index ? false : index) :
                    //   () => setExpandedArticleCaption(expandedArticleCaption === index ? false : index)}
                    >
                      {items[activeIndex].title &&
                      <>
                        <p className={`centeredWhiteText ${styles.archivePhotoTitle}`}>{items[activeIndex].title}</p>
                        <p className={styles.articleMetadata}>{`${items[activeIndex].date} via ${items[activeIndex].source}`}</p>
                      </>
                      }
                      <p className={`centeredWhiteText ${styles.archivePhotoCaption}`}>
                        {items[activeIndex].caption}
                      </p>
                    </div>}

                  </div>
                </Fragment>
              ))}
          </Carousel>
        </div>

        <label className={`whiteSubTitle ${styles.selectSchoolYearLabel}`}>Periodical Archive</label>
        <p className={`centeredWhiteText ${styles.endOfIntroParagraph}`}>
          {`Browse prior years of Parkway Periodicals' posts below. Select a school year from the dropdown menu below to view archived posts from that year.`}
        </p>

        <select
          className={styles.select}
          value={selectedSchoolYear}
          onChange={(e) => setSelectedSchoolYear(e.target.value)}
        >
          {!schoolYears.length && <option value="">No School Years To View Yet</option>}
          {schoolYears.map((y) => (
            <option key={y.label} value={y.label}>
              {y.label}{y.is_current ? ' (Current)' : ''}
            </option>
          ))}
        </select>

        {schoolYears.filter((y) => !y.is_current).length === 0 && (
          <p className={'centeredWhiteText'}>
            {`Since this is the first year of the Parkway Periodical, we don't have any archived school years yet!`}
          </p>
        )}

        {loadingArchivedPosts && (
          <p className={'centeredWhiteText'}>{`Loading posts...`}</p>
        )}

        {!loadingArchivedPosts && selectedSchoolYear && archivedPosts.length === 0 && (
          <p className={'centeredWhiteText'}>{`No posts found for ${selectedSchoolYear}.`}</p>
        )}

        {!loadingArchivedPosts && archivedPosts.map((post, i) => (
          <div className='post' key={i}>
            {post.content?.map((block, index) => (
              <Fragment key={index}>
                {block.type === 'title' && (
                  <PostTitle src={block} authorId={post.author} id={post.id} viewContext='view' />
                )}
                {block.type === 'text' && (
                  <div className='blockWrapper'>
                    <PrimeText src={block} viewContext='view' />
                  </div>
                )}
                {block.type === 'photo' && (
                  <div className='blockWrapper'>
                    <PhotoBlock isEditable={false} photo={block.content[0]} />
                  </div>
                )}
                {block.type === 'carousel' && (
                  <div className='blockWrapper'>
                    <PhotoCarousel photos={block.content} />
                  </div>
                )}
                {block.type === 'video' && (
                  <div className='blockWrapper'>
                    <Video video={block.content[0]} />
                  </div>
                )}
                {block.type === 'flexibleLayout' && (
                  <ContentLayout
                    block={block}
                    viewContext='view'
                    orientation='horizontal'
                  />
                )}
              </Fragment>
            ))}

            <div className={styles.postFooter}>
              <div className={styles.createdAtWrapper}>
                <FontAwesomeIcon icon={faCalendarDays} className={styles.createdAtIcon} />
                <p className={styles.createdAt}>{dateFormatter(post.created_at)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  )

}