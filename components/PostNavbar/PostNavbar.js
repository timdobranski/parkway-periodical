import styles from './PostNavbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faVideo, faFont } from '@fortawesome/free-solid-svg-icons';

export default function PostNavbar({ onAddText, onAddPhoto, onAddVideo }) {

  return (
    <div className={styles.navbarWrapper}>
      <div className={styles.navbarRow}>
        <div onClick={onAddText} className={styles.navbarItem}>
        <FontAwesomeIcon icon={faFont} className={styles.icon} />
        <h3>Add Text</h3>
        </div>
      <div onClick={onAddPhoto} className={styles.navbarItem}>
        <FontAwesomeIcon icon={faImage} className={styles.icon} />
        <h3>Add Photos</h3>
      </div>
      <div onClick={onAddVideo} className={styles.navbarItem}>
        <FontAwesomeIcon icon={faVideo} className={styles.icon} />
        <h3>Add a Video</h3>
      </div>
      <div onClick={onAddVideo} className={styles.navbarItem}>
        {/* <FontAwesomeIcon icon={faVideo} className={styles.icon} /> */}
        <h3 className={styles.publishButton}>PUBLISH</h3>
      </div>

      </div>
    </div>
  )
}