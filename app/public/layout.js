'use client'

import React, { useEffect, useState, Suspense } from 'react';
import styles from './layout.module.css';
import Intro from '../../components/Intro/Intro';
import AnimatedShield from '../../components/AnimatedShield/AnimatedShield';
import { useSearchParams } from 'next/navigation'
import Header from '../../components/Header/Header';


export default function Home({ children }) {
  const [introRunning, setIntroRunning] = useState(true);
  const [finishedLoading, setFinishedLoading] = useState(false);




  const welcomeModal = (
    <div className={`${styles.introContainer} ${finishedLoading ? styles.fadeInFromWhite : styles.whiteBackground}`} onClick={() => setIntroRunning(false)}>
      {/* mobile logo */}
      <div className={styles.mobileLogo}>
        {finishedLoading && <AnimatedShield finishedLoading={finishedLoading}/>}
      </div>
      {/* desktop logo */}
      {finishedLoading && <div className={styles.desktopLogoContainer}>
        <AnimatedShield finishedLoading={finishedLoading}/>
        <img
          src={'/images/logos/titledLogoNoShield.webp'}
          alt='Intro Image'
          className={styles.logo}
        />
      </div>
      }
      <h1 className={styles.enterButton}>{finishedLoading ? 'WELCOME!' : 'LOADING' }</h1>
      {/* {finishedLoading ? null : <p className={styles.clickToSkip}> {`(click to skip)`}</p>} */}
    </div>
  )


  return (
    <div>
      <Intro
        introRunning={introRunning}
        setFinishedLoading={setFinishedLoading}
      />
      { introRunning ? (welcomeModal) : null }
      { introRunning ? null : <Header introRunning={introRunning}/>}
      { introRunning ? null :
        children
      }
    </div>
  );
}
