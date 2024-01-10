import { RichUtils } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faListOl, faListUl, faUndo, faRedo } from '@fortawesome/free-solid-svg-icons';
import styles from './TextControls.module.css';

export default function TextControls({ editorState, onToggle, onUndo, onRedo }) {
  return (
    <div className={styles.controls}>
      <FontAwesomeIcon icon={faBold} onClick={() => onToggle('BOLD')} />
      {/* ... other icons and their respective onClick handlers ... */}
      <FontAwesomeIcon icon={faListOl} onClick={() => onToggle('ordered-list-item')} />
      <FontAwesomeIcon icon={faListUl} onClick={() => onToggle('unordered-list-item')} />
      <FontAwesomeIcon icon={faUndo} onClick={onUndo} />
      <FontAwesomeIcon icon={faRedo} onClick={onRedo} />
      {/* ... additional controls ... */}
    </div>
  );
};
