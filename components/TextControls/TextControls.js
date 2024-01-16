'use client'

import { useState, useRef } from 'react';
import { RichUtils } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faListOl, faListUl, faUndo, faRedo, faAlignLeft, faAlignCenter, faAlignRight, faPalette, faHighlighter } from '@fortawesome/free-solid-svg-icons';
import styles from './TextControls.module.css';

export default function TextControls({
  editorState, setEditorState, onToggle, onUndo, onRedo, isEditable,
  onToggleBold, addColorToMap, applyColor, isActive,
  onToggleLeftAlign, onToggleCenterAlign, onToggleRightAlign,}) {

  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('#FFFF00');

  const handleIconClick = (e, action) => {
    e.preventDefault();
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
        <FontAwesomeIcon icon={faUndo} onClick={() => handleIconClick(onUndo)} className={styles.textIcon} />
        <FontAwesomeIcon icon={faRedo} onClick={() => handleIconClick(onRedo)} className={styles.textIcon} />
      </div>
      <FontAwesomeIcon icon={faBold} onClick={(e) => handleIconClick(e, onToggleBold)} className={styles.textIcon}/>
      <input
        type="color"
        ref={textColorRef}
        value={textColor}
        onChange={handleTextColorChange}
        style={{ display: 'none' }}
      />
      <FontAwesomeIcon icon={faPalette}
        onClick={(e) => handleIconClick(openColorPicker(e, textColorRef))}
        className={styles.textIcon}
      />
      <input
        type="color"
        ref={highlightColorRef}
        value={highlightColor}
        onChange={handleHighlightColorChange}
        style={{ display: 'none' }}
      />
      <FontAwesomeIcon icon={faHighlighter} onClick={(e) => handleIconClick(openColorPicker(e, highlightColorRef))} className={styles.textIcon} />
      <div className={styles.alignmentWrapper}>
        <FontAwesomeIcon icon={faAlignLeft} onClick={() => handleIconClick(onToggleLeftAlign)} className={styles.textIcon} />
        <FontAwesomeIcon icon={faAlignCenter} onClick={() => handleIconClick(onToggleCenterAlign)} className={styles.textIcon}/>
        <FontAwesomeIcon icon={faAlignRight} onClick={() => handleIconClick(onToggleRightAlign)} className={styles.textIcon}/>
      </div>
      <div className={styles.listsWrapper}>
        <FontAwesomeIcon icon={faListOl} onClick={() => handleIconClick(onToggle('ordered-list-item'))} className={styles.textIcon} />
        <FontAwesomeIcon icon={faListUl} onClick={() => handleIconClick(onToggle('unordered-list-item'))} className={styles.textIcon}/>
      </div>
    </div>
  );
};
