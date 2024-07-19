'use client'

import styles from './info.module.css';
import Link from 'next/link';

export default function About() {



  return (
    <div className='feedWrapper'>
      {/* <div className='post'> */}
      {/* <div className={styles.aboutWrapper}> */}
      <div className='pageTitleWrapper'>
        <h1 className='whiteTitle'>INFO</h1>
        <p className={styles.welcome}>{`Welcome to the Parkway Periodical! You've made it to the official parent & community newsletter for
            Parkway Health & Sciences Academy. We're glad you're here! Browse the resources below to learn more about our
            elective classes, clubs, staff and more.`}</p>

        <div className={styles.sectionWrapper}>
          <Link href='/public/info/electives' className={styles.link}>
            <h3 className={styles.subtitle}>ELECTIVES</h3>
          </Link>
          <p className={styles.description}>Check out our amazing student elective courses</p>
        </div>
        <div className={styles.sectionWrapper}>
          <Link href='/public/info/clubs' className={styles.link}>
            <h3 className={styles.subtitle}>CLUBS</h3>
          </Link>
          <p className={styles.description}>Learn about the before & after school clubs we offer</p>
        </div>
        <div className={styles.sectionWrapper}>
          <Link href='/public/info/links' className={styles.link}>
            <h3 className={styles.subtitle}>RESOURCES</h3>
          </Link>
          <p className={styles.description}>Find links to helpful online resources here</p>
        </div>
        <div className={styles.sectionWrapper}>
          <Link href='/public/info/events' className={styles.link}>
            <h3 className={styles.subtitle}>EVENTS</h3>
          </Link>
          <p className={styles.description}>Keep up with all our upcoming events</p>
        </div>
        <div className={styles.sectionWrapper}>
          <Link href='/public/info/staff' className={styles.link}>
            <h3 className={styles.subtitle}>OUR TEAM</h3>
          </Link>
          <p className={styles.description}>Meet the people that make Parkway great!</p>
          {/* </div> */}
        </div>
      </div>

    </div>
  );
}