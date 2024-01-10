'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../utils/supabase';
import styles from './new-post.module.css';
import { EditorState } from 'draft-js';
import PostNavbar from '../../../components/PostNavbar/PostNavbar';
import Text from '../../../components/Text/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

export default function NewPostPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([]); // Corrected function name

  useEffect(() => {
    const getAndSetUser = async () => {
      const response = await supabase.auth.getSession();
      if (response.data.session.user) {
        setUser(response.data.session.user);
      } else {
        router.push('/auth');
      }
    };
    getAndSetUser();
  }, [router]);

  const addTextBlock = () => {
    setContentBlocks([...contentBlocks, { type: 'text', content: EditorState.createEmpty() }]);
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
  const updateEditorState = (index, newState) => {
    const newContentBlocks = [...contentBlocks];
    newContentBlocks[index] = { ...newContentBlocks[index], content: newState };
    setContentBlocks(newContentBlocks);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.loginHeader}>New Post</h1>
      <PostNavbar onAddText={addTextBlock} />
      {contentBlocks.map((block, index) => (
        <div key={index} className={styles.blockContainer}>
          <div className={styles.blockControls}>
            <FontAwesomeIcon icon={faCaretUp} onClick={() => moveBlockUp(index)} className={styles.iconUp}/>
            {/* <FontAwesomeIcon icon={faX} onClick={() => removeBlock(index)} className={styles.iconX}/> */}
            <FontAwesomeIcon icon={faCaretDown} onClick={() => moveBlockDown(index)} className={styles.iconDown}/>
          </div>
          {block.type === 'text' && (
            <Text
              editorState={block.content}
              setEditorState={(newState) => updateEditorState(index, newState)}
            />
          )}
          {block.type === 'photo' && <img src={block.content} alt="User uploaded" />}
          {block.type === 'video' && <video src={block.content} controls />}
          <FontAwesomeIcon icon={faX} onClick={() => removeBlock(index)} className={styles.iconX}/>

        </div>
      ))}
    </div>
  );
}