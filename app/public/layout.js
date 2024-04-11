'use client'

import React, { useEffect, useState } from 'react';
import styles from './layout.module.css';
import Intro from '../../components/Intro/Intro';
import AnimatedShield from '../../components/AnimatedShield/AnimatedShield';
import { useSearchParams } from 'next/navigation'
import Header from '../../components/Header/Header';


export default function Home({ children }) {
  const [posts, setPosts] = useState(null);
  const searchParams = useSearchParams();
  const postId = searchParams.get('postId');
  const skipIntro = searchParams.get('skipIntro');
  const [introRunning, setIntroRunning] = useState(true);
  // const [windowWidth, setWindowWidth] = useState(undefined);
  const [finishedLoading, setFinishedLoading] = useState(false);

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
    <div className={`${styles.introContainer} ${finishedLoading ? styles.fadeInFromWhite : styles.whiteBackground}`} onClick={() => setIntroRunning(false)}>
      {/* <img
        src={'/images/logos/parkway.png'}
        alt='Intro Image'
        className={styles.mobileLogo}
      /> */}
      {finishedLoading ? <AnimatedShield finishedLoading={finishedLoading}/> : <div className={styles.animationPlaceholder}>LOADING...</div>}
      <img
        src={'/images/logos/titledLogoThumb.png'}
        alt='Intro Image'
        className={styles.logo}
      />
      <h1 className={styles.enterButton}>{finishedLoading ? 'WELCOME!' : '' }</h1>
      {finishedLoading ? null : <p className={styles.clickToSkip}> {`(click to skip)`}</p>}
    </div>
  )



  return (
    <div>
      <Intro
        introRunning={introRunning}
        setFinishedLoading={setFinishedLoading}
      />
      { introRunning ? (welcomeModal) : null }
      { introRunning ? null : <Header skipAnimation={skipIntro} introRunning={introRunning}/>}
      { introRunning ? null :
        children
      }
    </div>
  );
}
