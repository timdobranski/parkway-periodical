import styles from './Header.module.css';
import logo from '../../public/images/logos/parkway.png';
import Image from 'next/image';

export default function Header() {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <Image src={logo} alt="Parkway Academy Logo" fill='true'/>
      </div>
      <h1>Parkway Periodical</h1>
    </div>
  )

}