'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();


  useEffect(() => {
    router.push('/public/home')
  }, [])

  const welcomeModal = (
    <div className={styles.introContainer} onClick={() => setIntroRunning(false)}>
      <img src='../../images/logos/titledLogoThumb.png' alt='Intro Image' className={styles.titledLogo} />
      <h1 className={styles.enterButton}>Loading</h1>
    </div>
  )



  return (
    welcomeModal
  );
}
