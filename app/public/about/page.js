import styles from './about.module.css';

export default function About() {



  return (
    <div className='feedWrapper'>


      <div className='post'>
        <div className={styles.aboutWrapper}>
          <div className='pageTitleWrapper'>
            <h1 className='pageTitle'>ABOUT US</h1>
          </div>
          <div className={styles.textWrapper}>
            <p >{`Welcome to the Parkway Periodical! You've made it to the official parent & community newsletter for Parkway Health & Sciences Academy. We're glad you're here!`}</p>

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
          students as they navigate middle school, helping to ensure our students are ready for the next step.`}</p>
          </div>
          <div className={styles.staffWrapper}>
            <div className={styles.staffMember}>
              <div className={styles.staffPhotoWrapper}>
                <img src={'/images/staff/ruth.jpeg'} className={styles.staffPhoto} alt="Mr. Ruth" />
              </div>
              <h3 className='smallerTitle'>Jacob Ruth</h3>
              <p className={styles.doubleHeight}>{`Principal`}</p>
              <p>{`Ext. 1199`}</p>
              <p>{`jacob.ruth@lmsvschools.org`}</p>
            </div>
            <div className={styles.staffMember}>
              <div className={styles.staffPhotoWrapper}>
                <img src={'/images/staff/chaniot.jpeg'} className={styles.staffPhoto} alt="Ms. Chaniot" />
              </div>

              <h3 className='smallerTitle'>Marisa Chaniot</h3>
              <p>{`Assistant Principal\n
              6th/7th Grade`}</p>
              <p>{`Ext. 1194`}</p>
              <p>{`marisa.chaniot@\n
              lmsvschools.org`}</p>
            </div>
            <div className={styles.staffMember}>
              <div className={styles.staffPhotoWrapper}>
                <img src={'/images/staff/crook.jpeg'} className={styles.staffPhoto} alt="Mr. Crook" />
              </div>

              <h3 className='smallerTitle'>Daniel Crook</h3>
              <p>{`Assistant Principal\n 6th/8th grade`}</p>
              <p>{`Ext. 1193`}</p>
              <p>{`daniel.crook@\nlmsvschools.org`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}