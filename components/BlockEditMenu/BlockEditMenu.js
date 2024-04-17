import styles from './BlockEditMenu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faTrash, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

export default function BlockEditMenu({ addTitle, addCaption, removeBlock, moveBlockUp, moveBlockDown, setStatus }) {

  return (
    <div className={styles.blockEditMenu}>
      {setStatus && <button onClick={setStatus}><FontAwesomeIcon icon={faFloppyDisk} className={`${styles.icon} ${styles.iconSave}`}/></button>}
       <button onClick={moveBlockUp ? moveBlockUp : null}><FontAwesomeIcon icon={faChevronUp} className={`${styles.icon} ${moveBlockUp ? styles.iconUp : styles.iconDisabled}`}/></button>
       <button onClick={moveBlockDown ? moveBlockDown : null}><FontAwesomeIcon icon={faChevronDown} className={`${styles.icon} ${moveBlockDown ? styles.iconDown : styles.iconDisabled}`}/></button>
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