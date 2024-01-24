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
      <div className={styles.navContainerLeft}>
        <Link href='/admin/new-post'>
          <h2>NEW POST</h2>
        </Link>
        <Link href='/admin/view-posts'>
          <h2>VIEW/EDIT POSTS</h2>
          </Link>
        {/* <Link href='/about'> */}
          <h2>SETTINGS</h2>
          {/* ></Link> */}
      </div>
      <div className={styles.navContainerRight}>
        <Link href='/'>
        <h2>HOME</h2>
        </Link>
        <Link href='/public/archive'>
          <h2>ARCHIVE</h2>
          </Link>
        <Link href='/public/about'>
          <h2>ABOUT</h2>
          </Link>
      </div>
    </div>
  )
}