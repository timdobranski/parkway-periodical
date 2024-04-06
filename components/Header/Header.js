'use client'

import styles from './Header.module.css';
import logo from '../../public/images/logos/parkway.png';
import Image from 'next/image';
import Link from 'next/link';
import supabase from '../../utils/supabase';
import  { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faBars, faX } from '@fortawesome/free-solid-svg-icons';

export default function Header({ skipAnimation }) {
  const [user, setUser] = useState(null);
  const [leftNavbarOpen, setLeftNavbarOpen] = useState(false);
  const [rightNavbarOpen, setRightNavbarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getAndSetUser = async () => {
      const response = await supabase.auth.getSession();

      // Check if the session exists
      if (response.data.session) {
        // If session exists, set the user
        console.log('session exists: ', response.data.session.user);
        setUser(response.data.session.user);

      } else {
        // If no session, redirect to /auth
        console.log('no session');
      }
    };
    getAndSetUser();
  }, []);

  useEffect(() => {
    console.log('leftNavbarOpen: ', leftNavbarOpen)
  }, [leftNavbarOpen])

  const desktopLeftNavbar = (
    <div className={styles.desktopLeftNavbarWrapper}>
      <div className={styles.socialWrapper}>
        <img src={'/images/logos/parkway.png'} className={styles.logoContainer} alt="Parkway Academy Logo" fill='true' onClick={() => router.push('/')}/>
        <Link href='https://www.facebook.com/PKMSkindness/'><FontAwesomeIcon icon={faFacebook} className={styles.socialIcon} /></Link>
        <Link href='https://www.instagram.com/parkwaypatriots/'><FontAwesomeIcon icon={faInstagram} className={styles.socialIcon} /></Link>
        <Link href='https://x.com/pkmspatriots?s=20'><FontAwesomeIcon icon={faTwitter} className={styles.socialIcon} /></Link>
      </div>
    </div>
  )
  const mobileLeftNavbar = (
    <div className={styles.mobileLeftNavbarWrapper}>
      <div className={styles.socialWrapper}>
        <FontAwesomeIcon icon={faX} className={styles.closeIcon} onClick={() => setLeftNavbarOpen(!leftNavbarOpen)}/>
        <p className={styles.visitUsOn}>VISIT US ON:</p>
        <div className={styles.socialLinksWrapper}>
        <img src={'/images/logos/parkway.png'} className={styles.logoContainer} alt="Parkway Academy Logo" fill='true' onClick={() => router.push('/')}/>
          <Link href='https://www.facebook.com/PKMSkindness/' className={styles.mobileSocialLink}><FontAwesomeIcon icon={faFacebook} className={styles.socialIcon} />FACEBOOK</Link>
          <Link href='https://www.instagram.com/parkwaypatriots/' className={styles.mobileSocialLink}><FontAwesomeIcon icon={faInstagram} className={styles.socialIcon} />INSTAGRAM</Link>
          <Link href='https://x.com/pkmspatriots?s=20' className={styles.mobileSocialLink}><FontAwesomeIcon icon={faTwitter} className={styles.socialIcon} />TWITTER</Link>
        </div>
      </div>
    </div>
  )
  const desktopRightNavbar = (
    <div className={styles.desktopRightNavbarWrapper}>
      <div className={styles.navContainer}>
        <Link href='/public/home?skipIntro=false'><h2  className={styles.navLink}>HOME</h2></Link>
        <Link href='/public/archive' ><h2  className={styles.navLink}>ARCHIVE</h2></Link>
        <Link href='/public/about' ><h2  className={styles.navLink}>ABOUT</h2></Link>
        {user && (<Link href='/admin/new-post'><h2 className={styles.adminHomeLink}>ADMIN HOME</h2></Link>)}
      </div>
    </div>
  )
  const mobileRightNavbar = (
    <div className={styles.mobileRightNavbarWrapper}>
      <div className={styles.navContainer}>
        <FontAwesomeIcon icon={faX} className={styles.closeIcon} onClick={() => setRightNavbarOpen(!rightNavbarOpen)}/>
        <div onClick={() => {  setRightNavbarOpen(false); router.push('/public/home')}}><h2  className={styles.navLink}>HOME</h2></div>
        <div onClick={() => {  setRightNavbarOpen(false); router.push('/public/archive')}}><h2  className={styles.navLink}>ARCHIVE</h2></div>
        <div onClick={() => {  setRightNavbarOpen(false); router.push('/public/about')}}><h2  className={styles.navLink}>ABOUT</h2></div>
        {user && (<Link href='/admin/new-post'><h2 className={styles.adminHomeLink}>ADMIN HOME</h2></Link>)}
      </div>
    </div>
  )

  return (

    <div className={styles.headerContainer}>
      {/* desktop version of left navbar */}
      {desktopLeftNavbar}
      {/* mobile navbar left handle (social links) */}
      <img src={'/images/logos/parkway.png'} className={styles.leftNavbarHandle} alt="Parkway Academy Logo" fill='true' onClick={() => setLeftNavbarOpen(!leftNavbarOpen)}/>
      {/* mobile version of left navbar */}
      {leftNavbarOpen && mobileLeftNavbar}
      {/* title and subtitle */}
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>PARKWAY PERIODICAL</h1>
        <p className={styles.subtitle}>The latest news and updates from Parkway Sports & Health Science Academy</p>
      </div>
      {/* navbar right handle (pages) */}
      <FontAwesomeIcon icon={faBars} className={styles.rightNavbarHandle} onClick={() => setRightNavbarOpen(!rightNavbarOpen)}/>
      {/* desktop version of navbar */}
      {desktopRightNavbar}
      {/* mobile version of navbar */}
      {rightNavbarOpen && mobileRightNavbar}
    </div>

  )
}