'use client'

import styles from './list.module.css';
import supabase from '../../../utils/supabase';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';



export default function List() {
  const [list, setList] = useState(null);
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const router = useRouter();
  // types: electives, clubs, posts, staff, links

  useEffect(() => {
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

    getList();
  }, [type]);

  useEffect(() => {
    console.log('TYPE: ', type)
  }, [type])

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
              <h3 className={styles.title}>{item.title || item.name}</h3>
              <div className={styles.editControlsWrapper}>
                <button className={styles.editButton}>Edit</button>
                <button className={styles.deleteButton}>Delete</button>
              </div>
            </div>
          )
        })}
        {/* <div className='sectionWrapper'>

          <h5 className='smallerPostTitle'>ADD ELECTIVE</h5>
          <p>Click here to add a new elective to the list</p>

          <h5 className='smallerPostTitle'>REMOVE ELECTIVE</h5>
          <p>Click here to remove an elective from the list</p>

          <h5 className='smallerPostTitle'>EDIT ELECTIVE</h5>
          <p>Click here to edit an existing elective</p>
        </div> */}
      </div>
    </div>
  )
}