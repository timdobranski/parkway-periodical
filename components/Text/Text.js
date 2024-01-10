import styles from './Text.module.css';
import { useEffect, useRef } from 'react';
import { Editor, RichUtils, EditorState, Modifier } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import TextControls from '../TextControls/TextControls';


export default function Text({ key, editorState, setEditorState, isEditable, onFocus, onBlur }) {
  const editorRef = useRef(null);
  const contentState = editorState.getCurrentContent();
  const html = stateToHTML(contentState);

  // Make the editor focus when the component mounts
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  const handleToggle = (style) => {
    // For inline styles
    if (['BOLD', 'ITALIC', 'UNDERLINE'].includes(style)) {
      setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    }
    // For block types
    else if (['ordered-list-item', 'unordered-list-item'].includes(style)) {
      setEditorState(RichUtils.toggleBlockType(editorState, style));
    }
  };
  const handleUndo = () => {
    setEditorState(EditorState.undo(editorState));
  };
  const handleRedo = () => {
    setEditorState(EditorState.redo(editorState));
  };
  function getBlockStyle(block) {
    switch (block.getData().get('textAlign')) {
      case 'left':
        return 'align-left';
      case 'center':
        return 'align-center';
      case 'right':
        return 'align-right';
      default:
        return '';
    }
  }
  const applyTextAlignment = (alignment) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const block = contentState.getBlockForKey(selection.getStartKey());

    const newContentState = Modifier.setBlockData(
      contentState,
      selection,
      new Map([['textAlign', alignment]]) // Corrected usage of Map
    );

    setEditorState(EditorState.push(editorState, newContentState, 'change-block-data'));
  };

  return (
    <div className={styles.textEditorWrapper}>
      {isEditable ? (
        <>
          <TextControls
            editorState={editorState}
            onToggle={handleToggle}
            onUndo={handleUndo}
            onRedo={handleRedo}
            isEditable={isEditable}
            onAlignmentToggle={applyTextAlignment}
          />
          <Editor
            ref={editorRef}
            editorState={editorState}
            onChange={setEditorState}
            readOnly={!isEditable}
            onFocus={onFocus}
            onBlur={onBlur}
            blockStyleFn={getBlockStyle}
          />
        </>
      ) : (
        // Render a static preview of the editor content
        <div className={styles.preview}>
          <div className={styles.preview} dangerouslySetInnerHTML={{ __html: html }}></div>
        </div>
      )}
    </div>
  )
}