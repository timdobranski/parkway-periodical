'use client'

import styles from './HeaderAdmin.module.css';
import logo from '../../public/images/logos/parkway.webp';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import supabase from '../../utils/supabase';
import  React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { faCaretDown, faBars, faGear, faUser, faFile, faBell, faCloud, faCloudArrowUp, faCloudArrowDown, faCheck } from '@fortawesome/free-solid-svg-icons';

export default function Header({ user }) {
  const [storageUsage, setStorageUsage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoading, setIsLoading, saving, setSaving, alerts, setAlerts } = useAdmin();
  const router = useRouter();
  const contentTypes = ['electives', 'clubs', 'links', 'events'];

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
  async function fetchEntriesExpiringSoon(contentTypes) {
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);  // Set the date to one week from today

    const results = await Promise.all(contentTypes.map(async (tableName) => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')  // Select all columns or specify which columns you need
          .lte('expires', oneWeekFromNow.toISOString());  // 'expires' is less than or equal to one week from now

        if (error) {
          throw error;
        }
        return {
          tableName,
          entries: data
        };
      } catch (error) {
        return {
          tableName,
          error: error.message
        };
      }
    }));
    console.log('results:', results)
    setAlerts(results.filter(result => result.entries.length > 0));
  }
  const pathname = usePathname();
  useEffect(() => {
    fetchEntriesExpiringSoon(contentTypes);
  }, [])

  useEffect(() => {
    console.log(alerts);
  }, [alerts])

  useEffect(() => {
    console.log('user: ', user)
    checkStorageUsage().then(setStorageUsage);
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
        <div className={styles.cloudCheckIconWrapper}>
          <FontAwesomeIcon icon={faCloud} className={styles.emptyCloudIcon}/>
          <FontAwesomeIcon icon={faCheck} className={styles.checkIcon}/>
        </div>
      }
    </div>
  )
  const alertsMenu = (
    <div className={styles.alertsHandle}>
      <div className={styles.iconWrapper}>
        <FontAwesomeIcon
          icon={faBell}
          className={alerts ? styles.messageIcon : styles.messageIconDisabled}
          onClick={() => toggleMenuOpen('alerts')}
        />
      </div>
      <div className={`${styles.alertsWrapper} ${menuOpen === 'alerts' ? '' : 'hidden'}`}>
        {alerts.map(alert => (
          <React.Fragment key={alert.tableName}>
            {alert.entries.map(entry => (
              <div className={styles.alertItem} key={entry.id}>
                <div className={styles.alertHeader}>
                  <p className={styles.expiredLabel}>{`Expired ${alert.tableName.slice(0, alert.tableName.length - 1)}: `}</p>
                  <p className={styles.expiredItem}>{`${entry.title}`}</p>
                  <p className={styles.expiredDate}>{`Expires on: ${entry.expires}`}</p>
                </div>
                <div className={styles.alertButtons}>
                  <button className={styles.renewButton}>Update</button>
                  <button className={styles.deleteButton}>Delete</button>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
  const rightNavbarMenu = (
    <div className={styles.rightNavHandle} onClick={() => toggleMenuOpen('right')}>
      <div className={styles.iconWrapper}>
        <FontAwesomeIcon icon={faBars} className={styles.menuIcon}/>
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
        <Link href='/admin/list?type=staff'>
          <h2>STAFF</h2>
        </Link>
        <Link href='/admin/list?type=links'>
          <h2>LINKS</h2>
        </Link>
        <Link href='/admin/settings'>
          <h2>SETTINGS</h2>
        </Link>
      </div>
    </div>
  )
  const userMenu = (
    <div className={styles.userHandle}>

      <div className={styles.photoWrapper} onClick={() => toggleMenuOpen('user')}>
        { user ?
          <img src={user.photo} alt="User Avatar" className={styles.userPhoto} />
          :
          <FontAwesomeIcon icon={faUser} className={styles.menuIcon}/>
        }
      </div>
      <div className={`${styles.userMenu} ${menuOpen !== 'user' ? 'hidden' : ''}`}>
        <h2 className='smallerTitle'>{`${user?.first_name} ${user?.last_name}`}</h2>
        <div className={styles.userDetailsWrapper}>
          <h2 className={styles.userDetails}>{user?.position}</h2>
          <h2 className={styles.userDetails}>{user?.email}</h2>
        </div>
          <div className={styles.iconWrapper} onClick={() => {toggleMenuOpen(menuOpen); router.push('/admin/settings') }}>
            <FontAwesomeIcon icon={faGear} className={styles.menuIcon}/>
          </div>
      </div>
    </div>
  )
  const storageStatus = (
    <div className={styles.storageStatusWrapper}>
      <p className={styles.storageUsed}>Free Photo Storage Used: {storageUsage ? `${storageUsage.percentageUsed}%` : 'Loading...'}</p>
    </div>

  )
  const leftSideNavbar = (
    <div className={styles.leftSideNavbarContent}>
      <div className={styles.logoContainer}>
        <Link href='/admin/home'>
          <Image src={logo} alt="Parkway Academy Logo" fill='true'/>
        </Link>
      </div>
      <div className={styles.leftNavHandle}
        onClick={() => {toggleMenuOpen('left')}}
      >
        {/* <FontAwesomeIcon icon={faCaretDown} className={styles.menuIcon}/> */}
        <div className={styles.iconWrapper}>
          <FontAwesomeIcon icon={faFile} className={styles.menuIcon}/>
        </div>

        <div className={menuOpen === 'left' ? styles.navContainerLeft : styles.navContainerHidden}>
          <Link href='/'><h2>HOME</h2></Link>
          <Link href='/public/archive'><h2>ARCHIVE</h2></Link>
          <Link href='/public/info'><h2>INFO</h2></Link>
        </div>
      </div>
      {storageStatus}
      { pathname === '/admin/new-post' && autosaveIndicator}

    </div>
  )
  const rightSideNavbar = (
    <div className={styles.rightSideNavbarContent}>
      {alertsMenu}
      {rightNavbarMenu}
      {user && userMenu}
    </div>
  )


  return (
    <div className={styles.headerContainer}>
      {leftSideNavbar}




      {rightSideNavbar}
    </div>
  )
}