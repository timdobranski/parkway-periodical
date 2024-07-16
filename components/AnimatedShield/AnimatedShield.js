import styles from './AnimatedShield.module.css'

export default function AnimatedShield({ finishedLoading }) {
  if (!finishedLoading) {
    return (
      <div className={styles.loadingPlaceholder}></div>

    )

  }

  return(
    <div className={`${styles.wrapper}`}>
      <div className={styles.finalShield}></div>
      <div className={`${styles.soccer} ${styles.item}`}></div>
      <div className={`${styles.skateboard} ${styles.item}`}></div>
      <div className={`${styles.atom} ${styles.item}`}></div>
    </div>
  )
}