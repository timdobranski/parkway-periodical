import styles from './postTitle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import supabase from '../../utils/supabase';

export default function PostTitle({ isEditable, src, updateTitle, index, activeBlock, setActiveBlock, date, user, author }) {
  const [authorPhoto, setAuthorPhoto] = useState(null)

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



  return (
    <div className={'postTitleWrapper'}>
      {isEditable ? (
        <input
          type="text"
          value={src?.content}
          onChange={(e) => updateTitle(e.target.value)}
          className='postTitle editable'
          placeholder="Enter title"
          onKeyDown={(e) => { if (e.key === 'Enter') { setActiveBlock(null)}}}
        />
      ) : (

        <h1 className='postTitle' onClick={() => setActiveBlock(index)}>
          {src.content ? src.content : 'Enter title'}
        </h1>

      )}
      <>
        <p className={styles.date}>{date ? date :new Date().toLocaleDateString()}</p>
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