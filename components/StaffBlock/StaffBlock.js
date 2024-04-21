import styles from './staffBlock.module.css'

export default function StaffBlock({ staff }) {

  console.log('staff:', staff)
  return (
    <div className={styles.staffBlockWrapper}>
      <img src={staff.image} alt={staff.name} className={styles.staffImage} />
      <div className={styles.staffInfoWrapper}>
        <p className={styles.staffName}>{staff.name}</p>
        <p className={styles.staffPosition}>{staff.position}</p>
        {staff.bio && <p className={styles.staffDescription}>{staff.bio}</p>}
        <p className={styles.staffEmail}>{staff.email}</p>
        <p className={styles.staffPhone}>{staff.phone}</p>
      </div>
    </div>
  )

}