'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../utils/supabase';
import styles from './new-post.module.css';
import { EditorState } from 'draft-js';
import PostNavbar from '../../../components/PostNavbar/PostNavbar';
import Text from '../../../components/Text/Text';
import Video from '../../../components/Video/Video';
import Photo from '../../../components/Photo/Photo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faCaretUp, faCaretDown, faPencil, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

export default function NewPostPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([]); // Corrected function name

  useEffect(() => {
    console.log('content blocks: ', contentBlocks);
  }, [contentBlocks])

  useEffect(() => {
    const getAndSetUser = async () => {
      const response = await supabase.auth.getSession();

      // Check if the session exists
      if (response.data.session) {
        // If session exists, set the user
        setUser(response.data.session.user);
      } else {
        // If no session, redirect to /auth
        router.push('/auth');
      }
    };
    getAndSetUser();
  }, [router]);

  useEffect(() => {
    // Log the user on state change
    console.log('user: ', user);
  }, [user]);

  // content blocks helpers
  const addTextBlock = () => {
    setContentBlocks([...contentBlocks, { type: 'text', content: EditorState.createEmpty(), isEditable: true }]);
  };
  const addVideoBlock = () => {
    setContentBlocks([...contentBlocks, { type: 'video', content: '', isEditable: true }]);
  }
  const addPhotoBlock = () => {
    setContentBlocks([...contentBlocks, { type: 'photo', content: null, isEditable: true }]);
  };
  const removeBlock = (index) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };
  const moveBlockUp = (index) => {
    if (index === 0) return; // Can't move the first element up
    const newContentBlocks = [...contentBlocks];
    [newContentBlocks[index], newContentBlocks[index - 1]] = [newContentBlocks[index - 1], newContentBlocks[index]];
    setContentBlocks(newContentBlocks);
  };
  const moveBlockDown = (index) => {
    if (index === contentBlocks.length - 1) return; // Can't move the last element down
    const newContentBlocks = [...contentBlocks];
    [newContentBlocks[index], newContentBlocks[index + 1]] = [newContentBlocks[index + 1], newContentBlocks[index]];
    setContentBlocks(newContentBlocks);
  };
  const toggleEditable = (index) => {
    const updatedBlocks = contentBlocks.map((block, i) => {
      if (i === index) {
        return { ...block, isEditable: !block.isEditable };
      }
      return block;
    });
    setContentBlocks(updatedBlocks);
  };
  const handleFocus = (index) => {
    // Set the isEditable to true for the focused block
    const updatedBlocks = contentBlocks.map((block, i) => ({
      ...block,
      isEditable: i === index
    }));
    setContentBlocks(updatedBlocks);
  };
  const handleBlur = (index) => {
    console.log('inside handle blur')
    // Set the isEditable to false for the blurred block
    const updatedBlocks = contentBlocks.map((block, i) => ({
      ...block,
      isEditable: i !== index ? block.isEditable : false
    }));
    setContentBlocks(updatedBlocks);
  };
  // text block helpers
  const updateEditorState = (index, newState) => {
    const newContentBlocks = [...contentBlocks];
    newContentBlocks[index] = { ...newContentBlocks[index], content: newState };
    setContentBlocks(newContentBlocks);
  };
  // photo block helpers
  const updatePhotoContent = (index, dataUrls) => {
    const newContentBlocks = [...contentBlocks];
    newContentBlocks[index] = { ...newContentBlocks[index], content: dataUrls };
    setContentBlocks(newContentBlocks);
  };
  const handlePhotoSelect = (file, blockIndex) => {
    // Update the photo block with the file object for later upload
    updatePhotoContent(blockIndex, file);
  };
  const updatePhotoFormat = (index, format) => {
    const newContentBlocks = contentBlocks.map((block, idx) => {
      if (idx === index && block.type === 'photo') {
        return { ...block, format };
      }
      return block;
    });
    setContentBlocks(newContentBlocks);
  };
  // video block helpers
  const updateVideoUrl = (index, url) => {
    const newContentBlocks = [...contentBlocks];
    newContentBlocks[index] = { ...newContentBlocks[index], content: url };
    setContentBlocks(newContentBlocks);
  }



  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      {/* <h1 className={styles.loginHeader}>New Post</h1> */}
      <PostNavbar onAddText={addTextBlock} onAddPhoto={addPhotoBlock} onAddVideo={addVideoBlock} />
      <div className='postPreview'>
      {contentBlocks.map((block, index) => (
        <div key={index} className={styles.blockContainer}>
          <div className={styles.blockControlsLeft}>
            <FontAwesomeIcon icon={faCaretUp} onClick={() => moveBlockUp(index)} className={styles.iconUp}/>
            <FontAwesomeIcon icon={faCaretDown} onClick={() => moveBlockDown(index)} className={styles.iconDown}/>
          </div>
          {block.type === 'text' && (
            <Text
              editorState={block.content}
              setEditorState={(newState) => updateEditorState(index, newState)}
              isEditable={block.isEditable}
              onFocus={() => handleFocus(index)}
              onBlur={() => handleBlur(index)}
            />
          )}
          {block.type === 'photo' &&
            <Photo
              key={index}
              updatePhotoContent={(files) => updatePhotoContent(index, files)}
              updatePhotoFormat={(format) => updatePhotoFormat(index, format)}
              isEditable={block.isEditable}
              src={block.content}
              format={block.format || 'grid'}
            />}
          {block.type === 'video' && <Video updateVideoUrl={(url) => updateVideoUrl(index, url)} isEditable={block.isEditable} src={block.content} />}
          <div className={styles.blockControlsRight}>
          <FontAwesomeIcon icon={faX} onClick={() => removeBlock(index)} className={styles.iconX}/>
          <FontAwesomeIcon icon={block.isEditable ? faFloppyDisk : faPencil} onClick={() => toggleEditable(index)} className={styles.iconStatus}/>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}