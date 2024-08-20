'use client'

import { useState, useEffect, useRef } from 'react';
import styles from './ContentBlockTitleAndCaption.module.css';

// content will be either a photo or video object with title and caption properties
export default function ContentBlockTitleAndCaption({ content, isEditable, setContentBlocks, index, nestedIndex, isText }) {

  // set title and caption to the content passed in, or false if they are an empty string
  const [title, setTitle] = useState(content?.title);
  const [caption, setCaption] = useState(content?.caption);

  const hasMounted = useRef(false);

  // if content is changed by another component, like the edit menu buttons, update the title and caption
  // if it turns to false, set the title to false
  // if it turns to an empty string, set it to
  useEffect(() => {
    // console.log('TITLEANDCAPTION TITLE CHANGE: ', content?.title)

    if (content) {
      setTitle(content.title);
    } else {
      setTitle(false);
    }
  }, [content?.title])

  useEffect(() => {
    // console.log('TITLEANDCAPTION CAPTION CHANGE: ', content?.caption)

    if (content) {
      setCaption(content.caption);
    } else {
      setCaption(false);
    }
  }, [content?.caption])

  useEffect(() => {
    // console.log('CONTENT CHANGE: ', content)
  }, [content])




  // updates the title and caption in the content block when isEditable changes
  const updateTitleAndCaption = () => {
    // console.log('inside updateTitleAndCaption')
    setContentBlocks(prev => {
      const newContent = [...prev];
      // console.log('PREV CONTENT BEFORE ERROR: ', newContent)
      // if there's a nested index
      if ((nestedIndex || nestedIndex === 0) &&

      // and the content has a property at the nested index (to weed out undecided block)

      // then if either the caption or title properties aren't false
        (newContent[index].content[nestedIndex].content[0]?.title !== false ||
        newContent[index].content[nestedIndex].content[0]?.caption !== false)

      )
      {
        // set the title and caption to the new values
        newContent[index].content[nestedIndex].content[0].title = title; // if title is false, set to an empty string
        newContent[index].content[nestedIndex].content[0].caption = caption;
      }
      // if there's no nested index and the title or caption properties aren't false
      else if (newContent[index].content[0]?.title !== false || newContent[index].content[0]?.caption !== false) {
        // set the title and caption to the new values
        newContent[index].content[0].title = title;
        newContent[index].content[0].caption = caption;
      }
      return newContent;
    })
  }
  // if the component has mounted, is not editable, and there is content to be updated, update the title and caption
  useEffect(() => {
    if (!isEditable && hasMounted.current && setContentBlocks && content) {
      updateTitleAndCaption();
    } else {
      hasMounted.current = true;
    }
  }, [isEditable])


  const titleAndCaptionInputs = (
    (typeof title === 'string' || typeof caption === 'string') && (
      <div className={styles.titleAndCaption}>
        {typeof title === 'string' && (
          <input
            type="text"
            placeholder="Add Title"
            className={styles.titleInput}
            value={isEditable ? title : content?.title}
            onChange={(e) => setTitle(e.target.value)}
          />
        )}
        {typeof caption === 'string' && (
          <textarea
            placeholder="Add Caption"
            className={styles.captionInput}
            value={isEditable ? caption : content?.caption}
            onChange={(e) => {
              // autoResize(e);
              setCaption(e.target.value)
            }}
            // style={{ overflow: 'hidden', resize: 'none' }}
          />
        )}
      </div>
    )
  );

  const titleAndCaption = () => {
    if (content?.title || content?.caption) {
      return (
        <div className={styles.titleAndCaption}>
          <p className={styles.title}>{content?.title}</p>
          <p className={styles.caption}>{content?.caption}</p>
        </div>
      )
    }
  }


  return (
    <div className={styles.titleAndCaptionWrapper}>
      {/* <p>Title and Caption</p> */}
      {isEditable ? titleAndCaptionInputs : titleAndCaption()}

    </div>
  )

}