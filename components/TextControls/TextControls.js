import { RichUtils } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faListOl, faListUl, faUndo, faRedo, faAlignLeft, faAlignCenter, faAlignRight } from '@fortawesome/free-solid-svg-icons';
import styles from './TextControls.module.css';

export default function TextControls({ editorState, onToggle, onUndo, onRedo, isEditable, onAlignmentToggle }) {

  // const applyTextAlignment = (alignment) => {
  //   const selection = editorState.getSelection();
  //   const contentState = editorState.getCurrentContent();
  //   const block = contentState.getBlockForKey(selection.getStartKey());

  //   const newContentState = Modifier.setBlockData(
  //     contentState,
  //     selection,
  //     new Map({ 'textAlign': alignment })
  //   );

  //   setEditorState(EditorState.push(editorState, newContentState, 'change-block-data'));
  // };

  if (!isEditable) return null;

  return (
    <div className={styles.controls}>
      <FontAwesomeIcon icon={faBold} onClick={() => onToggle('BOLD')} />
      <FontAwesomeIcon icon={faListOl} onClick={() => onToggle('ordered-list-item')} />
      <FontAwesomeIcon icon={faListUl} onClick={() => onToggle('unordered-list-item')} />
      <FontAwesomeIcon icon={faAlignLeft} onClick={() => onAlignmentToggle('left')} />
      <FontAwesomeIcon icon={faAlignCenter} onClick={() => onAlignmentToggle('center')} />
      <FontAwesomeIcon icon={faAlignRight} onClick={() => onAlignmentToggle('right')} />

      <FontAwesomeIcon icon={faUndo} onClick={onUndo} />
      <FontAwesomeIcon icon={faRedo} onClick={onRedo} />
    </div>
  );
};
