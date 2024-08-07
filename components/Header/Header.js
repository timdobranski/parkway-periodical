'use client'

import styles from './Header.module.css';
import Link from 'next/link';
import { createClient } from '../../utils/supabase/client';
import  { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faBars, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useAdmin } from '../../contexts/AdminContext';

export default function Header({ skipAnimation }) {
  const { isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, setUser, authUser, setAuthUser } = useAdmin();
  const supabase = createClient();
  // const [user, setUser] = useState(null);
  const [leftNavbarOpen, setLeftNavbarOpen] = useState(false);
  const [rightNavbarOpen, setRightNavbarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);
  const router = useRouter();
  const pathname = usePathname()

  // prevent scroll when nav menu is up on mobile
  useEffect(() => {
    const backgroundElement = document.querySelector('.background');
    if (leftNavbarOpen || rightNavbarOpen) {
      if (backgroundElement) backgroundElement.classList.add('no-scroll');
    } else {
      if (backgroundElement) backgroundElement.classList.remove('no-scroll');
    }
  }, [leftNavbarOpen, rightNavbarOpen]);

  // useEffect(() => {
  //   console.log('PATHNAME: ', pathname)
  // }, [pathname])



  const isActive = (href) => {
    // console.log('isActive: ', pathname, href)
    // Check for exact match or specific condition
    return pathname === href || router.pathname === '/home' && href === '/home' || router.pathname === '/archive' && href === '/archive' || router.pathname === '/about' && href === '/about';
  };

  const desktopLeftNavbar = (
    <div className={styles.desktopLeftNavbarWrapper}>
      <div className={styles.socialWrapper}>
        <img src={'/images/logos/parkway.webp'} className={styles.logoContainer} alt="Parkway Academy Logo" fill='true' onClick={() => router.push('/home')}/>
        {/* <Link href='https://www.facebook.com/PKMSkindness/'><FontAwesomeIcon icon={faFacebook} className={styles.socialIcon} /></Link> */}
        <Link href='https://www.instagram.com/parkwaypatriots/'><FontAwesomeIcon icon={faInstagram} className={styles.socialIcon} /></Link>
        <Link href='https://x.com/pkmspatriots?s=20'><FontAwesomeIcon icon={faXTwitter} className={styles.socialIcon} /></Link>
      </div>
    </div>
  )
  const mobileLeftNavbar = (
    <div className={`${styles.mobileLeftNavbarWrapper} ${leftNavbarOpen ? styles.activeLeft  : ''}`}>
      <div className={styles.socialWrapper}>
        <FontAwesomeIcon icon={faChevronLeft} className={styles.closeIconLeft} onClick={() => setLeftNavbarOpen(!leftNavbarOpen)}/>
        <p className={styles.visitUsOn}>VISIT US ON:</p>
        <div className={styles.socialLinksWrapper}>
          {/* <Link href='https://www.facebook.com/PKMSkindness/' className={styles.mobileSocialLink}><FontAwesomeIcon icon={faFacebook} className={styles.socialIcon} />FACEBOOK</Link> */}
          <Link href='https://www.instagram.com/parkwaypatriots/' className={styles.mobileSocialLink}><FontAwesomeIcon icon={faInstagram} className={styles.socialIcon} />INSTAGRAM</Link>
          <Link href='https://x.com/pkmspatriots?s=20' className={styles.mobileSocialLink}><FontAwesomeIcon icon={faXTwitter} className={styles.socialIcon} />X (TWITTER)</Link>
        </div>
      </div>
    </div>
  )
  const desktopRightNavbar = (
    <div className={styles.desktopRightNavbarWrapper}>
      <div className={styles.navContainer}>
        {/* <Link href='/public/home'>
          <h2 className={isActive('/public/home') ? `${styles.navLink} ${styles.underline}` : styles.navLink}>HOME</h2>
        </Link> */}
        {/* <Link href='/public/info'>
          <h2 className={isActive('/public/info') ? `${styles.navLink} ${styles.underline}` : styles.navLink}>INFO</h2>
        </Link> */}
        {/* <Link href='/public/electives'> */}
        <h2
          className={isActive('/electives') ? `${styles.navLink} ${styles.underline}` : styles.navLink}
          onClick={() => {router.push('/electives')}}
        >ELECTIVES</h2>
        {/* </Link> */}
        <Link href='/clubs'>
          <h2 className={isActive('/clubs') ? `${styles.navLink} ${styles.underline}` : styles.navLink}>CLUBS & ESS</h2>
        </Link>
        {/* <Link href='/events'>
          <h2 className={isActive('/events') ? `${styles.navLink} ${styles.underline}` : styles.navLink}>EVENTS</h2>
        </Link> */}
        <Link href='/links'>
          <h2 className={isActive('/links') ? `${styles.navLink} ${styles.underline}` : styles.navLink}>LINKS</h2>
        </Link>
        <Link href='/archive'>
          <h2 className={isActive('/archive') ? `${styles.navLink} ${styles.underline}` : styles.navLink}>ARCHIVE</h2>
        </Link>
      </div>
    </div>
  )
  const mobileRightNavbar = (
    <div className={`${styles.mobileRightNavbarWrapper} ${rightNavbarOpen ? styles.activeRight : ''}`}>
      <div className={`${styles.navContainer}`}>
        <FontAwesomeIcon icon={faChevronRight} className={styles.closeIconRight}  onClick={ () => setRightNavbarOpen(!rightNavbarOpen)}/>
        <div
          onClick={() => {setRightNavbarOpen(false); router.push('home')}}>
          <h2 className={isActive('/home') ? `${styles.navLink} ${styles.underline}` : styles.navLink}>HOME</h2>
        </div>
        <div
          onClick={() => {setRightNavbarOpen(false); router.push('/electives')}}>
          <h2 className={isActive('/electives') ? `${styles.navLink} ${styles.underline}` : styles.navLink}>ELECTIVES</h2>
        </div>
        <div
          onClick={() => {setRightNavbarOpen(false); router.push('/clubs')}}>
          <h2 className={isActive('/clubs') ? `${styles.navLink} ${styles.underline}` : styles.navLink}>CLUBS & ESS</h2>
        </div>
        {/* <div
          onClick={() => {setRightNavbarOpen(false); router.push('/events')}}>
          <h2 className={isActive('/events') ? `${styles.navLink} ${styles.underline}` : styles.navLink}>EVENTS</h2>
        </div> */}
        <div
          onClick={() => {setRightNavbarOpen(false); router.push('/links')}}>
          <h2 className={isActive('/links') ? `${styles.navLink} ${styles.underline}` : styles.navLink}>LINKS</h2>
        </div>
        <div
          onClick={() => {setRightNavbarOpen(false); router.push('/archive')}}>
          <h2 className={isActive('/archive') ? `${styles.navLink} ${styles.underline}` : styles.navLink}>ARCHIVE</h2>
        </div>
        <hr className={styles.navDivider}></hr>
        <div
          onClick={() => {setRightNavbarOpen(false); router.push('https://sites.google.com/lmsvsd.net/familyresourcecenter?usp=sharing&authuser=0')}}>
          <h2 className={styles.navLink}>FAMILY RESOURCE CENTER</h2>
        </div>

        <div
          onClick={() => {setRightNavbarOpen(false); router.push('https://teamlocker.squadlocker.com/#/lockers/parkway-sports-and-health-science-academy')}}>
          <h2 className={styles.navLink}>PARKWAY STORE</h2>
        </div>
      </div>
    </div>
  )

  return (

    <div className={styles.headerContainer}>
      {/* desktop version of left navbar */}
      {desktopLeftNavbar}
      {/* mobile navbar left handle (social links) */}
      <img src={'/images/logos/parkway.webp'} className={styles.leftNavbarHandle} alt="Parkway Academy Logo" fill='true' onClick={() => setLeftNavbarOpen(!leftNavbarOpen)}/>
      {/* mobile version of left navbar */}
      {mobileLeftNavbar}
      {/* title and subtitle */}
      <div className={styles.titleWrapper}>
        <h1 className={styles.title} onClick={() => router.push('/home')}>PARKWAY PERIODICAL</h1>
        <p className={styles.subtitle}>The latest news and updates from Parkway Sports & Health Science Academy</p>
      </div>
      {/* navbar right handle (pages) */}
      <FontAwesomeIcon icon={faBars} className={styles.rightNavbarHandle} onClick={() => setRightNavbarOpen(!rightNavbarOpen)}/>
      {/* desktop version of navbar */}
      {desktopRightNavbar}
      {/* mobile version of navbar */}
      {mobileRightNavbar}
      {user && (<Link href='/admin/home'><h2 className={styles.adminHomeLink}>STAFF HOME</h2></Link>)}

    </div>

  )
}