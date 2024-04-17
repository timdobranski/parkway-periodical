'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../utils/supabase';
import styles from './new-post.module.css';
import PostNavbarLeft from '../../../components/PostNavbarLeft/PostNavbarLeft';
import PostNavbarRight from '../../../components/PostNavbarRight/PostNavbarRight';
import PrimeText from '../../../components/PrimeText/PrimeText';
import Video from '../../../components/Video/Video';
import PostTitle from '../../../components/PostTitle/PostTitle';
import PhotoBlock from '../../../components/PhotoBlock/PhotoBlock';
import ContentLayout from '../../../components/ContentLayout/ContentLayout';
import BlockEditMenu from '../../../components/BlockEditMenu/BlockEditMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan, faFloppyDisk, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Intro from '../../../components/Intro/Intro';

export default function NewPostPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([{type: 'title', content: '', style: {width: '0px', height: '0px', x: 0, y: 0}, author: user?.supabase_user}]);
  const [activeBlock, setActiveBlock] = useState(null);
  const blocksRef = useRef({});


  useEffect(() => {
    console.log('user: ', user)
  }, [user])
  useEffect(() => {
    const getAndSetUser = async () => {
      const response = await supabase.auth.getSession();

      if (response.data.session) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', response.data.session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        if (data) {
          // Append the user ID from your users table to the user object
          const updatedUser = { ...response.data.session.user, supabase_user: data };
          setUser(updatedUser);
        }
      } else {
        router.push('/auth');
      }
    };
    getAndSetUser();
  }, [router]);
  useEffect(() => {
    console.log('ROOT PAGE contentblocks changed: ', contentBlocks)
  }, [contentBlocks])
  useEffect(() => {
    console.log('ACTIVE BLOCK: ', activeBlock)
  }, [activeBlock])
  // Helper function to upload image to Supabase Storage
  async function uploadImageToSupabase(base64String, fileName) {
    const fetchResponse = await fetch(base64String);
    const blob = await fetchResponse.blob();

    // Use a combination of timestamp and a random string to ensure filename uniqueness
    const uniqueSuffix = `${new Date().getTime()}_${Math.random().toString(36).substring(2, 15)}`;
    const uniqueFileName = fileName ? `${fileName}_${uniqueSuffix}` : `image_${uniqueSuffix}`;

    const filePath = `${uniqueFileName}.webp`; // Assuming the image is in webp format
    let { error, data } = await supabase.storage.from('posts/photos').upload(filePath, blob);

    if (error) {
      console.error('Detailed error uploading image:', error);
      throw new Error('Error uploading image');
    }

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts/photos/${filePath}`;
  }
  // publish post to supabase
  async function handleSubmit() {
    // console.log('inside handle submit');
    try {
      const processedBlocks = await Promise.all(contentBlocks.map(async (block) => {
      // Check if block type is 'title' and content is falsy
        if (block.type === 'title' && !block.content) {
          block.content = `Weekly Update`;
        } else if (block.type === 'photo') {
          const photoPromises = block.content.map(async (photo) => {
            if (typeof photo.src === 'string' && photo.src.startsWith('data:')) {
              return uploadImageToSupabase(photo.src, photo.title).then(uploadedImageUrl => ({ ...photo, src: uploadedImageUrl }));
            }
            return Promise.resolve(photo); // Resolve immediately if not a data URL
          });

          // Use Promise.all to ensure the order of photos is preserved
          const processedPhotos = await Promise.all(photoPromises);

          return {
            type: block.type,
            content: processedPhotos,
            format: block.format,
            author: user.supabase_user
          };
        }
        return block;
      }));

      const post = {
        content: JSON.stringify(processedBlocks),
        'post-type': 'weekly-update',
        author: JSON.stringify(user.supabase_user)
      };

      const { error } = await supabase.from('posts').insert([post]);
      if (error) throw new Error('Error submitting content blocks: ', error.message);

      router.push('/');
    } catch (error) {
      console.error('Error in handleSubmit: ', error);
    }
  }
  // content blocks helpers - being phased out for universal addBlock helper
  const addPrimeTextBlock = () => {
    const newBlock = { type: 'text', content: '', style: { width:'1000px', height:'200px' , x:0, y: 0 }};
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
    window.scrollTo({
      left: 0,
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };
  // UNIVERSAL BLOCK HELPERS ----- ADD AND UPDATE

  // add a new block. takes new block obj, outer index, then inner index
  const addBlock = (newBlock, parentIndex = null, nestedIndex = null) => {
    if (parentIndex !== null && nestedIndex !== null) {
      // Adding a block inside a nested flexibleLayout
      const updatedBlocks = contentBlocks.map((block, idx) => {
        if (idx === parentIndex && block.type === 'flexibleLayout') {
          const updatedNestedBlocks = block.contentBlocks.map((nestedBlock, nestedIdx) => {
            if (nestedIdx === nestedIndex) {
              return { ...nestedBlock, ...newBlock };
            }
            return nestedBlock;
          });
          return { ...block, contentBlocks: updatedNestedBlocks };
        }
        return block;
      });
      setContentBlocks(updatedBlocks);
    } else {
      // Adding a block at the top level
      setContentBlocks([...contentBlocks, newBlock]);
    }
    setActiveBlock(contentBlocks.length);
  };
  // sets new properties on the block. works on layouts if passed the nestedIndex  // requires block index, new properties at the root of the block, and, if a layout, the index of the column being updated.
  const updateBlock = (index, updatedProperties, nestedIndex = null) => {
    const updatedBlocks = contentBlocks.map((block, idx) => {
      if (idx === index) {
        if (nestedIndex !== null && block.type === 'flexibleLayout') {
          // Handle the nested blocks within a flexibleLayout block
          const updatedNestedBlocks = block.content.map((nestedBlock, nestedIdx) => {
            if (nestedIdx === nestedIndex) {
              return { ...nestedBlock, ...updatedProperties };
            }
            return nestedBlock;
          });
          return { ...block, content: updatedNestedBlocks };
        }
        // Update the block if there is no nested index or not a flexibleLayout
        return { ...block, ...updatedProperties };
      }
      return block;
    });

    setContentBlocks(updatedBlocks);
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
  // text block helpers
  const renderCustomToolbar = () => {
    return (
      <span className='ql-formats'>
        <button className='ql-bold' aria-label='Bold'></button>
        <button className='ql-italic' aria-label='Italic'></button>
        <button className='ql-underline' aria-label='Underline'></button>
        <button className='ql-link' aria-label='Link'></button>
        <select className="ql-color">
          <option value="white" default>White</option>
          <option value="rgb(227, 227, 227)" default>10Gray</option>
          <option value="rgb(198, 198, 198)" default>20Gray</option>
          <option value="rgb(170, 170, 170)" default>30Gray</option>
          <option value="rgb(142, 142, 142)" default>40Gray</option>
          <option value="rgb(113, 113, 113)" default>50Gray</option>
          <option value="rgb(85, 85, 85)" default>60Gray</option>
          <option value="rgb(57, 57, 57)" default>70Gray</option>
          <option value="rgb(28, 28, 28)" default>80Gray</option>
          <option value="black" default>Black</option>

          <option value="rgb(152, 0, 0)">DarkRed1</option>
          <option value="rgb(255, 0, 0)">Red</option>
          <option value="rgb(255, 153, 0)">Orange</option>
          <option value="rgb(255, 255, 0)">Yellow</option>
          <option value="rgb(0, 255, 0)">Green1</option>
          <option value="rgb(0, 255, 255)">BlueGreen1</option>
          <option value="rgb(74, 134, 232)">Blue1</option>
          <option value="rgb(0, 0, 255)">LightBlue1</option>
          <option value="rgb(153, 0, 255)">Purple1</option>
          <option value="rgb(255, 0, 255)">Magenta1</option>

          <option value="rgb(230, 184, 175)">DarkRed2</option>
          <option value="rgb(244, 204, 204)">Red2</option>
          <option value="rgb(252, 229, 205)">Orange2</option>
          <option value="rgb(255, 242, 204)">Yellow2</option>
          <option value="rgb(217, 234, 211)">Green2</option>
          <option value="rgb(208, 224, 227)">BlueGreen2</option>
          <option value="rgb(201, 218, 248)">Blue2</option>
          <option value="rgb(207, 226, 243)">LightBlue2</option>
          <option value="rgb(217, 210, 233)">Purple2</option>
          <option value="rgb(234, 209, 220)">Magenta2</option>


          <option value="rgb(221, 126, 107)">DarkRed3</option>
          <option value="rgb(234, 153, 153)">Red3</option>
          <option value="rgb(249, 203, 156)">Orange3</option>
          <option value="rgb(255, 229, 153)">Yellow3</option>
          <option value="rgb(182, 215, 168)">Green3</option>
          <option value="rgb(162, 196, 201)">BlueGreen3</option>
          <option value="rgb(164, 194, 244)">Blue3</option>
          <option value="rgb(159, 197, 232)">LightBlue3</option>
          <option value="rgb(180, 167, 214)">Purple3</option>
          <option value="rgb(213, 166, 189)">Magenta3</option>


          <option value="rgb(204, 65, 37)">DarkRed4</option>
          <option value="rgb(224, 102, 102)">Red4</option>
          <option value="rgb(246, 178, 107)">Orange4</option>
          <option value="rgb(255, 217, 102)">Yellow4</option>
          <option value="rgb(147, 196, 125)">Green4</option>
          <option value="rgb(118, 165, 175)">BlueGreen4</option>
          <option value="rgb(109, 158, 235)">Blue4</option>
          <option value="rgb(111, 168, 220)">LightBlue4</option>
          <option value="rgb(142, 124, 195)">Purple4</option>
          <option value="rgb(194, 123, 160)">Magenta4</option>

          <option value="rgb(133, 32, 12)">DarkRed5</option>
          <option value="rgb(204, 0, 0)">Red5</option>
          <option value="rgb(230, 145, 56)">Orange5</option>
          <option value="rgb(241, 194, 50)">Yellow5</option>
          <option value="rgb(106, 168, 79)">Green5</option>
          <option value="rgb(69, 129, 142)">BlueGreen5</option>
          <option value="rgb(60, 120, 216)">Blue5</option>
          <option value="rgb(61, 133, 198)">LightBlue5</option>
          <option value="rgb(103, 78, 167)">Purple5</option>
          <option value="rgb(166, 77, 121)">Magenta5</option>

          <option value="rgb(153, 0, 0)">DarkRed6</option>
          <option value="rgb(153, 0, 0)">Red6</option>
          <option value="rgb(180, 95, 6)">Orange6</option>
          <option value="rgb(194, 144, 0)">Yellow6</option>
          <option value="rgb(56, 118, 29)">Green6</option>
          <option value="rgb(19, 79, 92)">BlueGreen6</option>
          <option value="rgb(17, 85, 204)">Blue6</option>
          <option value="rgb(11, 83, 148)">LightBlue6</option>
          <option value="rgb(53, 28, 117)">Purple6</option>
          <option value="rgb(116, 27, 71)">Magenta6</option>

          <option value="rgb(91, 15, 0)">DarkRed7</option>
          <option value="rgb(102, 0, 0)">Red7</option>
          <option value="rgb(120, 63, 4)">Orange7</option>
          <option value="rgb(127, 96, 0)">Yellow7</option>
          <option value="rgb(39, 78, 19)">Green7</option>
          <option value="rgb(12, 52, 61)">BlueGreen7</option>
          <option value="rgb(28, 69, 135)">Blue7</option>
          <option value="rgb(7, 55, 99)">LightBlue7</option>
          <option value="rgb(32, 18, 77)">Purple7</option>
          <option value="rgb(76, 17, 48)">Magenta7</option>
        </select>
        <select className="ql-background">
          <option value="white" default>White</option>
          <option value="yellow">Yellow</option>
          <option value="cyan">Cyan</option>
          <option value="magenta">Magenta</option>
          {/* Add more highlight colors as needed */}
        </select>
      </span>
    )
  }
  const updateActiveTextEditorState = (newText) => {
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
  const safeEditorState = activeBlock !== null && contentBlocks[activeBlock]
    ? contentBlocks[activeBlock].content
    : null;


  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <PostNavbarRight
        onAddText={addPrimeTextBlock}
        onAddPhoto={addPhotoBlock}
        onAddVideo={addVideoBlock}
        onAddLayout={addFlexibleLayout}
        activeBlock={activeBlock}
        setActiveBlock={setActiveBlock}
        handleSubmit={handleSubmit}
        addBlock={addBlock}
      />
      <PostNavbarLeft/>

      <div className='feedWrapper'>
        <div className='post'
        // style={{ height: `calc(${bottomEdge}px + 6rem + 250px)` }}
        >
          {contentBlocks.map((block, index) => (
            <React.Fragment key={index}>
              {/* if the block is the title, render the title component & save icon */}
              {block.type === 'title' ? (
                <>
                  <PostTitle
                    isEditable={index === activeBlock}
                    src={block}
                    updateTitle={updateTitle}
                    index={index}
                    activeBlock={activeBlock}
                    setActiveBlock={setActiveBlock}
                    key={index}
                    user={user.supabase_user}
                  />
                  {contentBlocks.length === 1 && <div className={styles.noBlocksMessage}>Add some content from the menu on the right to get started</div>}

                </>
              ) : (

                <div
                  key={index}
                  ref={el => blocksRef.current[index] = el}
                  className={`blockWrapper ${index === activeBlock ? 'outlined' : ''}`}
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
                      blockIndex={index}
                      isEditable={index === activeBlock}
                      toggleEditable={toggleEditable}
                      src={block.contentBlocks}
                      setActiveBlock={setActiveBlock}
                      onClick={() => setActiveBlock(index)}
                      // updateBlockStyle={(style) => updateBlockStyle(index, style)}
                      updateBlockContent={(newContent) => {updateBlockContent(index, newContent)}}
                      addText={addPrimeTextBlock}
                      addVideo={addVideoBlock}
                      addPhoto={addPhotoBlock}
                      removeBlock={() => removeBlock(index)}
                      columns={block.columns}
                    />
                  )}

                  {block.type === 'text' && (
                    <PrimeText
                      blockIndex={index}
                      isEditable={index === activeBlock}
                      toggleEditable={toggleEditable}
                      src={block}
                      setActiveBlock={setActiveBlock}
                      setTextState={updateActiveTextEditorState}
                      onClick={() => setActiveBlock(index)}
                      updateBlockStyle={(style) => updateBlockStyle(index, style)}
                      removeBlock={() => removeBlock(index)}
                      toolbar={renderCustomToolbar()}
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
                      setActiveBlock={setActiveBlock}
                      isEditable={index === activeBlock}
                      toggleEditable={toggleEditable}
                      src={block}
                      blockIndex={index}
                      removeBlock={() => removeBlock(index)}
                      updateVideoOrientation={(orientation) => updateVideoOrientation(index, orientation)}
                      viewContext={'edit'}
                    />
                  </>
                  }
                </div>
              )}
            </React.Fragment>

          ))}
        </div>
      </div>
    </>
  );
}