import styles from './ElectiveBlock.module.css'

export default function ElectiveBlock({ electiveData, color }) {


  return (
    <>
      <h2 className={styles.classTitle}>{electiveData.title}</h2>

      <div className={styles.electiveWrapper}>
        {/* <div className={styles.infoWrapper}> */}
        {/* <div className={`${color === 'red' ? styles.titleWrapperRed : styles.titleWrapperBlue}`}>
          <h2 className={styles.classTitle}>{electiveData.title}</h2>
        </div> */}
        <div className={styles.descriptionWrapper}>
          <p className={styles.classText}>{electiveData.description}</p>
          {/* <p className={styles.classText}>Taught By: Mr. Martin</p> */}
          {electiveData.cte && <p className={styles.cte}>CTE Bridge Course</p>}
          <p className={`${electiveData.type === 'Year Long' ? styles.yearLong : styles.trimester}`}>{electiveData.type}</p>
        </div>
        {/* </div> */}
        <div className={` ${color === 'red' ? styles.redPhotoWrapper : styles.bluePhotoWrapper}`}>
          <img src={electiveData.image}className={styles.photo}></img>
          <div className={`${color === 'red' ? styles.redOverlay : styles.blueOverlay}`}></div>
        </div>
      </div>
    </>
  )
}