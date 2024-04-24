import styles from './staffBlock.module.css'

export default function StaffBlock({ staff }) {

  console.log('staff:', staff)
  return (
    <div className={styles.staffBlockWrapper}>
      <img src={staff.image} alt={staff.name} className={styles.staffImage} />
      <div className={styles.staffInfoWrapper}>
        <p className={styles.staffName}>{staff.name}</p>
        <p className={styles.staffPosition}>{staff.position}</p>
        <div className={styles.staffContactWrapper}>
          <p className={styles.staffEmail}>{staff.email}</p>
          <p className={styles.staffPhone}>{staff.phone}</p>
        </div>
        {staff.bio && <p className={styles.staffDescription}>{staff.bio}</p>}
      </div>
    </div>
  )

}