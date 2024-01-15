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
      {/* <h1 className={styles.tikTokTitle}>P<span className={styles.specialLetter}>a</span>
      rkw<span className={styles.specialLetter}>a</span>y Peri<span className={styles.specialLetter}>o</span>
      dic<span className={styles.specialLetter}>a</span>l</h1> */}

      <div className={styles.graphicWrapper}>
        {/* <div className={styles.blueShard}>
          <h1 className={styles.shardLetter}>P</h1>
        </div>
        <div className={styles.redShard}>
          <h1 className={styles.shardLetter}>A</h1>
        </div>
        <div className={styles.blueShard}>
          <h1 className={styles.shardLetter}>R</h1>
        </div>
        <div className={styles.redShard}>
          <h1 className={styles.shardLetter}>K</h1>
        </div>
        <div className={styles.blueShard}>
          <h1 className={styles.shardLetter}>W</h1>
        </div>
        <div className={styles.redShard}>
          <h1 className={styles.shardLetter}>A</h1>
        </div>
        <div className={styles.blueShard}>
          <h1 className={styles.shardLetter}>Y</h1>
        </div>
        <div className={styles.transparentShard}>
          <h1 className={styles.shardLetter}> </h1>
        </div>
        <div className={styles.blueShard}>
          <h1 className={styles.shardLetter}>P</h1>
        </div>
        <div className={styles.redShard}>
          <h1 className={styles.shardLetter}>0</h1>
        </div>
        <div className={styles.blueShard}>
          <h1 className={styles.shardLetter}>S</h1>
        </div>
        <div className={styles.redShard}>
          <h1 className={styles.shardLetter}>T</h1>
        </div> */}

        <h1 className={styles.blueShard}>P</h1>
        <h1 className={styles.redShard}>A</h1>
        <h1 className={styles.blueShard}>R</h1>
        <h1 className={styles.redShard}>K</h1>
        <h1 className={styles.blueShard}>W</h1>
        <h1 className={styles.redShard}>A</h1>
        <h1 className={styles.blueShard}>Y</h1>
        <h1 className={styles.transparentShard}> </h1>
        <h1 className={styles.blueShard}>P</h1>
        <h1 className={styles.redShard}>0</h1>
        <h1 className={styles.blueShard}>S</h1>
        <h1 className={styles.redShard}>T</h1>


      </div>



      {/* <h1 className={styles.title}>PARKWAY PERIODICAL</h1> */}
      {/* <img src={'/images/header.png'} alt="Profile Picture"  className={styles.headerPhoto}/> */}
      <div className={styles.navContainer}>
        <Link href='/public/home'><h2>HOME</h2></Link>
        <Link href='/public/archive'><h2>ARCHIVE</h2></Link>
        <Link href='/public/about'><h2>ABOUT</h2></Link>
      </div>
    </div>
  )
}