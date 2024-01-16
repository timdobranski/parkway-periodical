'use client'

import styles from './Text.module.css';
import { useEffect, useRef, useState } from 'react';
import { Editor, RichUtils, EditorState, Modifier, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import TextControls from '../TextControls/TextControls';


export default function Text({ key, editorState, setEditorState, isEditable, onFocus, onBlur, setActiveBlock, index }) {
  const editorRef = useRef(null);
  const contentState = editorState ? editorState.getCurrentContent() : null;
  const blockStyleFn = (block) => {
    const textAlign = block.getData().get('textAlign');
    if (textAlign) {
      return {
        style: {
          textAlign: textAlign,
        },
      };
    }
  };



  // // Make the editor focus when the component mounts
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);


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
      new Map([['textAlign', alignment]])
    );

    setEditorState(EditorState.push(editorState, newContentState, 'change-block-data'));
  };
  const renderHTMLPreview = () => {
    if (editorState) {
      const contentState = editorState.getCurrentContent();

      // Check if the content state has text
      if (!contentState.hasText()) {
        // Return a message if there's no text
        return '<p>No text added yet</p>';
      }

      const html = stateToHTML(contentState);
      console.log('HTML Preview:', html); // Debugging line
      return html;
    }

    console.log('EditorState is empty'); // Debugging line
    return '<p>No text added yet</p>'; // Default message if editorState is not available
  };

  return (
    <div className={styles.textEditorWrapper}>
      {isEditable ? (
        <div className={styles.editorContainer}>

          <Editor
            ref={editorRef}
            editorState={editorState}
            onChange={setEditorState}
            readOnly={!isEditable}
            onFocus={onFocus}
            onBlur={onBlur}
            blockStyleFn={getBlockStyle}
          />
        </div>
      ) : (
        // Render a static preview of the editor content
        <div className={styles.preview} onClick={() => {setActiveBlock(index)}} dangerouslySetInnerHTML={{ __html: renderHTMLPreview() }} />

      )}
    </div>
  )
}