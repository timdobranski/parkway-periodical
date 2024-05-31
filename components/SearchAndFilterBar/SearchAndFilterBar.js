'use client'

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './searchAndFilterBar.module.css';

export default function SearchAndFilterBar ({ setSearch, postTags, tagId, setTagId, handleFilterChange, getPosts }) {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  // useEffect(() => {
  //   if (!searchExpanded) {
  //     setSearch('');
  //   } else {
  //     setSearch('');
  //     setSearchQuery('');
  //   }
  // }, [searchExpanded])

  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.searchWrapper}>
        <FontAwesomeIcon
          icon={searchExpanded ? faChevronLeft : faMagnifyingGlass}
          className={searchExpanded ? styles.searchIconExpanded : styles.searchIcon}
          onClick={() => setSearchExpanded(!searchExpanded)} />
        <input
          ref={searchInputRef}
          type='search'
          placeholder='Search for topics'
          className={searchExpanded ? styles.searchBarExpanded : styles.searchBar}
          value={searchQuery || ''}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              setSearch(searchQuery)
              getPosts({searchQuery});
            }
          }}
        />
      </div>

      <select name='filter' id='filter' value={tagId || 'all'}
        className={`${styles.filterSelect}`}
        onChange={handleFilterChange}
      >
        {postTags?.map(tag => (
          <option key={tag.id} value={tag.id}>{tag.name}</option>
        ))}
      </select>

    </div>
  )
}