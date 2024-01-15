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
      <div className={styles.logoContainer} onClick={() => router.push('/')}>
        <Image src={logo} alt="Parkway Academy Logo" fill='true'/>
      </div>
      <h1 className={styles.title}>PARKWAY PERIODICAL</h1>
      {/* <img className={styles.profilePic} src={'/images/header.png'} alt="Profile Picture"  width={800}/> */}
      <div className={styles.navContainer}>
        <Link href='/public/home'><h2>HOME</h2></Link>
        <Link href='/public/archive'><h2>ARCHIVE</h2></Link>
        <Link href='/public/about'><h2>ABOUT</h2></Link>
      </div>
    </div>
  )
}