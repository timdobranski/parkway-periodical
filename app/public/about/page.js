import styles from './about.module.css';

export default function About() {



  return (
    <>
      <div className='post'>
        <h1>About Us</h1>

        <p>Welcome to the Parkway Periodical!</p>
        <p>{`You've made it to the official parent & community newsletter for Parkway Health & Sciences Academy. We're glad you're here!`}</p>

        <h3>{`New Administrative and Counseling Staff`}</h3>


        <p>{`To kick things off, please help Parkway welcome some new staff members in the main office!
        First, our Assistant Principal, Ms. Lunde, has accepted a position at the district office and we wish her the best in her new endeavor.
        Parkway Academy now has TWICE the amount of Assistant Principal support and proudly introduces Ms. Marisa Chaniot and
        Dr. Joel Miller to the team as our TWO new full-time Assistant Principals. Overseeing 7th grade students, Ms. Chaniot hails from
        Chula Vista Elementary School District, where she was a teacher for over 18 years. Dr. Miller will oversee 8th graders,
        and also comes to us from Chula Vista--in Sweetwater District--where he was as a teacher and Assistant Principal before serving at STEAM Academy
        last school year. Both will oversee 6th grade students and we're thrilled to have them on the team! Also please help us
        welcome Ms. Katrina Tabor, joining us as a second counselor, which will DOUBLE the amount of counseling support our Parkwat students
        receive this school year. This new, significantly larger team of main office and administration staff will mean more support our
        students as they navigate middle school, helping to ensure our students are ready for the next step.`}</p>

        <div className={styles.staffWrapper}>
          <div className={styles.staffMember}>
            <div className={styles.staffPhotoWrapper}>
              <img src={'/images/staff/ruth.jpeg'} className={styles.staffPhoto} alt="Mr. Ruth" />
            </div>
          <h3>Jacob Ruth</h3>
          <p>Principal</p>
          <p>{`Ext. 1199`}</p>
          <p>{`jacob.ruth@lmsvschools.org`}</p>
        </div>
        <div className={styles.staffMember}>
        <div className={styles.staffPhotoWrapper}>
          <img src={'/images/staff/chaniot.jpeg'} className={styles.staffPhoto} alt="Ms. Chaniot" />
       </div>

          <h3>Marisa Chaniot</h3>
          <p>Assistant Principal, 6th/7th Grade</p>
          <p>{`Ext. 1194`}</p>
          <p>{`marisa.chaniot@lmsvschools.org`}</p>
        </div>
        <div className={styles.staffMember}>
        <div className={styles.staffPhotoWrapper}>
          <img src={'/images/staff/crook.jpeg'} className={styles.staffPhoto} alt="Mr. Crook" />
        </div>

          <h3>Daniel Crook</h3>
          <p>Assistant Principal, 6th/8th grade</p>
          <p>{`Ext. 1193`}</p>
          <p>daniel.crook@lmsvschools.org</p>
        </div>
      </div>
      </div>
    </>
  );
}