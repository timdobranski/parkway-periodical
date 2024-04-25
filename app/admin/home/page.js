import styles from './home.module.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faAdd } from '@fortawesome/free-solid-svg-icons';

export default function AdminHomePage() {
  return (
    <>
      <h1 className='pageTitle'>ADMIN HOME</h1>
      <div className={styles.homeGrid}>

        <div className={styles.sectionWrapper}>
          <div className={styles.titleWrapper}>
            <Link href='/admin/new-post'>
              <FontAwesomeIcon icon={faAdd} className={styles.addIcon}/>
            </Link>
            <Link href='/admin/list?type=posts'>
              <h2 className={styles.link}>POSTS</h2>
            </Link>
          </div>
          <p>Number of posts</p>
          <p>Number of EXPIRED posts</p>

        </div>

        <div className={styles.sectionWrapper}>
          <div className={styles.titleWrapper}>
            <Link href='/admin/new-content?type=electives'>
              <FontAwesomeIcon icon={faAdd} className={styles.addIcon}/>
            </Link>
            <Link href='/admin/list?type=electives'>
              <h2 className={styles.link}>ELECTIVES</h2>
            </Link>
          </div>
        </div>

        <div className={styles.sectionWrapper}>
          <div className={styles.titleWrapper}>
            <Link href='/admin/new-content?type=clubs'>
              <FontAwesomeIcon icon={faAdd} className={styles.addIcon}/>
            </Link>
            <Link href='/admin/list?type=clubs'>
              <h2 className={styles.link}>CLUBS</h2>
            </Link>
          </div>
        </div>

        <div className={styles.sectionWrapper}>
          <div className={styles.titleWrapper}>
            <Link href='/admin/new-content?type=staff'>
              <FontAwesomeIcon icon={faAdd} className={styles.addIcon}/>
            </Link>
            <Link href='/admin/list?type=staff'>
              <h2 className={styles.link}>STAFF</h2>
            </Link>
          </div>
        </div>

        <div className={styles.sectionWrapper}>
          <div className={styles.titleWrapper}>
            <Link href='/admin/new-content?type=links'>
              <FontAwesomeIcon icon={faAdd} className={styles.addIcon}/>
            </Link>
            <Link href='/admin/list?type=links'>
              <h2 className={styles.link}>LINKS</h2>
            </Link>
          </div>
        </div>

        <div className={styles.sectionWrapper}>
          <Link href='/admin/settings'>
            <h2 className={styles.link}>SETTINGS</h2>
          </Link>
        </div>
      </div>
      <h3 className='pageTitle'>Update Social Media Links</h3>
    </>
  );
}