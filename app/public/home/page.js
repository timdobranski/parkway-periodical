'use client'

import React, { useEffect, useState } from 'react';
import supabase from '../../../utils/supabase';
import styles from './home.module.css';
import Photo from '../../../components/Photo/Photo';
import Video from '../../../components/Video/Video';

export default function Home() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*');
      console.log('data: ', data);

      const parsedData = data.map(post => {
        return {
          ...post,
          content: JSON.parse(post.content)
        };
      });
      console.log('parsedData: ', parsedData);
      setPosts(parsedData);
    };
    getPosts();
  }, []);


  if (!posts || posts.length === 0) {
    return <div className='post'>No posts to display yet!</div>;
  }

  return (
    <div className='publicPageWrapper'>
      {posts.map((post, i) => (
        <div className='post' key={i}>
          {post.content.map((block, index) => (
            <React.Fragment key={index}>
              {block.type === 'text' && (
                <div className={styles.postBody} dangerouslySetInnerHTML={{ __html: block.content }}></div>
              )}
              {block.type === 'photo' && (
                <Photo
                  isEditable={index === activeBlock}
                  src={block.content.src} // Assuming block.content is an object with src property
                  format={block.format || 'grid'}
                />
              )}
              {block.type === 'video' && (
                <Video
                  src={block.content}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );

}
