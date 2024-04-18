import styles from './electives.module.css'

export default function Electives() {
  const electivesData = {};

  const electiveBlock = (
    <div className={styles.electiveWrapper}>
      {/* <div className={styles.infoWrapper}> */}
        <div className={styles.titleWrapper}>
          <h2 className={styles.classTitle}>Engineering & Skateboarding</h2>
        </div>
        <div className={styles.descriptionWrapper}>
          <p className={styles.classText}>The design and construction of skateboard decks, ramps, and skateparks includes a lot of
    engineering! In this class you will learn all about foundational engineer concepts, use
    design/engineering software, and maybe learn how to do an ollie!!!</p>
          {/* <p className={styles.classText}>Taught By: Mr. Martin</p> */}
          <p className={styles.cte}>CTE Bridge Course</p>
        </div>
      {/* </div> */}
      <div className={styles.photoWrapper}>
        <div className={styles.photo}></div>
        <div className={styles.overlay}></div>
      </div>
    </div>
  )

  return (
    <div className='feedWrapper'>
      <h1 className={styles.pageTitle}>2023/24 Electives</h1>
      {electiveBlock}
    </div>
  )
}