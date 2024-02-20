'use client'

import supabase from '../../../utils/supabase.js'
import { useEffect, useState } from 'react'
import styles from './view-posts.module.css'
import { useRouter } from 'next/navigation';


export default function ViewPosts () {
  const [posts, setPosts] = useState([])
  const [titleInput, setTitleInput] = useState('')
  const router = useRouter();

  useEffect(() => {
    const getPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
      if (error) { console.log(error) }
      console.log('data: ', data)
      const parsedData = data.map(post => {
        return {
          ...post,
          content: JSON.parse(post.content)
        };
      });
      console.log('parsedData: ', parsedData);
      setPosts(parsedData);
      }
    getPosts()
  }, [])

  useEffect(() => {
    console.log('posts: ', posts)
  }, [posts])

  const handleViewPostClick = (id) => {
    router.push(`/public/home?postId=${id}`)
  }

  if (!posts) { return (<h1>{`Loading`}</h1>)}
  if (posts.length === 0) { return (<h1>No posts yet!</h1>)}

  return (
    <>
    {posts.map((post, i) => {
      const date = new Date(post.created_at);
      const pacificTime = date.toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' });

      return (
        <div className={styles.postListingContainer} key={i}>
          <h2>{pacificTime || `No subtitle for this post`}</h2>
          <h1 key={i}>{post.content[0].content || `No title for this post`}</h1>
          <div className={styles.postControlMenu}>
          <button onClick={() => handleViewPostClick(post.id)}>View Post</button>
            <button>Edit Post</button>
            <button className={styles.deletePostButton}>Delete Post</button>
          </div>
        </div>
      )
    })}

  </>
  )
}