'use client'

import styles from './Header.module.css';
import logo from '../../public/images/logos/parkway.png';
import Image from 'next/image';
import Link from 'next/link';
import supabase from '../../utils/supabase';
import  { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
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

  // useEffect(() => {
  //   if (user) {

  //   }
  // }, [user]);


  return (
    <div className={styles.headerContainer}>
      {user && (<Link href='/admin/new-post' className={styles.adminHomeLink}><h2>ADMIN HOME</h2></Link>)}
      <div className={styles.logoContainer} onClick={() => router.push('/')}>
        <Image src={logo} alt="Parkway Academy Logo" fill='true'/>
      </div>
      <div>
        <h1 className={styles.title}>PARKWAY PERIODICAL</h1>
        <p className={styles.subtitle}>The latest news and updates from Parkway Sports & Health Science Academy</p>

      </div>

      <div className={styles.navContainer}>
        <Link href='/public/home?skipIntro=true'><h2>HOME</h2></Link>
        <Link href='/public/archive'><h2>ARCHIVE</h2></Link>
        <Link href='/public/about'><h2>ABOUT</h2></Link>
      </div>
    </div>
  )
}