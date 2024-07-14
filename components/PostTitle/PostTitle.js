import styles from './postTitle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { createClient } from '../../utils/supabase/client';
import { useAdmin } from '../../contexts/AdminContext';


export default function PostTitle({ isEditable, src, updateTitle, index, activeBlock, setActiveBlock, date, authorId, id, viewContext }) {

  // const [publishingStatus, setPublishingStatus] = useState(false)
  const { isLoading, setIsLoading, saving, setSaving, user, authUser } = useAdmin();
  const supabase = createClient();
  const [authorPhoto, setAuthorPhoto] = useState(null)
  const [authorData, setAuthorData] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false);


  const userIcon = <FontAwesomeIcon icon={faUser} className={styles.userIcon} />

  // get users table data using authorId if public, and using user.id if editing post as admin
  useEffect(() => {
    const getAuthorData = async (id) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Error getting author: ', error)
      }
      setAuthorData(data)
    }
    if (viewContext === 'view') {
      getAuthorData(authorId) // get author data if viewing post as public
    } else if (viewContext === 'edit') {
      setAuthorData(user) // get USER data if viewing post as admin
    }
  }, [authorId])




  useEffect(() => {
    // console.log('user: ', user)
  }, [user])

  useEffect(() => {
    // console.log('AUTHOR IN POST TITLE: ', authorData)
  }, [authorData])



  const generateUrl = () => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const path = `/public/home`;
    const query = `?id=${encodeURIComponent(id)}`; // Properly encoding the query parameter
    return `${baseUrl}${path}${query}`;
};
  const handleShareClick = async (urlToCopy) => {
    try {
      await navigator.clipboard.writeText(urlToCopy);
      setShowConfirm(true);
      setTimeout(() => {
        setShowConfirm(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy URL');
    }
  };

  if (!authorData) return null;

  return (
    <div className={styles.postTitleWrapper}>
      {isEditable ? (
        <input
          autoFocus
          type="text"
          value={src?.content}
          onChange={(e) => updateTitle(e.target.value)}
          className={`${styles.postTitleEditable} outlined`}
          placeholder="Enter title"
          onKeyDown={(e) => { if (e.key === 'Enter') { setActiveBlock(null)}}}
        />
      ) : (

        <h1 className={styles.postTitle} onClick={viewContext === 'edit' ? () => { console.log('clicked!'); setActiveBlock(index)} : null}>
          {src.content ? src.content : 'Enter title'}
        </h1>

      )}
      <>

        <div className={styles.userWrapper}>
          {authorData && authorData.photo ?
            <div className={styles.userImage} style={{backgroundImage: `url(${authorData.photo})`}}></div>
            :
            userIcon
          }
          <div className={styles.userTitleWrapper}>
            <p className={styles.userName}>{viewContext === 'view' ? `${authorData.first_name} ${authorData.last_name}` : `${user.first_name} ${user.last_name}`} </p>
            <p className={styles.userPosition}>{viewContext === 'view' ? `${authorData.position}` : `${user.position}`}</p>
          </div>
        </div>
      </>
    </div>
  )
}