'use client'

import React, { useEffect, useState, Suspense } from 'react';
import styles from './layout.module.css';
import BackgroundGallery from '../../components/BackgroundGallery/BackgroundGallery.jsx';
import AnimatedShield from '../../components/AnimatedShield/AnimatedShield';
import { useSearchParams } from 'next/navigation'
import Header from '../../components/Header/Header';
import { usePathname } from 'next/navigation'


export default function Home({ children }) {
  const [introRunning, setIntroRunning] = useState(true);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState(0);
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const playIntro = searchParams.get('intro');
  const [progress, setProgress] = useState(0);


  useEffect(() => {
    const newProgress = Math.floor((loadedImages / 72) * 100);
    setProgress(newProgress);
  }, [loadedImages]);

  useEffect(() => {
    console.log('PLAY INTRO: ', playIntro)
    if (!playIntro || playIntro && playIntro !== 't') {
      setIntroRunning(false)
    }
  }, [playIntro])

  useEffect(() => {
    console.log('introRunning is... ',  introRunning)
  }, [introRunning])


  const loadingBar = (
    <div className={styles.loadingBarContainer}>
      <div className={styles.loadingBar} style={{width: `${progress}%` }}></div>
      <p>{progress}%</p>
    </div>
  )



  const welcomeModal = (
    <div
      className={`${styles.introContainer} ${finishedLoading ? (introRunning ? styles.fadeInFromWhite : '') : styles.whiteBackground}`}
      onClick={() => setIntroRunning(false)}>
      {/* mobile logo */}
      <div className={styles.mobileLogo}>
        {finishedLoading && <AnimatedShield finishedLoading={finishedLoading}/>}
      </div>
      {/* desktop logo */}
      {finishedLoading && <div className={styles.desktopLogoContainer}>
        <AnimatedShield finishedLoading={finishedLoading}/>
        <img
          src={'/images/logos/titledLogoNoShieldWhiteText.webp'}
          alt='Intro Image'
          className={styles.logo}
        />
      </div>
      }
      <h1 className={`${styles.enterButton}`}>{finishedLoading ? 'WELCOME!' : 'LOADING' }</h1>
      {!finishedLoading && loadingBar}
      {finishedLoading ? null : <p className={styles.clickToSkip}> {`(click to skip)`}</p>}
    </div>
  )


  // return (
  //   welcomeModal
  // )



  return (
    <div>
      <BackgroundGallery
        introRunning={introRunning}
        finishedLoading={finishedLoading}
        setFinishedLoading={setFinishedLoading}
        loadedImages={loadedImages}
        setLoadedImages={setLoadedImages}

      />
      { introRunning ? (welcomeModal) : null }
      { introRunning ? null : <Header introRunning={introRunning}/> }
      { <div style={{ display: introRunning ? 'none' : 'block' }}>
        {children}
      </div> }
    </div>
  );
}
