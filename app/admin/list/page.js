'use client'

import styles from './list.module.css';
import supabase from '../../../utils/supabase';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';



export default function List() {
  const [list, setList] = useState(null);
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const router = useRouter();
  const [expanded, setExpanded] = useState('')
  // types: electives, clubs, posts, staff, links

  useEffect(() => {
  console.log('expanded: ', expanded)
  }, [expanded])
  const getList = async () => {
    const { data, error } = await supabase
      .from(type)
      .select('*');

    if (data) {
      if (data.length === 0) {
        setList([]);
      } else {
        setList(data);
      }
    }

    if (error) {
      console.error('Error fetching ' + type + ':', error);
      setList([]);
    }
  };
  // get list
  useEffect(() => {
    getList();
  }, [type]);

  useEffect(() => {
    console.log('TYPE: ', type)
  }, [type])

  // delete item then refetch the list
  const deleteItem = async (id) => {
    const { error } = await supabase
      .from(type)
      .delete()
      .eq('id', id);

    if (error) {
      console.log('Error deleting item:', error);
    } else {
      try {
        await getList(); // Assuming getList is async and you want to wait for it to finish
      } catch (getListError) {
        console.error('Error fetching list:', getListError);
      }
    }
  }

  return (
    <div className='feedWrapper'>
      <div className='post'>
        <h1 className='pageTitle'>{`${type.toUpperCase()}`}</h1>
        <FontAwesomeIcon icon={faAdd} className={styles.addIcon} onClick={() => {
          const newType = type.replace(/s$/, ''); // Removes 's' if it is the last character
          router.push(`/admin/new-${newType}`);
        }}/>        {list && list.map((item, index) => {
          return (
            <div className={styles.listWrapper} key={index}>
              <div className={styles.collapsedContentWrapper}>
                <div className={styles.titleWrapper}>
                  <FontAwesomeIcon icon={faChevronDown} className={styles.dropdownIcon} onClick={() => {expanded === null ? setExpanded(index) : setExpanded(null)}}/>
                  <h3 className={styles.title}>{item.title || item.name}</h3>
                </div>
                <div className={styles.editControlsWrapper}>
                  <button className={styles.editButton}  onClick={() => router.push(`/admin/new-link?id=${item.id}`)}>Edit</button>
                  <button className={styles.deleteButton} onClick={() => deleteItem(item.id)}>Delete</button>
                </div>
              </div>
              <div className={expanded === index ? styles.expandedInfo : styles.expandedInfoHidden}>
                <p>{item.description || item.bio}</p>
                <p>{item.url}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}