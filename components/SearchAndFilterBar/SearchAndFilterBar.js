'use client'

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './searchAndFilterBar.module.css';


export default function SearchAndFilterBar ({ postTags, tagId, setTagId, handleFilterChange }) {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');



  return (
    <div className={styles.filterWrapper}>
      <div className={styles.searchWrapper}>
        <FontAwesomeIcon
          icon={searchExpanded ? faChevronLeft : faMagnifyingGlass}
          className={searchExpanded ? styles.searchIconExpanded : styles.searchIcon}
          onClick={() => setSearchExpanded(!searchExpanded)} />
        <input
          type='search'
          placeholder='Search for topics'
          className={searchExpanded ? styles.searchBarExpanded : styles.searchBar}
          value={searchQuery || ''}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              getPosts({searchQuery});
            }
          }}
        />
        <p className={styles.searchStatus} style={ searchQuery ? {display: 'inline-block'} : {display: 'none'}}>{`Results for ${searchQuery}`}</p>
      </div>

      <select name='filter' id='filter' value={tagId || 'all'}
        className={`${styles.filterSelect}`}
        onChange={handleFilterChange}
      >
        {postTags?.map(tag => (
          <option key={tag.value} value={tag.id}>{tag.name}</option>
        ))}
      </select>
    </div>
  )
}