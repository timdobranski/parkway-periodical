import styles from './Header.module.css';
import logo from '../../public/images/logos/parkway.png';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <Image src={logo} alt="Parkway Academy Logo" fill='true'/>
      </div>
      <h1>Parkway Periodical</h1>
      <div className={styles.navContainer}>
        <h2>HOME</h2>
        <h2>STAFF</h2>
        <h2>ABOUT US</h2>
        <h2>CONTACT</h2>
        </div>
    </div>
  )

}