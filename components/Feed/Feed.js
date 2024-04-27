'use client'

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../utils/supabase';
import styles from './Feed.module.css';
import PrimeText from '../../components/PrimeText/PrimeText';
import Video from '../../components/Video/Video';
import PostTitle from '../../components/PostTitle/PostTitle';
import PhotoBlock from '../../components/PhotoBlock/PhotoBlock';
import ContentLayout from '../../components/ContentLayout/ContentLayout';
import SelectLayoutContent from '../../components/SelectLayoutContent/SelectLayoutContent';
import BlockEditMenu from '../../components/BlockEditMenu/BlockEditMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan, faFloppyDisk, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Intro from '../../components/Intro/Intro';


export default function Feed({ contentBlocks, setContentBlocks, user,
  activeBlock, setActiveBlock, viewContext, orientation, parentIndex, parentActiveBlock, parentContentBlocks, addBlock }) {

  const blocksRef = useRef({});

  // content blocks helpers - being phased out for universal addBlock helper
  const addPrimeTextBlock = () => {
    const newBlock = { type: 'text', content: ''};
    setContentBlocks([...contentBlocks.map(block => ({ ...block })), newBlock]);
    setActiveBlock(contentBlocks.length);
  }
  const addVideoBlock = () => {
    const newBlock = { type: 'video', content: '', orientation: 'landscape', style: { width: '100%', height: 'auto' , x: 325, y: 0, maxHeight:'50vh' } };
    setContentBlocks([...contentBlocks.map(block => ({ ...block })), newBlock]);
    setActiveBlock(contentBlocks.length); // New block's index
  };
  const addPhotoBlock = (format) => {
    const newBlock = { type: 'photo', content: null, format: format || 'grid', style: { width: '100%', height: 'auto' , x: 325, y: 0 }};
    setContentBlocks([...contentBlocks.map(block => ({ ...block })), newBlock]);
    setActiveBlock(contentBlocks.length); // New block's index
  };
  // sets new properties on the block. works on layouts if passed the nestedIndex  // requires block index, new properties at the root of the block, and, if a layout, the index of the column being updated.
  const updateBlock = (index, updatedProperties, nestedIndex = null) => {
    // console.log('INSIDE UPDATE BLOCK FUNCTION: ', index, updatedProperties, nestedIndex)
    // console.log('INSIDE UPDATE BLOCK FUNCTION---contentBlocks: ', contentBlocks)

    const updatedBlocks = parentContentBlocks.map((block, idx) => { // iterate through the main array
      if (idx === index) { // on the current flexibleLayout block

        // Check if the current block is a 'flexibleLayout' and if there's a nested index provided
        if (nestedIndex !== null && block.type === 'flexibleLayout') {

          // Map through the nested 'contentBlocks' to find and update the specific nested block
          const updatedNestedBlocks = block.contentBlocks.map((nestedBlock, nestedIdx) => { // iterate through the nested array
            if (nestedIdx === nestedIndex) {
              // console.log('NESTED BLOCK FOUND: ', { ...nestedBlock, ...updatedProperties })
              // Update only the specific nested block with the new properties
              return { ...nestedBlock, ...updatedProperties };
            }
            return nestedBlock; // Return all other nested blocks unchanged
          });
          console.log('UPDATED NESTED BLOCKS: ', updatedNestedBlocks) // correctly logs the value of inner contentBlocks

          // always logs correct value
          console.log('BLOCK:', block);

          // Return the updated block with modified nested 'contentBlocks'
          const result = { ...block, contentBlocks: updatedNestedBlocks };
          // logs twice, and the second time always includes an extra unwated 'content' property
          console.log('result of updateBlock on flexibleLayout block: ', result)
          return result;
        }
        // If not a 'flexibleLayout' or no nestedIndex, update the block at the outer level
        // return { ...block, ...updatedProperties };
      }
      // Return all other blocks unchanged
      return block;
    });
    // Update the state with the new array of blocks
    setContentBlocks(updatedBlocks);
  };
  const updateNestedBlock = (index, nestedIndex, updatedProperties) => {
    setContentBlocks(prevContentBlocks => {
      // Creating a deep copy of the previous content blocks
      let newContentBlocks = [...prevContentBlocks];

      // Check if the target content block and the nested content block exist
      if (newContentBlocks[index] && newContentBlocks[index].contentBlocks && newContentBlocks[index].contentBlocks[nestedIndex]) {
        // Update the nested content block's properties
        newContentBlocks[index].contentBlocks[nestedIndex] = {
          ...newContentBlocks[index].contentBlocks[nestedIndex],
          ...updatedProperties
        };
      } else {
        console.error('Invalid indices or structure missing');
      }

      return newContentBlocks;
    });
  };



  const addFlexibleLayout = (columns) => {
    // Create an array with 'columns' number of empty objects
    const placeholders = Array.from({ length: columns }, () => ({
      type: null, // No type initially
      content: null, // No content initially
      style: {}    // Empty style object, can be populated later based on type
    }));

    const newBlock = {
      type: 'flexibleLayout',
      contentBlocks: placeholders,
      columns: columns
    };

    setContentBlocks([...contentBlocks, newBlock]); // Append new block to the existing blocks
    setActiveBlock(contentBlocks.length); // Set active block to the newly added block
  };
  const removeBlock = (index) => {
    // Remove the selected block
    const updatedBlocks = contentBlocks.filter((_, i) => i !== index);
    setContentBlocks(updatedBlocks);

    // Adjust activeBlock if necessary
    if (index === activeBlock) {
      setActiveBlock(null);
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
    if (index === activeBlock) {
      // If the block is already active
      setActiveBlock(null); // Set to null
    } else {
      // If the block is not active
      setActiveBlock(index); // Set to the clicked block
    }
  };
  const updateBlockContent = (index, newContent) => {
    // Create a new array with the updated block's content
    const updatedBlocks = contentBlocks.map((block, i) => {
      if (i === index) {
        // Only update the content of the block at the specified index
        return { ...block, content: newContent };
      }
      return block;
    });

    // Update the state to the new array of blocks
    setContentBlocks(updatedBlocks);
  };
  // title block helper
  const updateTitle = (newText) => {
    setContentBlocks(contentBlocks.map((block, index) => {
      if (index === activeBlock) {
        return { ...block, content: newText };
      }
      return block;
    }));
  };
  const updateTextEditorState = (newText) => {
    setContentBlocks(contentBlocks.map((block, index) => {
      if (index === activeBlock) {
        return { ...block, content: newText };
      }
      return block;
    }));
  };
  // photo block helpers
  const updatePhotoContent = (index, photos) => {
    // console.log('photos passed to updatePhotoContent: ', photos);
    const newContentBlocks = [...contentBlocks];
    newContentBlocks[index] = { ...newContentBlocks[index], content: photos };
    setContentBlocks(newContentBlocks);
  };
  // video block helpers
  const updateVideoUrl = (index, url) => {
    const newContentBlocks = [...contentBlocks];
    newContentBlocks[index] = { ...newContentBlocks[index], content: url };
    setContentBlocks(newContentBlocks);
  }
  const updateVideoOrientation = (index, orientation) => {
    const newContentBlocks = [...contentBlocks];
    newContentBlocks[index] = { ...newContentBlocks[index], orientation: orientation };
    setContentBlocks(newContentBlocks);
  }
  // style should be an object with height, width, top, and left values set to numbers
  const updateBlockStyle = (index, style) => {
    const newContentBlocks = [...contentBlocks];
    newContentBlocks[index] = { ...newContentBlocks[index], style: style };
    setContentBlocks(newContentBlocks);
  }

  if (!user) { return <h1>Loading...</h1>}

  const feed = (
    <div className={`post ${styles.adminPost}`}
    >
      {contentBlocks.map((block, index) => (
        <React.Fragment key={index}>
          {/* if the block is the title, render the title component */}
          {block.type === 'title' ? (
            <>
              <PostTitle
                isEditable={index === activeBlock}
                src={block}
                updateTitle={updateTitle}
                index={index}
                activeBlock={activeBlock}
                setActiveBlock={setActiveBlock}
                user={user.supabase_user}
              />
              {contentBlocks.length === 1 && <div className={styles.noBlocksMessage}>Add some content from the menu on the right to get started</div>}

            </>
          ) : (

            <div
              key={index}
              ref={el => blocksRef.current[index] = el}
              className={`${orientation === 'vertical' ? 'blockWrapper' : 'columnBlockWrapper'} ${index === activeBlock ? 'outlined' : ''}`}
              // style={{height: parseInt(block.style.height, 10) + block.style.y}}
              onClick={(e) => {
                e.stopPropagation();
                if (index !== activeBlock) {setActiveBlock(index)}
              }}
            >
              {activeBlock === index && block.type !== 'title' &&
                  <BlockEditMenu
                    setStatus={() => { toggleEditable(index)}}
                    {...(block.type !== 'title' ? { removeBlock: () => removeBlock(index) } : {})}
                    {...(index !== 1 ? { moveBlockUp: () => moveBlockUp(index) } : {})}
                    {...(contentBlocks[index + 1] ? { moveBlockDown: () => moveBlockDown(index) } : {})}

                  />}
              {block.type === 'flexibleLayout' && (
                <ContentLayout

                  parentContentBlocks={contentBlocks}
                  src={block.nestedBlocks}
                  setActiveBlock={setActiveBlock}
                  viewContext={viewContext}
                  orientation='horizontal'
                  user={user}
                  addBlock={addBlock}
                  setContentBlocks={(newContent) => updateBlockContent(index, newContent)}
                  parentIndex={index}
                  parentActiveBlock={activeBlock}
                />
              )}
              {/* {block.type === 'undecided' && (
                <SelectLayoutContent
                  addBlock={(newBlock, childIndex) => { addBlock(newBlock, parentIndex, childIndex)}}
                  index={index}
                />
              )} */}

              {block.type === 'text' && (
                <PrimeText
                  blockIndex={index}
                  isEditable={index === activeBlock}
                  toggleEditable={toggleEditable}
                  src={block}
                  setActiveBlock={setActiveBlock}
                  setTextState={updateTextEditorState}
                  onClick={() => setActiveBlock(index)}
                  updateBlockStyle={(style) => updateBlockStyle(index, style)}
                  removeBlock={() => removeBlock(index)}
                />
              )}
              {block.type === 'photo' &&
              <PhotoBlock
                key={index}
                blockIndex={index}
                updatePhotoContent={(files) => updatePhotoContent(index, files)}
                isEditable={index === activeBlock}
                src={block}
                setActiveBlock={setActiveBlock}
                removeBlock={() => removeBlock(index)}
              />
              }
              {block.type === 'video' &&
                <>
                  <Video
                    updateVideoUrl={(url) => updateVideoUrl(index, url)}
                    updateBlockStyle={(style) => updateBlockStyle(index, style)}
                    setActiveBlock={orientation === 'vertical' ? setActiveBlock : null}
                    isEditable={orientation === 'vertical' ? (index === activeBlock) :
                    //  (index=== activeBlock && parentIndex === parentActiveBlock)
                      true
                    }
                    toggleEditable={toggleEditable}
                    src={block}
                    blockIndex={index}
                    removeBlock={() => removeBlock(index)}
                    updateVideoOrientation={(orientation) => updateVideoOrientation(index, orientation)}
                    viewContext={'edit'}
                    updateBlock={(updatedProps) => {updateBlock(parentIndex, updatedProps, index)}} // updated props is {content: url}
                    updateNestedBlock={(updatedProps) => updateNestedBlock(parentIndex, index, updatedProps)}
                  />
                </>
              }
            </div>
          )}
        </React.Fragment>

      ))}
    </div>
  )

  if (orientation === 'horizontal') { return (feed)}

  return (
    <div className={`feedWrapper ${styles.adminFeedWrapper}`}>
      {feed}
    </div>
  )

}