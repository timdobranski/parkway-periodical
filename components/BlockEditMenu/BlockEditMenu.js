import styles from './BlockEditMenu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faTrash, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

export default function BlockEditMenu({ addTitle, addCaption, removeBlock, moveBlockUp, moveBlockDown, setStatus }) {

  return (
    <div className={styles.blockEditMenu}>
      {setStatus && <button onClick={setStatus}><FontAwesomeIcon icon={faFloppyDisk} className={`${styles.icon} ${styles.iconSave}`}/></button>}
      {moveBlockUp && <button onClick={moveBlockUp}><FontAwesomeIcon icon={faChevronUp} className={`${styles.icon} ${styles.iconUp}`}/></button>}
      {moveBlockDown && <button onClick={moveBlockDown}><FontAwesomeIcon icon={faChevronDown} className={`${styles.icon} ${styles.iconDown}`}/></button>}
      {addTitle && <button onClick={() => {}}><FontAwesomeIcon icon={fa} className={`${styles.icon} ${styles.iconAddTitle}`}/></button>}
      {addCaption && <button onClick={() => {}}><FontAwesomeIcon icon={faTrash} className={`${styles.icon} ${styles.iconAddCaption}`}/></button>}
      {removeBlock && <button onClick={removeBlock}><FontAwesomeIcon icon={faTrash} className={`${styles.icon} ${styles.delete}`}/></button>}
    </div>
  )
}

                  {/* <div className={styles.blockControlsRight}>
                    <FontAwesomeIcon icon={index === activeBlock ? faFloppyDisk : faPencil} onClick={() => toggleEditable(index)} className={styles.iconStatus}/>
                    <FontAwesomeIcon icon={faTrashCan} onClick={() => removeBlock(index)} className={styles.iconTrash}/>
                  </div> */}