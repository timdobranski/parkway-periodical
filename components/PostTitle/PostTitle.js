import styles from './postTitle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShare } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import supabase from '../../utils/supabase';

export default function PostTitle({ isEditable, src, updateTitle, index, activeBlock, setActiveBlock, date, user, author, id, viewContext }) {
  const [authorPhoto, setAuthorPhoto] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false);


  const userIcon = <FontAwesomeIcon icon={faUser} className={styles.userIcon} />


  useEffect(() => {
    console.log('user: ', user)
  }, [user])
  useEffect(() => {
    console.log('SRC IN POST TITLE: ', src)
  }, [src])
  useEffect(() => {
    console.log('AUTHOR IN POST TITLE: ', author)
  }, [src])
  useEffect(() => {
    console.log('AUTHORPHOTO: ', authorPhoto)
  }, [authorPhoto])

  useEffect(() => {
    const getAuthorPhoto = async () => {
      const photoSource = author ? author.id : user.id
      const { data, error } = await supabase
        .from('users')
        .select('photo')
        .eq('id', photoSource)
        .single();
      if (error) {
        console.error('Error getting author photo: ', error)
      }
      setAuthorPhoto(data.photo)
    }
    getAuthorPhoto()
  }, [])
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


  return (
    <div className={styles.postTitleWrapper}>
      {isEditable ? (
        <input
          autoFocus
          type="text"
          value={src?.content}
          onChange={(e) => updateTitle(e.target.value)}
          className={`${styles.postTitle} outlined`}
          placeholder="Enter title"
          onKeyDown={(e) => { if (e.key === 'Enter') { setActiveBlock(null)}}}
        />
      ) : (

        <h1 className={styles.postTitle} onClick={viewContext === 'edit' ? () => { console.log('clicked!'); setActiveBlock(index)} : null}>
          {src.content ? src.content : 'Enter title'}
        </h1>

      )}
      <>
        <p className={styles.date}>{date ? date :new Date().toLocaleDateString()}</p>
        {viewContext !== 'edit' && <FontAwesomeIcon icon={faShare} className={styles.shareIcon} onClick={id ? () => {handleShareClick(generateUrl())} : null}/>}
        {showConfirm && <p className={styles.shareConfirm}>Link Copied to Clipboard</p>}
        <div className={styles.userWrapper}>
          {authorPhoto ? <div className={styles.userImage} style={{backgroundImage: `url(${authorPhoto})`}}></div> : userIcon}


          <div className={styles.userTitleWrapper}>
            <p className={styles.userName}>{author ? `${author.first_name} ${author.last_name}` : `${user.first_name} ${user.last_name}`} </p>
            <p className={styles.userPosition}>{author ? `${author.position}` : `${user.position}`}</p>
          </div>
        </div>
      </>
    </div>
  )
}