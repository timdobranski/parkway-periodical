'use client'

import { useState, useRef } from 'react';
import { RichUtils } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faListOl, faListUl, faUndo, faRedo, faAlignLeft, faAlignCenter, faAlignRight, faPalette, faHighlighter } from '@fortawesome/free-solid-svg-icons';
import styles from './TextControls.module.css';

export default function TextControls({
  editorState, setEditorState, onToggle, onUndo, onRedo, isEditable,
  onToggleBold, onAlignmentToggle, addColorToMap, applyColor, isActive }) {
  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('#FFFF00');

  const handleIconClick = (action) => {
    console.log('inside handle icon click! action: ', action)
    if (isActive || !isActive) {
      console.log('inside handle icon click! isActive')
      action();
    }
  };

  const openColorPicker = (event, pickerRef) => {
    event.preventDefault();
    event.stopPropagation();
    if (pickerRef.current) {
      pickerRef.current.click();
    }
  };

  const handleTextColorChange = (event) => {
    const newColor = event.target.value;
    setTextColor(newColor);
    addColorToMap(newColor, 'TEXT_COLOR');
    applyColor(newColor, 'TEXT_COLOR');
  };
  const handleHighlightColorChange = (event) => {
    const newColor = event.target.value;
    setHighlightColor(newColor);
    addColorToMap(newColor, 'HIGHLIGHT_COLOR');
    applyColor(newColor, 'HIGHLIGHT_COLOR');
  };

  const textColorRef = useRef(null);
  const highlightColorRef = useRef(null);


  return (
    <div className={styles.controls}>
      <div className={styles.undoRedoWrapper}>
        <FontAwesomeIcon icon={faUndo} onClick={() => handleIconClick(onUndo)} />
        <FontAwesomeIcon icon={faRedo} onClick={() => handleIconClick(onRedo)} />
      </div>
      <FontAwesomeIcon icon={faBold} onClick={() => handleIconClick(onToggleBold)} />
      <input
        type="color"
        ref={textColorRef}
        value={textColor}
        onChange={handleTextColorChange}
        style={{ display: 'none' }}
      />
      <FontAwesomeIcon icon={faPalette}
        onClick={(e) => handleIconClick(openColorPicker(e, textColorRef))}

      />
      <input
        type="color"
        ref={highlightColorRef}
        value={highlightColor}
        onChange={handleHighlightColorChange}
        style={{ display: 'none' }}
      />
      <FontAwesomeIcon icon={faHighlighter} onClick={(e) => handleIconClick(openColorPicker(e, highlightColorRef))} />
      <div className={styles.alignmentWrapper}>
        <FontAwesomeIcon icon={faAlignLeft} onClick={() => handleIconClick(onAlignmentToggle('left'))} />
        <FontAwesomeIcon icon={faAlignCenter} onClick={() => handleIconClick(onAlignmentToggle('center'))} />
        <FontAwesomeIcon icon={faAlignRight} onClick={() => handleIconClick(onAlignmentToggle('right'))} />
      </div>
      <div className={styles.listsWrapper}>
        <FontAwesomeIcon icon={faListOl} onClick={() => handleIconClick(onToggle('ordered-list-item'))} />
        <FontAwesomeIcon icon={faListUl} onClick={() => handleIconClick(onToggle('unordered-list-item'))} />
      </div>
    </div>
  );
};
