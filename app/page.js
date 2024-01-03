'use client';

import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/timdobranski.wordpress.com/posts/');
        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  if (loading) {
    return <div><FontAwesomeIcon icon={faSpinner} spin /> Loading...</div>;
  }

  if (!posts || posts.length === 0) {
    return <div>No posts found.</div>;
  }

  return (
    <div className='blogContainer'>
      <div className='blogPostsContainer'>
        {posts.map(post => (
          <div key={post.ID}>
            {/* <h2>{post.title}</h2> */}
            <div className='sectionContainer'>
              <h1>{post.title}</h1>
              {parse(post.content)}
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}
