// import supabase from '../../utils/supabase.js';
// import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { login } from './actions'


export default function Login() {
  let showPassword = false;
  // const router = useRouter();



  return (
    <div className={styles.loginContainer}>
      <img src="/images/logos/parkway.webp" alt="Parkway Periodical Logo" className={styles.logo} />
      <form className={styles.loginForm}>
        <h1 className='siteTitle'>PARKWAY PERIODICAL</h1>
        <h3 className={styles.loginHeader}>Login</h3>
        <input
          id='email'
          name='email'
          type="email"
          placeholder="Email"
          className={styles.loginInput}
          required
        />

        <div className={styles.inputContainer}>
          <input
            id='password'
            name='password'
            type='password'
            placeholder="Password"
            className={styles.loginInput}
            required
          />
          {/* <FontAwesomeIcon
            onClick={() => showPassword = !showPassword}
            className={styles.togglePasswordIcon}
            icon={showPassword ? faEye : faEyeSlash}
          /> */}
        </div>
        <a href="/forgotPassword" className={styles.forgotPassword}>Forgot Password?</a>


        <button formAction={login} className={styles.loginButton}>Login</button>
      </form>
    </div>
  );
}
