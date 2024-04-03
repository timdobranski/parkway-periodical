'use client'

import React, { useEffect, useState } from 'react';
import supabase from '../../utils/supabase';
import styles from './page.module.css';
import Video from '../../components/Video/Video';
import PhotoBlock from '../../components/PhotoBlock/PhotoBlock';
import PrimeText from '../../components/PrimeText/PrimeText';
import Intro from '../../components/Intro/Intro';
import PostTitle from '../../components/PostTitle/PostTitle';
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation'
import Header from '../../components/Header/Header';


export default function Home({ children }) {
  const [posts, setPosts] = useState(null);
  const searchParams = useSearchParams();
  const postId = searchParams.get('postId');
  const skipIntro = searchParams.get('skipIntro');
  const [introRunning, setIntroRunning] = useState(true);


  useEffect(() => {
    console.log('SKIPINTRO: ', skipIntro, typeof skipIntro)
    if (skipIntro === 'true') {
      setIntroRunning(Boolean(JSON.parse(false)));
    }
  }, [skipIntro])

  const welcomeModal = (
    <div className={styles.introContainer} onClick={() => setIntroRunning(false)}>
      <img src='../../images/logos/titledLogoThumb.png' alt='Intro Image' className={styles.titledLogo} />
      <h1 className={styles.enterButton}>ENTER</h1>
    </div>
  )



  return (
    <div className={styles.homeWrapper}>
      <Intro introRunning={introRunning} />
      { introRunning ? (welcomeModal) : null }
      { introRunning ? null :<Header />}
      { introRunning ? null : children}
      {/* { introRunning ? null : posts?.length > 0 ? (renderedPosts) : null} */}
    </div>
  );
}
