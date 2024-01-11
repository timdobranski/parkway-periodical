'use client'

import { useState, useRef } from 'react';
import { RichUtils } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faListOl, faListUl, faUndo, faRedo, faAlignLeft, faAlignCenter, faAlignRight, faPalette, faHighlighter } from '@fortawesome/free-solid-svg-icons';
import styles from './TextControls.module.css';

export default function TextControls({ editorState, onToggle, onUndo, onRedo, isEditable, onAlignmentToggle, addColorToMap, applyColor }) {
  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('#FFFF00');

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

  if (!isEditable) return null;

  return (
    <div className={styles.controls}>
      <div className={styles.undoRedoWrapper}>
        <FontAwesomeIcon icon={faUndo} onClick={onUndo} />
        <FontAwesomeIcon icon={faRedo} onClick={onRedo} />
      </div>
      <FontAwesomeIcon icon={faBold} onClick={() => onToggle('BOLD')} />
      <input
        type="color"
        ref={textColorRef}
        value={textColor}
        onChange={handleTextColorChange}
        style={{ display: 'none' }}
      />
      <FontAwesomeIcon icon={faPalette}
        onClick={(e) => openColorPicker(e, textColorRef)}

      />
      <input
        type="color"
        ref={highlightColorRef}
        value={highlightColor}
        onChange={handleHighlightColorChange}
        style={{ display: 'none' }}
      />
      <FontAwesomeIcon icon={faHighlighter} onClick={(e) => openColorPicker(e, highlightColorRef)} />
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
