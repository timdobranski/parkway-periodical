'use client'

import { useState, useEffect, useRef } from 'react';
import styles from './ContentBlockTitleAndCaption.module.css';

// content will be either a photo or video object with title and caption properties
export default function ContentBlockTitleAndCaption({ content, isEditable, showTitle, showCaption, setShowTitle, setShowCaption }) {
  const [title, setTitle] = useState(content?.title || false);
  const [caption, setCaption] = useState(content?.caption || false);

  // const [showTitle, setShowTitle] = useState(false);
  // const [showCaption, setShowCaption] = useState(false);

  const hasMounted = useRef(false);

  // if the title or caption are not false, show them. empty strings will still be shown
  useEffect(() => {
    if (title !== false) {
      console.log('title is not false, setting showTitle to true')
      setShowTitle(true);
    } else {
      console.log('title is false, setting showTitle to false')
      setShowTitle(false);
    }
  }, [title])

  useEffect(() => {
    if (caption !== false) {
      setShowCaption(true);
    } else {
      console.log('title is false, setting showTitle to false')
      setShowCaption(false);
    }
  }, [caption])



  useEffect(() => {
    console.log('showTitle changed: ', showTitle)
    if (hasMounted.current && showTitle === false) {
      setTitle(false);
    }
  }, [showTitle])

  useEffect(() => {

  }, [showCaption])

  // toggles the title or caption between false and an empty string. false prevents render, empty string allows for input
  // const toggleText = (captionOrTitle) => {
  //   console.log('inside toggle text')
  //   if (captionOrTitle === 'caption') {
  //     if (caption === false) {
  //       setCaption('');
  //     } else {
  //       setCaption(false);
  //     }
  //   } else {
  //     console.log('')
  //     if (title === false) {
  //       console.log('title is false, resetting it to an empty string')
  //       setTitle('');
  //     } else {
  //       console.log('title is not false, setting it to false')
  //       setTitle(false);
  //     }
  //   }
  // }


  useEffect(() => {
    console.log('content passed to TitleAndCaption: ', content)
  }, [content])

  const updateTitleAndCaption = () => {
    setContentBlocks(prev => {
      const newContent = [...prev];

      if (nestedIndex) {
        newContent[index].content[nestedIndex].content[0].title = title || ''; // if title is false, set to an empty string
        newContent[index].content[nestedIndex].content[0].caption = caption || '';
      } else {
        newContent[index].content[0].title = title;
        newContent[index].content[0].caption = caption;
      }
      return newContent;
    })
  }

  useEffect(() => {
    if (!isEditable && hasMounted.current && setContentBlocks) {
      updateTitleAndCaption();
    } else {
      hasMounted.current = true;
    }
  }, [isEditable])


  const titleAndCaptionInputs = (
    <div className={styles.titleAndCaption}>
      { showTitle !== false &&
      <input
        type="text"
        placeholder="Add Title"
        className={styles.titleInput}
        value={isEditable ? title : content?.title}
        onChange={(e) => setTitle(e.target.value)}
      />}

      { showCaption !== false &&
        <textarea
          type="text"
          placeholder="Add Caption"
          className={styles.captionInput}
          value={isEditable ? caption : content?.caption}
          onChange={(e) => setCaption(e.target.value)}
        />}
    </div>
  )

  const titleAndCaption = (
    <div className={styles.titleAndCaption}>
      <p className={styles.title}>{content?.title}</p>
      <p className={styles.caption}>{content?.caption}</p>
    </div>
  )


  return (
    <div className={styles.titleAndCaptionWrapper}>
      {isEditable ? titleAndCaptionInputs : titleAndCaption}
    </div>
  )

}