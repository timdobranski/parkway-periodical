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
        <p className='centeredWhiteText'>{`Welcome to the Parkway Periodical! You've made it to the official parent & community newsletter for
            Parkway Health & Sciences Academy. We're glad you're here! Browse the resources below to learn more about our
            elective classes, clubs, staff and more.`}</p>

        <div className={styles.sectionWrapper}>
          <Link href='/public/info/electives' className={styles.link}>
            <h3 className='whiteSubTitle'>ELECTIVES</h3>
          </Link>
          <p className='centeredWhiteText'>Check out our amazing student elective courses</p>
        </div>
        <div className={styles.sectionWrapper}>
          <Link href='/public/info/clubs' className={styles.link}>
            <h3 className='whiteSubTitle'>CLUBS</h3>
          </Link>
          <p className='centeredWhiteText'>Learn about the before & after school clubs we offer</p>
        </div>
        <div className={styles.sectionWrapper}>
          <Link href='/public/info/links' className={styles.link}>
            <h3 className='whiteSubTitle'>LINKS</h3>
          </Link>
          <p className='centeredWhiteText'>Find important resources here</p>
        </div>
        <div className={styles.sectionWrapper}>
          <Link href='/public/info/staff' className={styles.link}>
            <h3 className='whiteSubTitle'>STAFF</h3>
          </Link>
          <p className='centeredWhiteText'>Meet our wonderful staff!</p>
          {/* </div> */}
        </div>

        {/* <p >{`Welcome to the Parkway Periodical! You've made it to the official parent & community newsletter for Parkway Health & Sciences Academy. We're glad you're here!`}</p>

          <h3>{`New 2023/24 Administrative and Counseling Staff`}</h3>
          <p>{`To kick things off, please help Parkway welcome some new staff members in the main office!`}</p>
          <p>{`First, our Assistant Principal, Ms. Lunde, has accepted a position at the district office and we wish her the best in her new endeavor.
          Parkway Academy now has TWICE the amount of Assistant Principal support and proudly introduces Ms. Marisa Chaniot and
          Dr. Joel Miller to the team as our TWO new full-time Assistant Principals.`}</p>

          <p>{`Overseeing 7th grade students, Ms. Chaniot hails from
          Chula Vista Elementary School District, where she was a teacher for over 18 years. Dr. Miller will oversee 8th graders,
          and also comes to us from Chula Vista--in Sweetwater District--where he was as a teacher and Assistant Principal before serving at STEAM Academy
          last school year. Both will oversee 6th grade students and we're thrilled to have them on the team!`}</p>

          <p>{`Also please help us
          welcome Ms. Katrina Tabor, joining us as a second counselor, which will DOUBLE the amount of counseling support our Parkway students
          receive this school year. This new, significantly larger team of main office and administration staff will mean more support our
          students as they navigate middle school, helping to ensure our students are ready for the next step.`}</p> */}
      </div>

    </div>
  );
}