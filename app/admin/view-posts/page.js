'use client'

import supabase from '../../../utils/supabase.js'
import { useEffect, useState } from 'react'

export default function ViewPosts () {
  const [posts, setPosts] = useState([])
  const [titleInput, setTitleInput] = useState('')

  useEffect(() => {
    const getPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
    }
  }, [])

  // if (!posts) { return (<h1>{`Loading`}</h1>)}
  // if (posts.length === 0) { return (<h1>No posts yet!</h1>)}

  return (
    <>
    {/* posts.map((post, i) => {
      return (<h1 key={i}>{post.title || `No title for this post`}</h1>)
    }) */}
      <input
        value={titleInput}
        onChange={(e) => setTitleInput(e.target.value)}
        placeholder="Enter title"
        // className={styles.titleInput}
      />
  </>
  )
}