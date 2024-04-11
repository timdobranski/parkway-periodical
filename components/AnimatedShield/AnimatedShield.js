import styles from './AnimatedShield.module.css'

export default function AnimatedShield({ finishedLoading }) {
  if (!finishedLoading) {
    return (
      // <div className={styles.loadingPlaceholder}></div>
      null
    )

  }

  return(
    <div className={`${styles.wrapper} ${styles.changeBackground}`}>
      <div className={styles.finalShield}></div>
      <div className={`${styles.soccer} ${styles.item}`}></div>
      <div className={`${styles.skateboard} ${styles.item}`}></div>
      <div className={`${styles.atom} ${styles.item}`}></div>
    </div>
  )
}