'use client'

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import supabase from '../../../utils/supabase';


export default function NewPostPage () {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if there is a current session
    const session = supabase.auth.getSession();

    if (session) {
      setUser(session.user);
    } else {
      // If no user, redirect to login page
      router.push('/auth');
    }
  }, [router]);

  useEffect(() => {
    console.log('user in new post page: ', user);
  }, [user])

  if (!user) {
    return <div>Loading...</div>; // Or some other loading state
  }

  return (
    <div>
      <h1 className={styles.loginHeader}>New Post</h1>
      <form>
        <input
          type="text"
          placeholder="Title"
        />
        <textarea
          placeholder="Content"
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  )
}