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
        <Link href='/'><h2>HOME</h2></Link>
        <Link href='/posts'><h2>POSTS</h2></Link>
        <Link href='/archive'><h2>ARCHIVE</h2></Link>
        <Link href='/about'><h2>ABOUT US</h2></Link>
      </div>
    </div>
  )

}