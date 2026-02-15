'use client'

import {createClient } from '../../../utils/supabase/client';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faChevronDown, faChevronUp, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../../contexts/AdminContext';
import dateFormatter from '../../../utils/dateFormatter';
import rearrangeContentList from '../../../utils/rearrangeContentList';
import deletePhotosFromStorage from '../../../utils/deletePhotosFromStorage';
import adminUI from '../adminUI.module.css';

export default function List() {
  const { isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, setUser } = useAdmin();
  const supabase = createClient();
  const [list, setList] = useState(null);
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const router = useRouter();
  const [expanded, setExpanded] = useState('')
  const { moveItemUp, moveItemDown } = rearrangeContentList(list, setList);
  const [deletingId, setDeletingId] = useState(null);


  // types: electives, clubs, posts, staff, links

  useEffect(() => {
    console.log('user in list page, from context api: ', user)
  }, [user])



  const getList = async () => {
    let query = supabase
      .from(type)
      .select('*')
      // .order('id', { ascending: false });

    if (user && !user.admin) {
      query = query.eq('author', user.id);
    }

    // Sort by sortOrder if type is 'posts', otherwise by id
    if (type === 'posts') {
      query = query.order('sortOrder', { ascending: false })
    } else {
      query = query.order('id', { ascending: false });
    }

    const { data, error } = await query;

    if (data) {
      console.log('list data: ', data)
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

  async function deletePost(id) {
    setDeletingId(id);
    setIsLoading(true);
    try {

      const { data: post, error: postError } = await supabase
        .from('posts')
        .select('content')
        .eq('id', id)
        .single();

      if (postError) { console.log('error fetching post: ', postError); }

      const contentBlocks = JSON.parse(post.content);
      // first, iterate through contentBlocks and delete all associated photos (type photo, carousel, and flexibleLayout)
      await deletePhotosFromStorage(contentBlocks);

      // then, delete the post from posts table
      const { error } = await supabase
        .from('posts')
        .delete()
        .match({ id: id });

      if (error) { console.log('error deleting post (after deleting photos): ', error); }

      setList(list.filter(item => item.id !== id));

      // then either redirect to home or show a message that the post was deleted (reset contentBlocks);
      // router.push('/admin/new-post')
      setIsLoading(false);
      setDeletingId(null);
    } catch (error) {
      console.error('Unexpected error:', error);
      setIsLoading(false);
      setDeletingId(null);
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
      router.push(`/home?postId=${id}`, {scroll: false});
    } else {
      router.push(`/${type}`);

    }
  }
  return (
    <div className='adminPageWrapper'>
      <div className={adminUI.pageInner}>
        <div className={adminUI.headerRow}>
          <h1 className={`pageTitle ${adminUI.pageTitle}`}>{`${user?.admin ? 'ALL' : type === 'staff' ? '' : 'YOUR'}  ${type.toUpperCase()}`}</h1>

          <button
            type='button'
            className={adminUI.primaryActionButton}
            onClick={() => {
              type === 'posts'
                ? router.push(`/admin/new-post`)
                : router.push(`/admin/new-content?type=${type}`);
            }}
          >
            <FontAwesomeIcon icon={faAdd} className={adminUI.primaryActionIcon} />
            <span>New</span>
          </button>
        </div>

        {list && list.length === 0 && (
          <p className={adminUI.noContent}>No {type} have been created yet. Click “New” to add some.</p>
        )}

        <div className={adminUI.list}>
          {list && list.map((item, index) => {
            const editUrl = type === 'posts'
              ? `/admin/new-post?id=${item.id}`
              : `/admin/new-content?id=${item.id}&type=${type}`;

            const isExpanded = expanded === index;

            return (
              <div className={adminUI.listItem} key={index}>
                <div className={adminUI.listItemHeader}>
                  <div className={adminUI.listItemLeft}>
                    <button
                      type='button'
                      className={`${adminUI.iconButton} ${isExpanded ? adminUI.iconButtonActive : ''}`}
                      onClick={() => handleToggle(index)}
                      aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                    >
                      <FontAwesomeIcon icon={faChevronDown} />
                    </button>

                    <h3 className={adminUI.itemTitle} onClick={() => handleToggle(index)}>
                      {item.title || item.name}
                    </h3>
                  </div>

                  <div className={adminUI.actions}>
                    <button type='button' className={adminUI.actionButton} onClick={() => handleViewContent(item.id)}>
                      View
                    </button>
                    <button type='button' className={adminUI.actionButton} onClick={() => router.push(editUrl)}>
                      Edit
                    </button>
                    <button
                      type='button'
                      className={`${adminUI.actionButton} ${adminUI.dangerButton} ${deletingId === item.id ? adminUI.dangerButtonBusy : ''}`}
                      onClick={type === 'posts' ? () => deletePost(item.id) : () => deleteItem(item.id)}
                    >
                      {deletingId === item.id
                        ? <FontAwesomeIcon icon={faSpinner} className={adminUI.spinnerIcon} />
                        : 'Delete'
                      }
                    </button>

                    {type === 'posts' && (
                      <div className={adminUI.sortActions}>
                        <button type='button' className={adminUI.iconButton} onClick={() => moveItemUp(index)} aria-label='Move up'>
                          <FontAwesomeIcon icon={faChevronUp} />
                        </button>
                        <button type='button' className={adminUI.iconButton} onClick={() => moveItemDown(index)} aria-label='Move down'>
                          <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`${adminUI.details} ${isExpanded ? adminUI.detailsOpen : ''}`}>
                  <div className={adminUI.detailsInner}>
                    <div className={adminUI.detailsGrid}>
                    {item.author && (
                      <>
                        <p className={adminUI.detailLabel}>CREATED BY:</p>
                        <p className={adminUI.detailValue}>{`${item.author.first_name} ${item.author.last_name}`}</p>
                      </>
                    )}
                    {item.when && (
                      <>
                        <p className={adminUI.detailLabel}>MEETS:</p>
                        <p className={adminUI.detailValue}>{`${item.when}`}</p>
                      </>
                    )}
                    {item.position && (
                      <>
                        <p className={adminUI.detailLabel}>POSITION:</p>
                        <p className={adminUI.detailValue}>{`${item.position}`}</p>
                      </>
                    )}
                    {item.date && (
                      <>
                        <p className={adminUI.detailLabel}>DATE:</p>
                        <p className={adminUI.detailValue}>{dateFormatter(item.date)}</p>
                      </>
                    )}
                    {item.description && (
                      <>
                        <p className={adminUI.detailLabel}>DESCRIPTION:</p>
                        <p className={adminUI.detailValue}>{item.description}</p>
                      </>
                    )}
                    {item.category && (
                      <>
                        <p className={adminUI.detailLabel}>CATEGORY:</p>
                        <p className={adminUI.detailValue}>{item.category}</p>
                      </>
                    )}
                    {item.bio && (
                      <>
                        <p className={adminUI.detailLabel}>ABOUT ME:</p>
                        <p className={adminUI.detailValue}>{item.bio}</p>
                      </>
                    )}
                    {item.url && (
                      <>
                        <p className={adminUI.detailLabel}>URL:</p>
                        <p className={adminUI.detailValue}>{item.url}</p>
                      </>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}