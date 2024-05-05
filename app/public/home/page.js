'use client'

import React, { useEffect, useState } from 'react';
import supabase from '../../../utils/supabase';
import styles from './home.module.css';
import Video from '../../../components/Video/Video';
import PhotoBlock from '../../../components/PhotoBlock/PhotoBlock';
import PhotoCarousel from '../../../components/PhotoCarousel/PhotoCarousel';
import PrimeText from '../../../components/PrimeText/PrimeText';
import WelcomeSlideshow from '../../../components/WelcomeSlideshow/WelcomeSlideshow';
import Intro from '../../../components/Intro/Intro';
import PostTitle from '../../../components/PostTitle/PostTitle';
import { format } from 'date-fns';
import dateFormatter from '../../../utils/dateFormatter';
import { useSearchParams } from 'next/navigation';
import Header from '../../../components/Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChevronLeft, faShare, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

export default function Home({ introRunning, setIntroRunning }) {
  const [posts, setPosts] = useState(null);
  const searchParams = useSearchParams();
  const postId = searchParams.get('postId');
  const [searchQuery, setSearchQuery] = useState(null);
  const [searchExpanded, setSearchExpanded] = useState(false);

  // const skipIntro = useSearchParams('skipIntro');
  // const [introRunning, setIntroRunning] = useState(true);

  // get and parse post data
  const getPosts = async () => {
    let query = supabase
      .from('posts')
      .select('*');

    if (postId) {
      query = query.eq('id', postId);
    } else {
      query = query.order('id', { ascending: false });
    }

    const { data, error } = await query;
    if (data) {
      const parsedData = data.map(post => ({
        ...post,
        content: JSON.parse(post.content)
      }));
      setPosts(parsedData);
    }

    if (error) {
      console.error('Error fetching posts:', error);
    }
  };
  useEffect(() => {

    getPosts();
  }, [postId]);

  useEffect(() => {
    console.log('INTRO RUNNING: ', introRunning)
  })

  const filterAndSearchPosts = (
    <div className={styles.filterWrapper}>
      <div className={styles.searchWrapper}>
        <FontAwesomeIcon icon={searchExpanded ? faChevronLeft : faMagnifyingGlass} className={searchExpanded ? styles.searchIconExpanded : styles.searchIcon} onClick={() => setSearchExpanded(!searchExpanded)} />
        <input
          type='search'
          placeholder='Search for topics'
          className={searchExpanded ? styles.searchBarExpanded : styles.searchBar}/>

        <p className={styles.searchStatus} style={ searchQuery ? {display: 'inline-block'} : {display: 'none'}}>{`Results for ${searchQuery}`}</p>
      </div>
      <select name='filter' id='filter'
        className={`${styles.filterSelect}
        `}
      >
        <option value="" disabled selected hidden>Browse Posts</option>
        <option value='all'>All Departments</option>
        <option value='sports'>Sports</option>
        <option value='health'>Science</option>
        <option value='science'>Music</option>
        <option value='academics'>Math</option>
        <option value='academics'>English</option>
        <option value='academics'>Social Science</option>
        <option value='academics'>Extracurriculars</option>
        <option value='academics'>2024/25 School Year</option>
      </select>
    </div>
  )
  const renderedPosts =
    <div className={styles.feedWrapperContainer}>
    {/* <div className='topFeedShadow'></div> */}
    <div className='feedWrapper'>
      <WelcomeSlideshow />
      {filterAndSearchPosts}


      {posts &&
    posts.map((post, i) => (
      <div className='post' key={i}>
        {post.content.map((block, index) => (
          <React.Fragment key={index}>
            {block.type === 'title' && (
              <PostTitle
                src={block}
                authorId={post.author}
                id={post.id}
                viewContext='view'
              />
            )
            }
            {block.type === 'text' && (
              <div className='blockWrapper'>
                <PrimeText
                  src={block}
                  viewContext='view'
                />
              </div>
            )}
            {block.type === 'photo' && (
              <div className='blockWrapper'>
                <PhotoBlock
                // key={index}
                // blockIndex={index}
                // updatePhotoContent={(files) => updatePhotoContent(index, files)}
                  isEditable={false}
                  src={block}
                // setActiveBlock={setActiveBlock}
                />
              </div>
            )}
            {block.type === 'carousel' && (
              <div className='blockWrapper'>
                <PhotoCarousel
                  photos={block.content}
                />
              </div>
            )}
            {block.type === 'video' && (
              <div className='blockWrapper'>
                <Video
                  src={block}
                />
              </div>
            )}
          </React.Fragment>
        ))}
        <div className={styles.postFooter}>
          <div className={styles.shareWrapper}>
          <FontAwesomeIcon icon={faCalendarDays} className={styles.shareIcon} />

            <p className={styles.createdAt}>{dateFormatter(post.created_at)}</p>
          </div>
          <div className={styles.shareWrapper}>
            <FontAwesomeIcon icon={faShare} className={styles.shareIcon} />
            <p className={styles.shareLabel}>Share</p>
          </div>
        </div>
      </div>

    ))}
      </div>
    </div>


  return (
    <>
      { introRunning ? null : renderedPosts}
    </>
  );
}
