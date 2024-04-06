'use client'

import React, { useEffect, useState } from 'react';
import supabase from '../../../utils/supabase';
import styles from './home.module.css';
import Video from '../../../components/Video/Video';
import PhotoBlock from '../../../components/PhotoBlock/PhotoBlock';
import PrimeText from '../../../components/PrimeText/PrimeText';
import Intro from '../../../components/Intro/Intro';
import PostTitle from '../../../components/PostTitle/PostTitle';
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import Header from '../../../components/Header/Header';

export default function Home({ introRunning, setIntroRunning }) {
  const [posts, setPosts] = useState(null);
  const searchParams = useSearchParams();
  const postId = searchParams.get('postId');

  useEffect(() => {
    // Your existing useEffect for fetching posts
    getPosts();
  }, [postId]);
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
  // useEffect(() => {

  //   getPosts();
  // }, [postId]);

  useEffect(() => {
    console.log('INTRO RUNNING: ', introRunning)
  })

  const welcomePost = (
    <div className={styles.welcomePostWrapper}>
      <img src='/overhead.webp' alt='Parkway Logo' className='welcomeHeader' />
    </div>
  )

  const renderedPosts =
    <div className='feedWrapper'>
      {welcomePost}
      <div className={styles.filterWrapper}>
        <div className={styles.searchWrapper}>
          <input type='text' placeholder='Search for topics' className={styles.searchBar}/>
          <button className={styles.searchButton}>GO</button>
        </div>
        <select name='filter' id='filter' className={styles.filterSelect}>
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


      {posts &&
    posts.map((post, i) => (
      <div className='post' key={i}>
        {post.content.map((block, index) => (
          <React.Fragment key={index}>
            {block.type === 'title' && (
              <PostTitle
                src={block}
                author={JSON.parse(post.author)}
              />
            )
            }
            {block.type === 'text' && (
              <div className='blockWrapper'>
                {/* <div className={styles.postBody} dangerouslySetInnerHTML={{ __html: block.content }}></div> */}
                <PrimeText
                  textState={block.content}
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
            )
            }
            {block.type === 'video' && (
              <div className='blockWrapper'>
                {/* <Video
                  src={block}
                  isEditable={false}
                /> */}
                <iframe
                  src={block.content}
                  frameBorder="0"
                  allowFullScreen
                  title="Embedded video"
                  className={styles.video}
                  style={block.style}
                />
                <div className={styles.videoMobileWrapper}>
                  <iframe
                    src={block.content}
                    frameBorder="0"
                    allowFullScreen
                    title="Embedded video"
                    className={styles.videoMobile}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    ))}
    </div>


  return (
    <>
      { introRunning ? null : renderedPosts}
    </>
  );
}
