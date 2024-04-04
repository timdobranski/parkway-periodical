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

export default function Header({ skipAnimation }) {
  const [user, setUser] = useState(null);
  const [navbar, setNavbar] = useState('0'); // ['home', 'archive', 'about'
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


  return (
    <div className={styles.headerContainer}>
      {user && (<Link href='/admin/new-post' className={styles.adminHomeLink}><h2>ADMIN HOME</h2></Link>)}
      <div className={styles.logoContainer} onClick={() => router.push('/')}>
        <Image src={logo} alt="Parkway Academy Logo" fill='true'/>
        <div className={styles.socialWrapper}>
          <Link href='https://www.facebook.com/PKMSkindness/'><FontAwesomeIcon icon={faFacebook} className={styles.socialIcon} /></Link>
          <Link href='https://www.instagram.com/parkwaypatriots/'><FontAwesomeIcon icon={faInstagram} className={styles.socialIcon} /></Link>
          <Link href='https://x.com/pkmspatriots?s=20'><FontAwesomeIcon icon={faTwitter} className={styles.socialIcon} /></Link>
        </div>
      </div>
      <div>
        <h1 className={styles.title}>PARKWAY PERIODICAL</h1>
        <p className={styles.subtitle}>The latest news and updates from Parkway Sports & Health Science Academy</p>

      </div>

      <div className={styles.navContainer}>
        {/* <Link href='/public/home?skipIntro=true'> */}
        <h2
          onClick={() => {router.push('/public/home?skipIntro=false')}}
        >
            HOME</h2>
        <h2
          onClick={() => {router.push('/public/archive')}}
        >
            ARCHIVE</h2>
        {/* </Link> */}
        <Link href='/public/about'><h2>ABOUT</h2></Link>
      </div>
    </div>
  )
}