'use client'

import styles from './PostNavbarLeft.module.css';
import { useState, useEffect } from 'react';
import  { RichUtils,  } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faVideo, faFont, faBars, faTv, faTableCells } from '@fortawesome/free-solid-svg-icons';

export default function PostNavbarLeft() {
  const options = ['Sports', 'Science', 'Music', 'English', 'Math', 'Social Science', 'Extracurriculars', '2024/25 School Year'];
  const [newOption, setNewOption] = useState('');


  return (
    <div className={styles.navbarWrapper}>
      <p>Tag your post with relevant topics for users to find below:</p>
      <p>{`You can add a new tag too, but be cautious that you aren't creating a tag that already exists, as this will confuse users`}</p>
      <form
      className={styles.addNewOptionWrapper}
      >
        <input
          type="text"
          placeholder="Add new option"
          value={newOption}
          className={styles.addNewOptionInput}
          onChange={(e) => setNewOption(e.target.value)}
        />
        <button type="submit" className={styles.addNewOptionButton}>Add Option</button>
      </form>
      <ul className={styles.optionsList}>
        {options.map(option => (
          <li key={option}>
            <label>
              <input
                type="checkbox"
                checked={option.checked}
                onChange={() => handleCheckOption(option)}
                className={styles.checkbox}
              />
              {option}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}