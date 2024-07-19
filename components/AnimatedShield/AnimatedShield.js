import styles from './AnimatedShield.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function AnimatedShield({ finishedLoading }) {

  if (!finishedLoading) {
    return (
      <div className={styles.loadingPlaceholder}>
      <div className={styles.background}></div>
      <FontAwesomeIcon icon={faSpinner} className={styles.loading} />
    </div>
    )
  }

  return(
    <div className={`${styles.wrapper}`} key={finishedLoading}>
      <div className={styles.finalShield}></div>
      <div className={`${styles.soccer} ${styles.item}`}></div>
      <div className={`${styles.skateboard} ${styles.item}`}></div>
      <div className={`${styles.atom} ${styles.item}`}></div>
    </div>
  )
}