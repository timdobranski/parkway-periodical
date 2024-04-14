'use client'

import React, { useEffect, useState, Suspense } from 'react';
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



  const welcomeModal = (
    <div className={`${styles.introContainer} ${finishedLoading ? styles.fadeInFromWhite : styles.whiteBackground}`} onClick={() => setIntroRunning(false)}>
      {/* mobile logo */}
      <div className={styles.mobileLogo}>
        {/* {finishedLoading ? */}
          <AnimatedShield finishedLoading={finishedLoading}/>
          {/* : */}
          {/* <div className={styles.animationPlaceholder}
          >
          LOADING...
          </div> */}
        {/* } */}
      </div>
      {/* desktop logo */}
      <div className={styles.desktopLogoContainer}>
        <AnimatedShield finishedLoading={finishedLoading}/>
        <img
          src={'/images/logos/titledLogoNoShield.png'}
          alt='Intro Image'
          className={styles.logo}
        />
      </div>
      <h1 className={styles.enterButton}>{finishedLoading ? 'WELCOME!' : 'LOADING...' }</h1>
      {finishedLoading ? null : <p className={styles.clickToSkip}> {`(click to skip)`}</p>}
    </div>
  )



  return (
    <Suspense>
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
    </Suspense>
  );
}
