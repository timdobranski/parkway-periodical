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
  const [tagId, setTagId] = useState(null)
  const [searchQuery, setSearchQuery] = useState(null);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [displayType, setDisplayType] = useState('all') // options are: all, id, tag, search
  const postTags = [
    {name: 'All Departments', value: 'all'},
    {name: 'Sports', value: 1},
    {name: 'Science', value: 2},
    {name: 'Electives', value: 3},
    {name: 'Math', value: 4},
    {name: 'Language Arts', value: 5},
    {name: 'Before/After School', value: 6},
    {name: 'Next School Year', value: 7},
    {name: 'Social Studies', value: 8},
    {name: 'Counciling & Wellness', value: 9},
  ]
  // const skipIntro = useSearchParams('skipIntro');
  // const [introRunning, setIntroRunning] = useState(true);

  // get and parse post data
  const getPosts = async ({ tagId, searchQuery, postId } = {}) => {
    let query = supabase
      .from('posts')
      .select('*');

    if (tagId) {
      setDisplayType('tag');
      // Fetch post IDs from post_tags where tag_id matches
      const { data, error: postTagError } = await supabase
        .from('post_tags')
        .select('post')
        .eq('tag', tagId);

      if (postTagError) {
        console.error('Error fetching post tags:', postTagError);
        return;
      }
      const postTagData = data;
      const postIds = postTagData.map(pt => pt.post);
      query = query.in('id', postIds);
    } else if (searchQuery) {
      setDisplayType('search');
      query = query.ilike('searchableText', `%${searchQuery}%`);
    } else if (postId) {
      setDisplayType('id');
      query = query.eq('id', postId);
    } else {
      setDisplayType('all');
      query = query.order('id', { ascending: false });
    }

    const { data, error } = await query;
    if (data) {
      const parsedData = data.map(post => ({
        ...post,
        content: JSON.parse(post.content)
      }));

      // console.log('new posts state: ', parsedData);
      setPosts(parsedData);
    }

    if (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    console.log('display type changed: ', displayType);
  }, [displayType])

  useEffect(() => {
    getPosts({tagId: tagId});
  }, [tagId]);

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setTagId(value === 'all' ? null : parseInt(value));
  };

  const noResultsMessage = (
    <p className='centeredWhiteText'>{`It looks like there aren't any posts for this ${displayType === 'search' ? 'search' : 'category'} yet`}</p>
  )
  const resetPosts = () => {
    setTagId(null);
    setSearchQuery(null);
    getPosts();
  }

  const filterAndSearchPosts = (
    <div className={styles.filterWrapper}>
      <div className={styles.searchWrapper}>
        <FontAwesomeIcon
          icon={searchExpanded ? faChevronLeft : faMagnifyingGlass}
          className={searchExpanded ? styles.searchIconExpanded : styles.searchIcon}
          onClick={() => setSearchExpanded(!searchExpanded)} />
        <input
          type='search'
          placeholder='Search for topics'
          className={searchExpanded ? styles.searchBarExpanded : styles.searchBar}/>

        <p className={styles.searchStatus} style={ searchQuery ? {display: 'inline-block'} : {display: 'none'}}>{`Results for ${searchQuery}`}</p>
      </div>
      <select name='filter' id='filter' value={tagId || 'all'}
        className={`${styles.filterSelect}`}
        onChange={handleFilterChange}
      >
        {postTags.map(tag => (
          <option key={tag.value} value={tag.value}>{tag.name}</option>
        ))}
      </select>
    </div>
  )
  const renderedPosts =
    <div className={styles.feedWrapperContainer}>
      {/* <div className='topFeedShadow'></div> */}
      <div className='feedWrapper'>
        <WelcomeSlideshow />
        {filterAndSearchPosts}
        {displayType === 'tag' && tagId &&
        <>
          <p className={styles.viewingPostsMessage}>{`Viewing posts tagged as `}
          <span className={styles.tagLabel}>
            {postTags.find(tag => tag.value === tagId).name}
          </span>
          </p>
          {posts.length === 0 && noResultsMessage}
          <button className={styles.viewStatusButton} onClick={resetPosts}>View All Posts</button>
        </>
        }

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
                  photo={block.content[0]}
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
          <div className={styles.createdAtWrapper}>
            <FontAwesomeIcon icon={faCalendarDays} className={styles.createdAtIcon} />
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
