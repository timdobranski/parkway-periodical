'use client'

import styles from './list.module.css';
import {createClient } from '../../../utils/supabase/client';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../../contexts/AdminContext';

export default function List() {
  const { isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, setUser } = useAdmin();
  const supabase = createClient();
  const [list, setList] = useState(null);
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const router = useRouter();
  const [expanded, setExpanded] = useState('')
  // types: electives, clubs, posts, staff, links

  useEffect(() => {
    console.log('user in list page, from context api: ', user)
  }, [user])


  const getList = async () => {
    let query = supabase
      .from(type)
      .select('*');

    if ( user && !user.admin) {
      query = query.eq('author', user.id);
    }
    const { data, error } = await query

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
  }, [type, user]);

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
    <div className='adminFeedWrapper'>
      <div className='editablePost'>
        <h1 className='pageTitle'>{`${user?.admin ? 'ALL' : 'YOUR'}  ${type.toUpperCase()}`}</h1>
        <FontAwesomeIcon icon={faAdd} className={styles.addIcon} onClick={() => {
          const newType = type.replace(/s$/, ''); // Removes 's' if it is the last character
          type === 'posts' ? router.push(`/admin/new-post`) : router.push(`/admin/new-content?type=${type}`)
          ;
        }}/>
        <div className={styles.sectionWrapper}>
          {list && list.map((item, index) => {
            const editUrl = type === 'posts' ? `/admin/new-post?id=${item.id}` : `/admin/new-content?id=${item.id}&type=${type}`
            return (
              <div className={styles.listWrapper} key={index}>
                <div className={styles.collapsedContentWrapper}>
                  <div className={styles.titleWrapper}>
                    <FontAwesomeIcon
                      icon={expanded === index ? faChevronUp : faChevronDown}
                      className={styles.dropdownIcon}
                      onClick={() => {expanded === null ? setExpanded(index) : expanded === index ? setExpanded(null) : setExpanded(index)}}
                    />
                    <h3 className='smallerPostTitle' onClick={() => router.push(`/public/home?postId=${item.id}`)}>{item.title || item.name}</h3>
                  </div>
                  <div className={styles.editControlsWrapper}>
                    <button className={styles.editButton}  onClick={() => router.push(editUrl)}>EDIT</button>
                    <button className={styles.deleteButton} onClick={() => deleteItem(item.id)}>DELETE</button>
                  </div>
                </div>
                <div className={expanded === index ? styles.expandedInfo : styles.expandedInfoHidden}>
                  {item.when && <p>{`Meets: ${item.when}`}</p>}
                  <p>{item.position}</p>
                  <p>{item.description || item.bio}</p>
                  <p>{item.url}</p>
                  {/* {TODO: ADD ITEM AUTHOR AND DATE FOR POSTS}  */}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}