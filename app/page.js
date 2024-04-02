'use client'

import React, { useEffect, useState } from 'react';
import supabase from '../utils/supabase';
import styles from './page.module.css';
import Video from '../components/Video/Video';
import PhotoBlock from '../components/PhotoBlock/PhotoBlock';
import PrimeText from '../components/PrimeText/PrimeText';
import Intro from '../components/Intro/Intro';
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation'
import Header from '../components/Header/Header';


export default function Home() {
  const [posts, setPosts] = useState(null);
  // const activeBlock = null;
  const searchParams = useSearchParams();
  const postId = searchParams.get('postId');
  const [introRunning, setIntroRunning] = useState(true);

  // get and parse post data
  useEffect(() => {
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

    getPosts();
  }, [postId]);

  const welcomeModal = (
    <div className={styles.introContainer} onClick={() => setIntroRunning(false)}>
      <img src='../../images/logos/titledLogoThumb.png' alt='Intro Image' className={styles.titledLogo} />
      <h1 className={styles.enterButton}>ENTER</h1>
    </div>
  )

  const renderedPosts =
  <div className='feedWrapper'>
    {posts &&
    posts.map((post, i) => (
      <div className='post' key={i}>
        {post.content.map((block, index) => (
          <React.Fragment key={index}>
            {block.type === 'title' && (
              <div className='postTitleWrapper'>
                <div className='postTitle'>
                  {block.content}
                </div>
                <div className='postDate'>
                  {format(new Date(post.created_at), 'MMMM do, yyyy')}
                </div>
              </div>
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
                <Video
                  src={block}
                  isEditable={false}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    ))}
  </div>

  return (
    <div className={styles.homeWrapper}>
      <Intro/>
      { introRunning ? (welcomeModal) : null }
      { introRunning ? null :<Header />}
      { introRunning ? null : posts.length > 0 ? (renderedPosts) : null}
    </div>
  );
}
