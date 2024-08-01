'use client'

import styles from './HeaderAdmin.module.css';
import logo from '../../public/images/logos/parkway.webp';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import  React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import moment from 'moment-timezone';
import dateFormatter from '../../utils/dateFormatter';
import logUserOut from '../../utils/logUserOut';
import { faCircleChevronDown, faCircleChevronUp, faGear, faUser, faFile, faBell, faCircleExclamation,
  faCloud, faCloudArrowUp, faCloudArrowDown, faCheck } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const { isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, setUser, authUser, setAuthUser } = useAdmin();
  const supabase = createClient();
  const [storageUsage, setStorageUsage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const contentTypes = ['electives', 'clubs', 'links', 'events'];
  const leftMenuRef = useRef();
  const rightMenuRef = useRef();
  const alertsMenuRef = useRef();
  const userMenuRef = useRef();
  const pathname = usePathname();
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
  // fetch entries expiring soon



  useEffect(() => {
    console.log('User in header: ', user)
  }, [user])

  // fetch expired content for alerts
  useEffect(() => {
    async function fetchEntriesExpiringSoon(contentTypes) {
      const nowInPacific = moment().tz('America/Los_Angeles');
      const oneWeekFromNowInPacific = nowInPacific.clone().add(7, 'days');

      const results = await Promise.all(contentTypes.map(async (tableName) => {
        try {
          let query = supabase
            .from(tableName)
            .select('*')
            .lte('expires', oneWeekFromNowInPacific.toISOString());

          // Conditionally add the author filter
          if (user && !user.admin) {
            query = query.eq('author', user.id);
          }

          // Execute the query
          const { data, error } = await query;
          if (error) {
            throw error;
          }
          return data.map(entry => ({
            ...entry,
            tableName,
            expiredYet: moment(entry.expires).tz('America/Los_Angeles').isBefore(nowInPacific)
          }));
        } catch (error) {
          console.error(`Error fetching from ${tableName}:`, error.message);
          return [];
        }
      }));

      // Flatten the results array and sort by expires value in reverse chronological order
      const allEntries = results.flat().sort((a, b) => moment(b.expires).diff(moment(a.expires)));

      // console.log('allEntries:', allEntries);
      setAlerts(allEntries);
    }

    fetchEntriesExpiringSoon(contentTypes);
  }, [])
  // console log alerts
  useEffect(() => {
    console.log('alerts: ', alerts);
  }, [alerts])
  // check storage usage
  useEffect(() => {
    async function checkStorageUsage() {
      try {
        // Name of your bucket
        const bucketName = 'posts';
        // Path inside your bucket (if you have a specific folder you're targeting)
        const folderPath = 'photos';

        // Get a reference to the bucket
        const { data, error } = await supabase.storage.from(bucketName).list(folderPath, {
          limit: 100, // Adjust the limit as per your needs, max is 1000
          offset: 0,
        });

        if (error) {
          throw error;
        }

        // Sum the sizes of all files
        const totalSizeBytes = data.reduce((acc, file) => acc + file.metadata.size, 0);

        // Convert bytes to gigabytes
        const totalSizeGB = totalSizeBytes / (1024 ** 3);

        // Calculate the percentage of 1 GB used
        const percentageUsed = (totalSizeGB / 1) * 100;
        const numberOfFiles = data.length;

        return {
          percentageUsed: parseFloat(percentageUsed.toFixed(2)),
          numberOfFiles: numberOfFiles
        };

      } catch (error) {
        console.error('Error calculating storage usage:', error);
        return null;
      }
    }
    // console.log('user: ', user)
    checkStorageUsage().then(setStorageUsage);
  }, []);
  // handle click outside menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (leftMenuRef.current && !leftMenuRef.current.contains(event.target)) &&
        (rightMenuRef.current && !rightMenuRef.current.contains(event.target)) &&
        // (alertsMenuRef.current && !alertsMenuRef.current.contains(event.target)) &&
        (userMenuRef.current && !userMenuRef.current.contains(event.target))
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenuOpen = (menu) => {
    // if menu is already open, close it
    if (menuOpen === menu) {
      setMenuOpen(false);
    } else {
      setMenuOpen(menu);
    };
  }
  const autosaveIndicator = (
    <div className={styles.autosaveStatusWrapper}>
      { saving ?
        <>
          <FontAwesomeIcon icon={faCloudArrowUp} className={styles.cloudIcon}/>
          <p className={styles.autosaveStatus}>Saving...</p>
        </>
        :
        <>
          <div className={styles.cloudCheckIconWrapper}>
            <FontAwesomeIcon icon={faCloud} className={styles.emptyCloudIcon}/>
            <FontAwesomeIcon icon={faCheck} className={styles.checkIcon}/>
          </div>
          <p className={styles.autosaveStatus}>Post Draft Saved</p>

        </>
      }
    </div>
  )
  const alertsMenu = (
    <div className={styles.alertsHandle} onClick={() => toggleMenuOpen('alerts')} ref={alertsMenuRef}>
      <div className={styles.iconWrapper}>
        <FontAwesomeIcon
          icon={faBell}
          className={alerts ? menuOpen === 'alerts' ? styles.selectedAlertsIcon : styles.alertsIcon : styles.alertsIconDisabled}

        />
      </div>
      <div className={`${styles.alertsWrapper} ${menuOpen === 'alerts' ? '' : 'hidden'}`}>
        {alerts.map((alert, index) => (
          <React.Fragment key={alert.tableName}>
            {/* {alert.entries.map((entry, index) => ( */}
            <div className={`${styles.alertItem}`} key={index}>
              <div className={styles.alertHeader}>
                <p className={styles.expiredLabel}>{`${alert.expiredYet ? `Expired ${alert.tableName.slice(0, alert.tableName.length - 1)}:` :
                  `${alert.tableName.charAt(0).toUpperCase() + alert.tableName.slice(1, alert.tableName.length - 1)}
                      expiring soon:`}`}</p>
                <p className={styles.expiredItemName}>{`${alert.title}`}</p>
                <p className={styles.expiredDate}>{`${alert.expiredYet ? 'Expired' : 'Expires'} on ${dateFormatter(alert.expires)}`}</p>
              </div>
              {/* <div className={styles.expireStatusIconWrapper}>
                <FontAwesomeIcon icon={faCircleExclamation} className={`${alert.expiredYet ? styles.expiredContent : styles.expiringContent}`}/>
              </div> */}
              <div className={styles.alertButtons}>
                <button className={styles.renewButton}>Update</button>
                <button className={styles.deleteButton}>Delete</button>
              </div>
              {index !== alerts.length - 1 && <hr className={styles.alertDivider}/>}
            </div>
            {/* ))} */}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
  const rightNavbarMenu = (
    <div className={styles.rightNavHandle} onClick={() => toggleMenuOpen('right')} ref={rightMenuRef}>
      <div className={styles.iconWrapper}>
        <FontAwesomeIcon icon={menuOpen === 'right' ? faCircleChevronUp : faCircleChevronDown} className={`${menuOpen === 'right' ? styles.selectedMenuIcon : styles.menuIcon}`}/>
      </div>
      {/* <p className={styles.viewPages}>SETTINGS</p> */}
      <div className={menuOpen === 'right' ? styles.navContainerRight : styles.navContainerHidden}>
        <Link href='/admin/home' className={styles.link}>
          <h2>HOME</h2>
        </Link>
        <Link href='/admin/new-post'>
          <h2>NEW POST</h2>
        </Link>
        <Link href='/admin/list?type=posts'>
          <h2>POSTS</h2>
        </Link>
        <Link href='/admin/list?type=electives'>
          <h2>ELECTIVES</h2>
        </Link>
        <Link href='/admin/list?type=clubs'>
          <h2>CLUBS</h2>
        </Link>
        {/* <Link href='/admin/list?type=events'>
          <h2>EVENTS</h2>
        </Link> */}
        <Link href='/admin/list?type=links'>
          <h2>LINKS</h2>
        </Link>
      </div>
    </div>
  )
  const userMenu = (
    <div className={styles.userHandle} ref={userMenuRef}>

      <div className={user?.photo ? styles.photoWrapper : styles.userIconWrapper} onClick={() => toggleMenuOpen('user')}>
        { user?.photo ?
          <img src={user.photo} alt="User Avatar" className={styles.userPhoto} />
          :
          <FontAwesomeIcon icon={faUser} className={styles.userIcon}/>
        }
      </div>
      <div className={`${styles.userMenu} ${menuOpen !== 'user' ? 'hidden' : ''}`}>
        <h2 className='smallerTitle'>{`${user?.first_name} ${user?.last_name}`}</h2>
        <div className={styles.userDetailsWrapper}>
          <h2 className={styles.userPosition}>{user?.position}</h2>
          <h2 className={styles.userEmail}>{user?.email}</h2>
        </div>
        <div className={styles.iconWrapper} onClick={() => {toggleMenuOpen(menuOpen); router.push('/admin/settings') }}>
          <FontAwesomeIcon icon={faGear} className={styles.menuIcon}/>
        </div>
        <p className={styles.settingsLabel}>SETTINGS</p>
        <button
          className={styles.logout}
          onClick={() => logUserOut(router)}
        >Log Out</button>
      </div>
    </div>
  )
  const storageStatus = (
    <div className={styles.storageStatusWrapper}>
      <p className={styles.storageUsed}>Free Photo Storage Used: {storageUsage ? `${storageUsage.percentageUsed}%` : 'Loading...'}</p>
    </div>

  )
  const testEmailErrorButton = (
    <button
      className={styles.testErrorButton}
    >
  Test Error Email
    </button>
  )
  const leftSideNavbar = (
    <div className={styles.leftSideNavbarContent}>
      <div className={styles.logoContainer}>
        <Link href='/admin/home'>
          <Image src={logo} alt="Parkway Academy Logo" fill='true'/>
        </Link>
      </div>
      <div
        className={styles.leftNavHandle}
        ref={leftMenuRef}
        onClick={() => {toggleMenuOpen('left')}}
      >
        {/* <FontAwesomeIcon icon={faCaretDown} className={styles.menuIcon}/> */}
        <div className={styles.iconWrapper}>
          <FontAwesomeIcon icon={faFile} className={styles.menuIcon}/>
        </div>

        <div className={menuOpen === 'left' ? styles.navContainerLeft : styles.navContainerHidden}>
          <Link href='/home'><h2>POST FEED</h2></Link>
          <Link href='/electives'><h2>ELECTIVES PAGE</h2></Link>
          <Link href='/clubs'><h2>CLUBS PAGE</h2></Link>
          <Link href='/archive'><h2>ARCHIVE PAGE</h2></Link>
          {/* <Link href='/events'><h2>EVENTS PAGE</h2></Link> */}
          <Link href='/links'><h2>LINKS PAGE</h2></Link>
        </div>
      </div>
      {storageStatus}
      { pathname === '/admin/new-post' && autosaveIndicator}

    </div>
  )
  const rightSideNavbar = (
    <div className={styles.rightSideNavbarContent}>
      { user && user.id === 1 &&
        testEmailErrorButton
      }
      {/* {alertsMenu} */}
      {rightNavbarMenu}
      {user && userMenu}
    </div>
  )

  if (!user ) {
    return null;
  }

  return (
    <div className={styles.headerContainer}>
      {leftSideNavbar}
      {/* {(SITE_URL === 'http://parkway-periodical.vercel.app' && user.email === 'timdobranski@gmail.com') ? <h3 className={styles.productionWarning}>PRODUCTION VERSION</h3> : <h3 className={styles.developmentWarning}>DEVELOPMENT VERSION</h3>} */}
      {rightSideNavbar}
    </div>
  )
}