import styles from './archive.module.css';

export default function Archive() {

  return (
    <div className={styles.archiveWrapper}>
      <h1>Archive</h1>
      <p>{`Since this is the first year of the Parkway Periodical, we don't have any archived school years yet!`}</p>
      <p>In the future, this page will contain links to the archived school years.</p>
    </div>

  )

}