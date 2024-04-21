import styles from './clubBlock.module.css'

export default function Club({ club }) {

  return (
    <div className={styles.clubBlockWrapper}>
      <div className={styles.clubTitleWrapper}>
        <h2 className={styles.clubTitle}>{club.title}</h2>
        <p className={styles.clubTime}>{club.time}</p>
      </div>
      <div className={styles.clubDescriptionWrapper}>
        <p className={styles.clubDescription}>{club.description}</p>
        <p className={styles.clubLocation}>{club.location}</p>
      </div>
    </div>
  )
}