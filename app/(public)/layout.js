'use client'

import React, { useEffect, useState, Suspense } from 'react';
import styles from './layout.module.css';
import BackgroundGallery from '../../components/BackgroundGallery/BackgroundGallery.jsx';
import AnimatedShield from '../../components/AnimatedShield/AnimatedShield';
import { useSearchParams } from 'next/navigation'
import Header from '../../components/Header/Header';
import { usePathname } from 'next/navigation'
import { useAdmin } from '../../contexts/AdminContext';
import { useMediaQuery } from 'react-responsive'



export default function Home({ children }) {
  const [introRunning, setIntroRunning] = useState(true);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState(0);
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const playIntro = searchParams.get('intro');
  const [progress, setProgress] = useState(0);

  // global state for intro status to start slideshow
  const { setIntroOver } = useAdmin();

  useEffect(() => {
    // console.log('Images loaded: ', loadedImages)
    const newProgress = Math.floor((loadedImages / 72) * 100);
    setProgress(newProgress);
  }, [loadedImages]);

  useEffect(() => {
    console.log('PLAY INTRO: ', playIntro)
    console.log('TYPE: ', typeof playIntro)

    if (playIntro !== 't') {
      setIntroRunning(false)
    }
  }, [playIntro])

  useEffect(() => {
    console.log('INTRO RUNNING in layout: ', introRunning)
    if (introRunning === false) {
      setIntroOver(true)
    }
  }, [introRunning])



  const loadingBar = (
    <div className={styles.loadingBarContainer}>
      <div className={styles.loadingBar} style={{width: `${progress}%`, display: finishedLoading ? 'none' : 'block' }}></div>
      {/* <p>{progress}%</p> */}
    </div>
  )
  const welcomeModal = (
    <div
      className={`${styles.introContainer} ${introRunning ? styles.fadeInFromWhite : ''}`}
      onClick={() => setIntroRunning(false)}>

      <div className={styles.logoContainer}>
        <AnimatedShield finishedLoading={finishedLoading}/>

        <img
          src={'/images/logos/titledLogoNoShieldWhiteTextBWCropped.webp'}
          alt='Intro Image'
          className={styles.LMSVtitle}
        />
      </div>



      <h1 className={`${styles.enterButton}`}>{finishedLoading ? 'WELCOME!' : `LOADING` }</h1>
      {loadingBar}
      {/* {finishedLoading ? null : <p className={styles.clickToSkip}> {`(click to skip)`}</p>} */}
    </div>
  )



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

      {
        finishedLoading &&
        <div style={{ display: introRunning ? 'none' : 'block'}}>
          {children}
        </div>
      }
    </div>
  );
}
