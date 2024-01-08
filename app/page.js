'use client';

import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Post from '../components/Post/Post';
import styles from './page.module.css'

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch('/api/getWordPressPosts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  useEffect(() => {
    console.log('posts: ', posts)
  }, [posts])



  if (loading) {
    return <div><FontAwesomeIcon icon={faSpinner} spin /> Loading...</div>;
  }

  if (!posts || posts.length === 0) {
    return <div>No posts found.</div>;
  }

  return (
    <div className='blogContainer'>
        {posts.map(post => (
          <div key={post.ID}>
              <Post postData={post} />
          </div>
        ))}
    </div>
  );
}

// // Function to get Unauthenticated posts
// const getPosts = async () => {
//   try {
//     const response = await fetch('https://public-api.wordpress.com/wp/v2/sites/timdobranski.wordpress.com/posts');
//     const data = await response.json();
//     setPosts(data);
//   } catch (error) {
//     console.error('Error fetching posts:', error);
//   } finally {
//     setLoading(false);
//   }
// };
