'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../utils/supabase';
import styles from './new-post.module.css';
import { EditorState, RichUtils } from 'draft-js';
import PostNavbar from '../../../components/PostNavbar/PostNavbar';
import Text from '../../../components/Text/Text';
import Video from '../../../components/Video/Video';
import Photo from '../../../components/Photo/Photo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faCaretUp, faCaretDown, faPencil, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

export default function NewPostPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [activeBlock, setActiveBlock] = useState(null);

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

  // useEffect(() => {
  //   console.log('contentBlocks updated')
  // }, [contentBlocks])

  // content blocks helpers
  const addTextBlock = () => {
    const newBlock = { type: 'text', content: EditorState.createEmpty() };
    setContentBlocks([...contentBlocks.map(block => ({ ...block })), newBlock]);
    setActiveBlock(contentBlocks.length); // New block's index
  };
  const addVideoBlock = () => {
    const newBlock = { type: 'video', content: '', };
    setContentBlocks([...contentBlocks.map(block => ({ ...block })), newBlock]);
    setActiveBlock(contentBlocks.length); // New block's index
  };
  const addPhotoBlock = () => {
    const newBlock = { type: 'photo', content: null};
    setContentBlocks([...contentBlocks.map(block => ({ ...block })), newBlock]);
    setActiveBlock(contentBlocks.length); // New block's index
  };
  const removeBlock = (index) => {
    // Remove the selected block
    const updatedBlocks = contentBlocks.filter((_, i) => i !== index);
    setContentBlocks(updatedBlocks);

    // Adjust activeBlock if necessary
    if (index === activeBlock || index < activeBlock || activeBlock >= updatedBlocks.length) {
        setActiveBlock(updatedBlocks.length > 0 ? 0 : null); // Set to first block or null
    }
  };
  const moveBlockUp = (index) => {
    if (index === 0) return; // Can't move the first element up

    const newContentBlocks = [...contentBlocks];
    [newContentBlocks[index], newContentBlocks[index - 1]] = [newContentBlocks[index - 1], newContentBlocks[index]];

    // Update activeBlock index if it's one of the moved blocks
    if (activeBlock === index) {
      setActiveBlock(index - 1);
    } else if (activeBlock === index - 1) {
      setActiveBlock(index);
    }

    setContentBlocks(newContentBlocks);
  };
  const moveBlockDown = (index) => {
    if (index === contentBlocks.length - 1) return; // Can't move the last element down

    const newContentBlocks = [...contentBlocks];
    [newContentBlocks[index], newContentBlocks[index + 1]] = [newContentBlocks[index + 1], newContentBlocks[index]];

    // Update activeBlock index if it's one of the moved blocks
    if (activeBlock === index) {
      setActiveBlock(index + 1);
    } else if (activeBlock === index + 1) {
      setActiveBlock(index);
    }

    setContentBlocks(newContentBlocks);
  };
  const toggleEditable = (index) => {
    const updatedBlocks = contentBlocks.map((block, i) => {
        return {
            ...block,
            isEditable: i === index ? !block.isEditable : false
        };
    });

    setContentBlocks(updatedBlocks);

    // Set activeBlock to the current index if it's being made editable,
    // or reset to null if no block is editable
    const isCurrentBlockEditable = updatedBlocks[index].isEditable;
    setActiveBlock(isCurrentBlockEditable ? index : null);
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
  const updateActiveTextEditorState = (newState) => {
    if (activeBlock !== null) {
      updateEditorState(activeBlock, newState);
    }
  };
  const toggleBold = () => {
    console.log('inside toggle bold. activeBlock: ', activeBlock, 'type: ', contentBlocks[activeBlock].type)
    if (activeBlock === null || contentBlocks[activeBlock].type !== 'text') return; // No text block is active
    console.log('active text block')
    const currentContent = contentBlocks[activeBlock].content;
    const newState = RichUtils.toggleInlineStyle(currentContent, 'BOLD');

    // Now use your method to update the contentBlocks state
    const newContentBlocks = [...contentBlocks];
    newContentBlocks[activeBlock] = { ...newContentBlocks[activeBlock], content: newState };
    setContentBlocks(newContentBlocks);
  };
  const toggleAlignment = (alignment) => {
    if (activeBlock === null || contentBlocks[activeBlock].type !== 'text') return;

    const editorState = contentBlocks[activeBlock].content;
    const contentState = editorState.getCurrentContent(); // Get the ContentState from EditorState
    const selectionState = editorState.getSelection();

    const blockKey = selectionState.getStartKey();
    const block = contentState.getBlockForKey(blockKey);
    const newBlock = block.set('data', block.getData().merge({ textAlign: alignment }));

    const newContentState = contentState.merge({
        blockMap: contentState.getBlockMap().set(blockKey, newBlock),
        selectionAfter: selectionState
    });

    const newState = EditorState.push(editorState, newContentState, 'change-block-data');
    updateEditorState(activeBlock, newState);
};
  // photo block helpers
  const updatePhotoContent = (index, dataUrls) => {
    console.log('dataUrls in updatePhotoContent: ', dataUrls);
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
  const safeEditorState = activeBlock !== null && contentBlocks[activeBlock]
  ? contentBlocks[activeBlock].content
  : null;


  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='pageWrapper'>
      {/* <h1 className={styles.loginHeader}>New Post</h1> */}
      <PostNavbar
        onToggleBold={toggleBold}
        onToggleLeftAlign={() => toggleAlignment('left')}
        onToggleCenterAlign={() => toggleAlignment('center')}
        onToggleRightAlign={() => toggleAlignment('right')}
        onAddText={addTextBlock}
        onAddPhoto={addPhotoBlock}
        onAddVideo={addVideoBlock}
        activeBlock={activeBlock}
        editorState={safeEditorState}
        updateEditorState={updateActiveTextEditorState}
      />

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
              setEditorState={(newState) => updateActiveTextEditorState(newState)}
              isEditable={index === activeBlock}
              onFocus={() => handleFocus(index)}
              onBlur={() => handleBlur(index)}
              onToggleBold={toggleBold}
            />
          )}
          {block.type === 'photo' &&
            <Photo
              key={index}
              updatePhotoContent={(files) => updatePhotoContent(index, files)}
              updatePhotoFormat={(format) => updatePhotoFormat(index, format)}
              isEditable={index === activeBlock}
              src={block.content}
              format={block.format || 'grid'}
            />}
          {block.type === 'video' &&
            <Video
              updateVideoUrl={(url) => updateVideoUrl(index, url)}
              isEditable={index === activeBlock}
              src={block.content}
            />}
          <div className={styles.blockControlsRight}>
          <FontAwesomeIcon icon={faX} onClick={() => removeBlock(index)} className={styles.iconX}/>
          <FontAwesomeIcon icon={index === activeBlock ? faFloppyDisk : faPencil} onClick={() => toggleEditable(index)} className={styles.iconStatus}/>
          </div>
        </div>
      ))}

      </div>
    </div>
  );
}