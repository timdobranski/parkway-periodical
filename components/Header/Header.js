'use client'

import styles from './Header.module.css';
import logo from '../../public/images/logos/parkway.png';
import Image from 'next/image';
import Link from 'next/link';
import supabase from '../../utils/supabase';
import  { useState, useEffect } from 'react';

export default function Header() {
  const [user, setUser] = useState(null);

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

  if (user) {
    return (
      <div className={styles.headerContainer}>
        <div className={styles.logoContainer}>
          <Image src={logo} alt="Parkway Academy Logo" fill='true'/>
        </div>
        <h1>Parkway Periodical</h1>
        <div className={styles.authNavContainer}>
          <Link href='/archive'><h2>NEW POST</h2></Link>
          <Link href='/about'><h2>VIEW/EDIT POSTS</h2></Link>
          <Link href='/auth'><h2>LOGOUT</h2></Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <Image src={logo} alt="Parkway Academy Logo" fill='true'/>
      </div>
      <h1>Parkway Periodical</h1>
      <div className={styles.navContainer}>
        <Link href='/'><h2>HOME</h2></Link>
        <Link href='/archive'><h2>ARCHIVE</h2></Link>
        <Link href='/about'><h2>ABOUT</h2></Link>
      </div>
    </div>
  )
}