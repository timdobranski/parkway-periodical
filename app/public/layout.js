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
import mobileLogo from '/public/images/logos/parkway.png';
import desktopLogo from '/public/images/logos/titledLogoThumb.png';

export default function Home({ children }) {
  const [posts, setPosts] = useState(null);
  const searchParams = useSearchParams();
  const postId = searchParams.get('postId');
  const skipIntro = searchParams.get('skipIntro');
  const [introRunning, setIntroRunning] = useState(true);
  const [windowWidth, setWindowWidth] = useState(undefined);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    // Set the initial width
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const skipIntroBool = Boolean(JSON.parse(skipIntro));
    console.log('SKIPINTROBOOL: ', skipIntroBool, typeof skipIntroBool)
    if (skipIntroBool === true) {
      setIntroRunning(false);
    }
  }, [skipIntro])

  useEffect(() => {
    console.log('INTRO RUNNING: ', introRunning)
  }, [introRunning])

  const welcomeModal = (
    <div className={styles.introContainer} onClick={() => setIntroRunning(false)}>
      <img
        src={'/images/logos/parkway.png'}
        alt='Intro Image'
        className={styles.mobileLogo}
      />
      <img
        src={'/images/logos/titledLogoThumb.png'}
        alt='Intro Image'
        className={styles.logo}
      />
      <h1 className={styles.enterButton}>ENTER</h1>
    </div>
  )



  return (
    <div className={styles.homeWrapper}>
      <Intro introRunning={introRunning} />
      { introRunning ? (welcomeModal) : null }
      { introRunning ? null :<Header skipAnimation={skipIntro}/>}
      { introRunning ? null :
       children
       }
      {/* { introRunning ? null : posts?.length > 0 ? (renderedPosts) : null} */}
    </div>
  );
}
