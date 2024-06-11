import styles from './register.module.css';

export default function Register() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.headerBar}>
        <h1 className='siteTitle'>PARKWAY PERIODICAL</h1>
      </div>
      <h2 className='postTitle'>New User Signup</h2>
      <p className={styles.instructions}>To complete registration, fill in the fields below:</p>
      <form className={styles.registrationForm}>

        <div className={styles.formSection}>
          <label className={styles.formLabel}>First Name:</label>
          <input className={styles.formInput} type="text" name="first_name" />
          <p className={styles.required}>required</p>
        </div>

        <div className={styles.formSection}>
          <label className={styles.formLabel}>Last Name:</label>
          <input className={styles.formInput} type="text" name="last_name" />
          <p className={styles.required}>required</p>

        </div>

        {/* <div className={styles.formSection}>
          <label className={styles.formLabel}>Email:</label>
          <input className={styles.formInput} type="email" name="email" />
        </div> */}

        <div className={styles.formSection}>
          <label className={styles.formLabel}>Password:</label>
          <input className={styles.formInput} type="password" name="password" />
          <p className={styles.required}>required</p>

        </div>

        <div className={styles.formSection}>
          <label className={styles.formLabel}>Position:</label>
          <input className={styles.formInput} type="text" name="position" />
          <p className={styles.required}>required</p>

        </div>

        <div className={styles.formSection}>
          <label className={styles.formLabel}>Photo:</label>
          <input className={styles.formInput} type="file" name="photo" />
        </div>

        <button className={styles.completeSignupButton} type="submit">Complete Sign Up</button>
      </form>
    </div>
  );
}
