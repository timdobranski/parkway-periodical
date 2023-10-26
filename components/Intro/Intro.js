import Image from 'next/image';
import styles from './Intro.module.css';
import parkwayShieldEmpty from '../../public/images/logos/parkway-shield-empty.png'
import atom from '../../public/images/logos/parkway-atom.png';
import skateboard from '../../public/images/logos/parkway-skateboard.png';
import soccerBall from '../../public/images/logos/parkway-soccer.png';


export default function Intro() {


  return (
    <div className={styles.introContainer}>
      <div className={styles.imgContainer}>
        <Image src={parkwayShieldEmpty} fill='true' alt='a shield' />
      </div>
      <div className={styles.imgContainer}>
        <Image src={soccerBall} fill='true' alt='a shield' />
      </div>
      <div className={styles.imgContainer}>
        <Image src={atom} fill='true' alt='a shield' />
      </div>
      <div className={styles.imgContainer}>
        <Image src={skateboard} fill='true' alt='a shield' />
      </div>
    </div>
  )
}