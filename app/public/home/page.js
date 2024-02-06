'use client'

import React, { useEffect, useState } from 'react';
import supabase from '../../../utils/supabase';
import styles from './home.module.css';
import Photo from '../../../components/PhotoBlock/PhotoBlock';
import Video from '../../../components/Video/Video';
import PhotoBlock from '../../../components/PhotoBlock/PhotoBlock';

export default function Home() {
  const [posts, setPosts] = useState(null);
  const activeBlock = null;
  useEffect(() => {
    const getPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('id', { ascending: false });
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
    <>
      {posts.map((post, i) => (
        <div className='post' key={i}>
          {post.content.map((block, index) => (
            <React.Fragment key={index}>
             {block.type === 'title' && (
              <div className='postTitleWrapper'>
                <div className='postTitle'>
                  {block.content}
                </div>
                <div className='postDate'>
                  {new Date().toLocaleDateString()} {/* Render the current date */}
                </div>
              </div>
            )
          }
              {block.type === 'text' && (
                <div className='blockWrapper'>
                  <div className={styles.postBody} dangerouslySetInnerHTML={{ __html: block.content }}></div>
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
                  <Video src={block.content} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      ))}
      </>
  );

}
