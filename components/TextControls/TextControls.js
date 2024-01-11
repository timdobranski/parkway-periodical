import { RichUtils } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faListOl, faListUl, faUndo, faRedo, faAlignLeft, faAlignCenter, faAlignRight } from '@fortawesome/free-solid-svg-icons';
import styles from './TextControls.module.css';

export default function TextControls({ editorState, onToggle, onUndo, onRedo, isEditable, onAlignmentToggle }) {



  if (!isEditable) return null;

  return (
    <div className={styles.controls}>
      <div className={styles.undoRedoWrapper}>
        <FontAwesomeIcon icon={faUndo} onClick={onUndo} />
        <FontAwesomeIcon icon={faRedo} onClick={onRedo} />
      </div>
      <FontAwesomeIcon icon={faBold} onClick={() => onToggle('BOLD')} />
      <div className={styles.alignmentWrapper}>
        <FontAwesomeIcon icon={faAlignLeft} onClick={() => onAlignmentToggle('left')} />
        <FontAwesomeIcon icon={faAlignCenter} onClick={() => onAlignmentToggle('center')} />
        <FontAwesomeIcon icon={faAlignRight} onClick={() => onAlignmentToggle('right')} />
      </div>
      <div className={styles.listsWrapper}>
        <FontAwesomeIcon icon={faListOl} onClick={() => onToggle('ordered-list-item')} />
        <FontAwesomeIcon icon={faListUl} onClick={() => onToggle('unordered-list-item')} />
      </div>
    </div>
  );
};
