'use client'

import { useState, useEffect, useRef } from 'react';
import styles from './PrimeText.module.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { Editor } from 'primereact/editor';

export default function PrimeText({ isEditable, toggleEditable, src, blockIndex,
  updateBlockStyle, setTextState, setActiveBlock, onClick, removeBlock, viewContext
}) {

  const colorPickerOptions = (
    <>
      <option value="white" default>White</option>
      <option value="rgb(227, 227, 227)" default>10Gray</option>
      <option value="rgb(198, 198, 198)" default>20Gray</option>
      <option value="rgb(170, 170, 170)" default>30Gray</option>
      <option value="rgb(142, 142, 142)" default>40Gray</option>
      <option value="rgb(113, 113, 113)" default>50Gray</option>
      <option value="rgb(85, 85, 85)" default>60Gray</option>
      <option value="rgb(57, 57, 57)" default>70Gray</option>
      <option value="rgb(28, 28, 28)" default>80Gray</option>
      <option value="black" default>Black</option>

      <option value="rgb(152, 0, 0)">DarkRed1</option>
      <option value="rgb(255, 0, 0)">Red</option>
      <option value="rgb(255, 153, 0)">Orange</option>
      <option value="rgb(255, 255, 0)">Yellow</option>
      <option value="rgb(0, 255, 0)">Green1</option>
      <option value="rgb(0, 255, 255)">BlueGreen1</option>
      <option value="rgb(74, 134, 232)">Blue1</option>
      <option value="rgb(0, 0, 255)">LightBlue1</option>
      <option value="rgb(153, 0, 255)">Purple1</option>
      <option value="rgb(255, 0, 255)">Magenta1</option>

      <option value="rgb(230, 184, 175)">DarkRed2</option>
      <option value="rgb(244, 204, 204)">Red2</option>
      <option value="rgb(252, 229, 205)">Orange2</option>
      <option value="rgb(255, 242, 204)">Yellow2</option>
      <option value="rgb(217, 234, 211)">Green2</option>
      <option value="rgb(208, 224, 227)">BlueGreen2</option>
      <option value="rgb(201, 218, 248)">Blue2</option>
      <option value="rgb(207, 226, 243)">LightBlue2</option>
      <option value="rgb(217, 210, 233)">Purple2</option>
      <option value="rgb(234, 209, 220)">Magenta2</option>

      <option value="rgb(221, 126, 107)">DarkRed3</option>
      <option value="rgb(234, 153, 153)">Red3</option>
      <option value="rgb(249, 203, 156)">Orange3</option>
      <option value="rgb(255, 229, 153)">Yellow3</option>
      <option value="rgb(182, 215, 168)">Green3</option>
      <option value="rgb(162, 196, 201)">BlueGreen3</option>
      <option value="rgb(164, 194, 244)">Blue3</option>
      <option value="rgb(159, 197, 232)">LightBlue3</option>
      <option value="rgb(180, 167, 214)">Purple3</option>
      <option value="rgb(213, 166, 189)">Magenta3</option>

      <option value="rgb(204, 65, 37)">DarkRed4</option>
      <option value="rgb(224, 102, 102)">Red4</option>
      <option value="rgb(246, 178, 107)">Orange4</option>
      <option value="rgb(255, 217, 102)">Yellow4</option>
      <option value="rgb(147, 196, 125)">Green4</option>
      <option value="rgb(118, 165, 175)">BlueGreen4</option>
      <option value="rgb(109, 158, 235)">Blue4</option>
      <option value="rgb(111, 168, 220)">LightBlue4</option>
      <option value="rgb(142, 124, 195)">Purple4</option>
      <option value="rgb(194, 123, 160)">Magenta4</option>

      <option value="rgb(133, 32, 12)">DarkRed5</option>
      <option value="rgb(204, 0, 0)">Red5</option>
      <option value="rgb(230, 145, 56)">Orange5</option>
      <option value="rgb(241, 194, 50)">Yellow5</option>
      <option value="rgb(106, 168, 79)">Green5</option>
      <option value="rgb(69, 129, 142)">BlueGreen5</option>
      <option value="rgb(60, 120, 216)">Blue5</option>
      <option value="rgb(61, 133, 198)">LightBlue5</option>
      <option value="rgb(103, 78, 167)">Purple5</option>
      <option value="rgb(166, 77, 121)">Magenta5</option>

      <option value="rgb(153, 0, 0)">DarkRed6</option>
      <option value="rgb(153, 0, 0)">Red6</option>
      <option value="rgb(180, 95, 6)">Orange6</option>
      <option value="rgb(194, 144, 0)">Yellow6</option>
      <option value="rgb(56, 118, 29)">Green6</option>
      <option value="rgb(19, 79, 92)">BlueGreen6</option>
      <option value="rgb(17, 85, 204)">Blue6</option>
      <option value="rgb(11, 83, 148)">LightBlue6</option>
      <option value="rgb(53, 28, 117)">Purple6</option>
      <option value="rgb(116, 27, 71)">Magenta6</option>

      <option value="rgb(91, 15, 0)">DarkRed7</option>
      <option value="rgb(102, 0, 0)">Red7</option>
      <option value="rgb(120, 63, 4)">Orange7</option>
      <option value="rgb(127, 96, 0)">Yellow7</option>
      <option value="rgb(39, 78, 19)">Green7</option>
      <option value="rgb(12, 52, 61)">BlueGreen7</option>
      <option value="rgb(28, 69, 135)">Blue7</option>
      <option value="rgb(7, 55, 99)">LightBlue7</option>
      <option value="rgb(32, 18, 77)">Purple7</option>
      <option value="rgb(76, 17, 48)">Magenta7</option>
    </>
  )

  // text block helpers
  const renderCustomToolbar = () => {
    return (
      <span className='ql-formats'>
        <span className='ql-formats'>

          <select className="ql-size">
            <option value="small">Small</option>
            <option default ></option>
            <option value="large">Large</option>
            <option value="huge">Huge</option>
          </select>
        </span>
        <span className='ql-formats'>
          <button className='ql-bold' aria-label='Bold'></button>
          <button className='ql-italic' aria-label='Italic'></button>
          <button className='ql-underline' aria-label='Underline'></button>
        </span>
        <span className='ql-formats'>
          <button className='ql-link' aria-label='Link'></button>
        </span>
        <span className='ql-formats'>
          <select className="ql-color">
            {colorPickerOptions}
          </select>
          <select className="ql-background">
            {colorPickerOptions}
          </select>
        </span>
        <span className='ql-formats'>
          <button className="ql-align" value=""></button>
          <button className="ql-align" value="center"></button>
          <button className="ql-align" value="right"></button>
        </span>
        <span className='ql-formats'>
          <button className="ql-list" value="ordered"><i className="your-icon-class">OL</i></button>
          <button className="ql-list" value="bullet"><i className="your-icon-class">UL</i></button>
        </span>
        {/* <button className="ql-align" value="justify"></button> */}
      </span>
    )
  }

  const toolbar = renderCustomToolbar();

  return (
    <Editor
      key={isEditable ? 'editable' : 'readonly'}
      value={src.content}
      placeholder='No text added yet. Click to add some text'
      {...(!isEditable && { readOnly: true })}
      {...(!isEditable && { showHeader: false })}
      {...(isEditable && { onTextChange: (e) => setTextState(e.htmlValue) })}
      showHeader={isEditable || false}
      headerTemplate={toolbar}
    />
  )
}