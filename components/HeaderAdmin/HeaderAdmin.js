'use client'

import styles from './HeaderAdmin.module.css';
import logo from '../../public/images/logos/parkway.png';
import Image from 'next/image';
import Link from 'next/link';
import supabase from '../../utils/supabase';
import  { useState, useEffect } from 'react';

export default function Header() {

  return (
    <div className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <Image src={logo} alt="Parkway Academy Logo" fill='true'/>
      </div>
      <h1 className={styles.title}>Parkway Periodical</h1>
      <div className={styles.navContainer}>
        {/* <Link href='/'> */}

        <h2>NEW POST</h2>
        {/* </Link> */}
        {/* <Link href='/archive'> */}
          <h2>VIEW/EDIT POSTS</h2>
          {/* </Link> */}
        {/* <Link href='/about'> */}
          <h2>LOG OUT</h2>
          {/* ></Link> */}
      </div>
    </div>
  )
}