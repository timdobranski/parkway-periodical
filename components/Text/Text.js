'use client'

import styles from './Text.module.css';
import { useEffect, useRef, useState } from 'react';
import { Editor, RichUtils, EditorState, Modifier, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import TextControls from '../TextControls/TextControls';


export default function Text({ key, editorState, setEditorState, isEditable, onFocus, onBlur, onToggleBold }) {
  const editorRef = useRef(null);
  const contentState = editorState.getCurrentContent();
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
  // render preview html options
  const options = {
    blockStyleFn: blockStyleFn,
    inlineStyleFn: (styles) => {
      const styleObjects = [];

      styles.forEach(style => {
        if (style.startsWith('TEXT_COLOR')) {
          // Extract color code after 'TEXT_COLOR' (including the '#')
          const color = style.replace('TEXT_COLOR', '').trim();
          styleObjects.push({
            element: 'span',
            style: { color: color },
          });
        } else if (style.startsWith('HIGHLIGHT_COLOR')) {
          // Extract color code after 'HIGHLIGHT_COLOR' (including the '#')
          const backgroundColor = style.replace('HIGHLIGHT_COLOR', '').trim();
          styleObjects.push({
            element: 'span',
            style: { backgroundColor: backgroundColor },
          });
        }
      });

      return styleObjects.length > 0 ? styleObjects : null;
    },
  };

  // console.log('raw content state: ', JSON.stringify(convertToRaw(contentState)));

  // renderable html of text block for preview when not editing
  const html = stateToHTML(contentState, options);
  console.log('html preview: ', html);
  console.log(editorState.getCurrentInlineStyle().toArray());

  // // style object to pass inline styles to Draft.js Editor component
  // const [styleMap, setStyleMap] = useState({
  //   'TEXT_COLOR': {},
  //   'HIGHLIGHT_COLOR': {}
  // });
  // const applyColor = (color, stylePrefix) => {
  //   const selection = editorState.getSelection();
  //   const nextContentState = Object.keys(styleMap)
  //     .filter(key => key.startsWith(stylePrefix))
  //     .reduce((contentState, key) => {
  //       return Modifier.removeInlineStyle(contentState, selection, key)
  //     }, editorState.getCurrentContent());

  //   let nextEditorState = EditorState.push(
  //     editorState,
  //     nextContentState,
  //     'change-inline-style'
  //   );

  //   const currentStyle = editorState.getCurrentInlineStyle();

  //   if (selection.isCollapsed()) {
  //     nextEditorState = currentStyle.reduce((state, key) => {
  //       return RichUtils.toggleInlineStyle(state, key);
  //     }, nextEditorState);
  //   }

  //   // If the color is being toggled on, apply it
  //   if (!currentStyle.has(stylePrefix + color.toUpperCase())) {
  //     nextEditorState = RichUtils.toggleInlineStyle(
  //       nextEditorState,
  //       stylePrefix + color.toUpperCase()
  //     );
  //   }

  //   setEditorState(nextEditorState);
  // };

  // const addColorToMap = (color, stylePrefix) => {
  //   const newStyle = {
  //     color: stylePrefix === 'TEXT_COLOR' ? color : 'inherit',
  //     backgroundColor: stylePrefix === 'HIGHLIGHT_COLOR' ? color : 'inherit'
  //   };
  //   setStyleMap(prevStyleMap => ({
  //     ...prevStyleMap,
  //     [stylePrefix + color.toUpperCase()]: newStyle
  //   }));
  // };
  // // Make the editor focus when the component mounts
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
  //   // For block types
    else if (['ordered-list-item', 'unordered-list-item'].includes(style)) {
      setEditorState(RichUtils.toggleBlockType(editorState, style));
    }
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
      new Map([['textAlign', alignment]])
    );

    setEditorState(EditorState.push(editorState, newContentState, 'change-block-data'));
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
            onToggleBold={onToggleBold}
            // customStyleMap={styleMap}
          />
        </div>
      ) : (
        // Render a static preview of the editor content
        <div className={styles.preview}>
          <div dangerouslySetInnerHTML={{ __html: html }}></div>
        </div>
      )}
    </div>
  )
}