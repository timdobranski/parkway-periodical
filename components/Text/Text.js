import styles from './Text.module.css';
import { useEffect, useRef } from 'react';
import { Editor, RichUtils, EditorState } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import TextControls from '../TextControls/TextControls';

export default function Text({ key, editorState, setEditorState }) {
  const editorRef = useRef(null);

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

  return (
    <div className={styles.textEditorWrapper}>
      <TextControls
        editorState={editorState}
        onToggle={handleToggle}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
      <Editor
        key={key}
        ref={editorRef}
        editorState={editorState}
        onChange={setEditorState}
      />
    </div>
  )
}