'use client'

import styles from './PostNavbarLeft.module.css';
import { createClient } from '../../utils/supabase/client';
import { useState, useEffect } from 'react';
import  { RichUtils,  } from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faVideo, faFont, faBars, faTv, faTableCells } from '@fortawesome/free-solid-svg-icons';

export default function PostNavbarLeft({ categoryTags, setCategoryTags }) {
  const supabase = createClient();
  const [options, setOptions] = useState([]);
  // const [newOption, setNewOption] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  // Handle checkbox change
  const handleCheckOption = (option) => {
    let updatedTags;
    if (selectedTags.includes(option.id)) {
      // Remove the tag if it is already selected
      updatedTags = selectedTags.filter(tag => tag !== option.id);
    } else {
      // Add the tag if it is not selected
      updatedTags = [...selectedTags, option.id];
    }
    setSelectedTags(updatedTags);
    setCategoryTags(updatedTags);
  };
  useEffect(() => {
    const getTags = async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*');

      if (error) {
        console.error('Error fetching tags:', error);
      }

      if (data) {
        console.log('tags data:', data)
        setOptions(data);
      }
    }
    getTags();
  }, [])
  useEffect(() => {
    const getTags = async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*');

      if (error) {
        console.error('Error fetching tags:', error);
      }

      if (data) {
        console.log('tags data:', data)
        setOptions(data);

        // Ensure the selectedTags state is correctly initialized based on categoryTags
        const initialSelectedTags = data
          .filter(tag => categoryTags.includes(tag.id))
          .map(tag => tag.id);
        setSelectedTags(initialSelectedTags);
      }
    }
    getTags();
  }, [categoryTags]);


  return (
    <div className={styles.navbarWrapper}>
      <p>Tag your post with relevant topics for users to find below:</p>
      {/* <p>{`You can add a new tag too, but be cautious that you aren't creating a tag that already exists, as this will confuse users`}</p> */}
      {/* <form
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
      </form> */}
      <ul className={styles.optionsList}>
        {options.map(option => (
          <li key={option.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedTags.includes(option.id)}
                onChange={() => handleCheckOption(option)}
                className={styles.checkbox}
              />
              {option.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}