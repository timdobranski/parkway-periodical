import styles from './BlockEditMenu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faTrash, faFloppyDisk, faPencil } from '@fortawesome/free-solid-svg-icons';

export default function BlockEditMenu({ removeBlock, moveBlockUp, moveBlockDown, setStatus, side, isEditable, index }) {

  return (
    <>
      <div className={styles.blockEditMenu}>
        {setStatus &&
        <button onClick={setStatus}>
          <FontAwesomeIcon icon={isEditable ? faFloppyDisk : faPencil} className={`${styles.icon} ${styles.iconSave}`}/>
        </button>}
        <div className={styles.moveBlockWrapper}>
        <button onClick={moveBlockUp ? moveBlockUp : null}>
          <FontAwesomeIcon icon={faChevronUp} className={`${styles.icon} ${styles.iconUp} ${moveBlockUp ? null : styles.iconDisabled}`}/>
        </button>
        <button onClick={moveBlockDown ? moveBlockDown : null}>
          <FontAwesomeIcon icon={faChevronDown} className={`${styles.icon} ${styles.iconUp} ${moveBlockDown ? null : styles.iconDisabled}`}/>
        </button>
          </div>
        {/* {removeBlock && <button onClick={removeBlock}><FontAwesomeIcon icon={faTrash} className={`${styles.icon} ${styles.delete}`}/></button>} */}
      </div>

      <div className={styles.blockControlsRight}>
        {removeBlock && <button onClick={removeBlock}><FontAwesomeIcon icon={faTrash} className={`${styles.icon} ${styles.delete}`}/></button>}
      </div>
    </>
  )
}

