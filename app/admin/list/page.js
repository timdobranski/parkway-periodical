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
  const [paddingClass, setPaddingClass] = useState('');

  // types: electives, clubs, posts, staff, links

  useEffect(() => {
    console.log('user in list page, from context api: ', user)
  }, [user])



  const getList = async () => {
    let query = supabase
      .from(type)
      .select('*')
      .order('id', { ascending: false });

    if (user && !user.admin) {
      query = query.eq('author', user.id);
    }

    const { data, error } = await query;

    if (data) {
      if (data.length === 0) {
        setList([]);
      } else {
        const authorIds = [...new Set(data.map(item => item.author))]; // Get unique author IDs

        const { data: authors, error: authorsError } = await supabase
          .from('users')
          .select('id, first_name, last_name')
          .in('id', authorIds);

        if (authorsError) {
          console.error('Error fetching authors:', authorsError);
          setList(data); // if fetching author data fails, at least set the list with the data we have
          return;
        }

        const authorsMap = authors.reduce((map, author) => {
          map[author.id] = author;
          return map;
        }, {});

        const updatedData = data.map(item => ({
          ...item,
          author: authorsMap[item.author] || { first_name: '', last_name: '' }
        }));

        setList(updatedData);
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
  const handleToggle = (index) => {
    if (expanded === '') {
      setExpanded(index);
    } else if (expanded === index) {
      setExpanded('');
    } else {
      setExpanded(index);
    }
  };
  const handleViewContent = (id) => {
    if (type === 'posts') {
      router.push(`/public/home?postId=${id}`);
    } else {
      router.push(`/public/${type}`);

    }
  }
  return (
    <div className='adminFeedWrapper'>
      <div className='editablePost'>
        <h1 className='pageTitle'>{`${user?.admin ? 'ALL' : item === 'staff' ? '' : 'YOUR'}  ${type.toUpperCase()}`}</h1>
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
                      onClick={() => {handleToggle(index)}}
                    />
                    <h3 className={`smallerPostTitle ${styles.truncate} `} onClick={() => handleToggle(index)}>{item.title || item.name}</h3>
                  </div>
                  <div className={styles.editControlsWrapper}>
                    <button className={styles.editButton}  onClick={() => handleViewContent(item.id)}>VIEW</button>
                    <button className={styles.editButton}  onClick={() => router.push(editUrl)}>EDIT</button>
                    <button className={styles.deleteButton} onClick={() => deleteItem(item.id)}>DELETE</button>
                  </div>
                </div>
                <div className={`${styles.expandedInfo} ${expanded === index ? styles.expandedInfoVisible : styles.expandedInfoHidden}`}>
                  {item.author &&
                  <>
                    <p className={styles.metadataLabel}>{`CREATED BY:`}</p>
                    <p className={styles.metadata}>{`${item.author.first_name} ${item.author.last_name}`}</p>
                  </>
                  }
                  {item.when &&
                  <>
                    <p className={styles.metadataLabel}>{`MEETS:`}</p>
                    <p className={styles.metadata}>{`${item.when}`}</p>
                  </>
                  }
                  {item.position &&
                  <>
                    <p className={styles.metadataLabel}>{`POSITION:`}</p>
                    <p className={styles.metadata}>{`${item.position}`}</p>
                  </>
                  }
                  {item.description &&
                  <>
                    <p className={styles.metadataLabel}>{`DESCRIPTION:`}</p>
                    <p className={styles.metadata}>{item.description}</p>
                  </>
                  }
                  {item.bio &&
                  <>
                    <p className={styles.metadataLabel}>{`ABOUT ME:`}</p>
                    <p className={styles.metadata}>{item.bio}</p>
                  </>
                  }
                  {item.url &&
                  <>
                    <p className={styles.metadataLabel}>{`URL:`}</p>
                    <p className={styles.metadata}>{item.url}</p>
                  </>
                  }
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}