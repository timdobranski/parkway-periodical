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
      <p>{`You can add a new option too, but be cautious that you aren't creating a redundant label as this will confuse users`}</p>
      <form
        // onSubmit={handleAddOption}
      >
        <input
          type="text"
          placeholder="Add new option"
          value={newOption}
          // onChange={(e) => setNewOption(e.target.value)}
        />
        <button type="submit">Add Option</button>
      </form>
      <ul className={styles.optionsList}>
        {options.map(option => (
          <li key={option.id}>
            <label>
              <input
                type="checkbox"
                checked={option.checked}
                onChange={() => handleCheckOption(option.id)}
              />
              {option}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}