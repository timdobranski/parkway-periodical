'use client'

import styles from './home.module.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faAdd } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '../../../utils/supabase/client';
import { useAdmin } from '../../../contexts/AdminContext';


export default function AdminHomePage() {
  const { isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, setUser, authUser, setAuthUser } = useAdmin();
  const supabase = createClient();
  const types = ['posts', 'electives', 'clubs', 'staff', 'links', 'events', 'drafts'];
  const [typeCounts, setTypeCounts] = useState(types.reduce((acc, type) => {
    acc[type] = 0; // initialize all counts to zero
    return acc;
  }, {}));

  async function getEntryCount(type) {
    try {
      const { data, error, count } = await supabase
        .from(type)
        .select('id', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching data:', error);
        return 0; // or handle the error as needed
      }

      return count;
    } catch (error) {
      console.error('Error in getEntryCount:', error);
      return 0; // or handle the error as needed
    }
  }
  useEffect(() => {
    async function fetchCounts() {
      const counts = await Promise.all(types.map(async (type) => {
        const count = await getEntryCount(type);
        return { type, count };
      }));

      const newTypeCounts = {...typeCounts};
      counts.forEach(({ type, count }) => {
        newTypeCounts[type] = count;
      });
      setTypeCounts(newTypeCounts);
    }

    fetchCounts();
  }, []);
  return (
    <div className='adminPageWrapper' >
      <h1 className={`${styles.adminHomeTitle} pageTitle`}>ADMIN HOME</h1>
      <div className={styles.homeGrid}>
        <div className={styles.sectionWrapper}>
          <Link href='/admin/new-post'>
            <FontAwesomeIcon icon={faAdd} className={styles.addIcon}/>
          </Link>
          <div className={styles.titleWrapper}>
            <Link href='/admin/list?type=posts'>
              <h2 className={styles.link}>POSTS</h2>
            </Link>
          </div>
          {/* {typeCounts.drafts ? <button onClick={() => setExpanded('posts')} className={styles.resumeDraft}>RESUME DRAFT</button> : null} */}
          <p>{`Total Posts: ${typeCounts.posts}`}</p>
          {/* <p>Number of EXPIRED posts</p> */}
        </div>

        {/* <div className={styles.sectionWrapper}>
          <Link href='/admin/new-content?type=events'>
            <FontAwesomeIcon icon={faAdd} className={styles.addIcon}/>
          </Link>
          <div className={styles.titleWrapper}>
            <Link href='/admin/list?type=events'>
              <h2 className={styles.link}>EVENTS</h2>
            </Link>
          </div>
          <p>{`Total Events: ${typeCounts.events}`}</p>
        </div> */}

        <div className={styles.sectionWrapper}>
          <Link href='/admin/new-content?type=electives'>
            <FontAwesomeIcon icon={faAdd} className={styles.addIcon}/>
          </Link>
          <div className={styles.titleWrapper}>
            <Link href='/admin/list?type=electives'>
              <h2 className={styles.link}>ELECTIVES</h2>
            </Link>
          </div>
          <p>{`Total Electives: ${typeCounts.electives}`}</p>
        </div>

        <div className={styles.sectionWrapper}>
          <Link href='/admin/new-content?type=clubs'>
            <FontAwesomeIcon icon={faAdd} className={styles.addIcon}/>
          </Link>
          <div className={styles.titleWrapper}>
            <Link href='/admin/list?type=clubs'>
              <h2 className={styles.link}>CLUBS</h2>
            </Link>
          </div>
          <p>{`Total Clubs: ${typeCounts.clubs}`}</p>
        </div>

        <div className={styles.sectionWrapper}>
          <Link href='/admin/new-content?type=links'>
            <FontAwesomeIcon icon={faAdd} className={styles.addIcon}/>
          </Link>
          <div className={styles.titleWrapper}>
            <Link href='/admin/list?type=links'>
              <h2 className={styles.link}>LINKS</h2>
            </Link>
          </div>
          <p>{`Total Links: ${typeCounts.links}`}</p>
        </div>

        {/* <div className={styles.sectionWrapper}>
            <Link href='/admin/new-content?type=staff'>
              <FontAwesomeIcon icon={faAdd} className={styles.addIcon}/>
            </Link>
          <div className={styles.titleWrapper}>
            <Link href='/admin/list?type=staff'>
              <h2 className={styles.link}>STAFF</h2>
            </Link>
          </div>
          <p>{`Total Staff: ${typeCounts.staff}`}</p>
        </div> */}
      </div>
      {/* <h3 className='pageTitle'>Update Social Media Links</h3> */}
    </div>
  );
}