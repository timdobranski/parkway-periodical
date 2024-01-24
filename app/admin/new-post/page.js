'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../utils/supabase';
import styles from './new-post.module.css';
import { EditorState, RichUtils } from 'draft-js';
import PostNavbar from '../../../components/PostNavbar/PostNavbar';
import PrimeText from '../../../components/PrimeText/PrimeText';
import Video from '../../../components/Video/Video';
import PostTitle from '../../../components/PostTitle/PostTitle';
import PhotoBlock from '../../../components/PhotoBlock/PhotoBlock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faCaretUp, faCaretDown, faPencil, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

export default function NewPostPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([{type: 'title', content: ''}]);
  const [activeBlock, setActiveBlock] = useState(0);
  const prevLengthRef = useRef(contentBlocks.length);

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
    console.log('contentblocks: ', contentBlocks)
  }, [contentBlocks])

  useEffect(() => {
    const currentLength = contentBlocks.length;
    const prevLength = prevLengthRef.current;

    if (currentLength > prevLength) {
      // Wait for the next DOM update
      setTimeout(() => {
        window.scrollTo({
          left: 0,
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 0);
    }

    prevLengthRef.current = currentLength;
  }, [contentBlocks]);
// Helper function to upload image to Supabase Storage
async function uploadImageToSupabase(base64String, fileName) {
  // Convert base64 string to a Blob
  const fetchResponse = await fetch(base64String);
  const blob = await fetchResponse.blob();

  // Generate a unique file name if not provided
  const uniqueFileName = fileName || `image_${new Date().getTime()}`;

  const filePath = `${uniqueFileName}.webp`; // Assuming the image is in webp format
  let { error, data } = await supabase.storage.from('posts/photos').upload(filePath, blob);

  if (error) {
    console.error('Detailed error uploading image:', error);
    throw new Error('Error uploading image');
  }

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/posts/photos/${filePath}`;
}
// Handler to submit content blocks
async function handleSubmit() {
  console.log('inside handle submit');
  try {
    const processedBlocks = await Promise.all(contentBlocks.map(async (block) => {
      if (block.type === 'photo') {
        // Process photo blocks
        const processedPhotos = await Promise.all(block.content.map(async (photo) => {
          if (typeof photo.src === 'string' && photo.src.startsWith('data:')) {
            const uploadedImageUrl = await uploadImageToSupabase(photo.src, photo.title);
            return { ...photo, src: uploadedImageUrl };
          }
          return photo; // Return as is if not a data URL
        }));

        // Instead of returning the block with nested content, return the photo content directly
        return {
          type: block.type,
          content: processedPhotos,
          format: block.format // Assuming format is a property you want to keep at this level
        };
      }
      return block;
    }));

    // Prepare post object with content as jsonb
    const post = {
      // Include other post fields if necessary
      content: JSON.stringify(processedBlocks)
    };

    // Submit post object to Supabase table
    const { error } = await supabase.from('posts').insert([post]);
    if (error) throw new Error('Error submitting content blocks: ', error.message);

    // Redirect or update state as needed
    router.push('/public/home');
  } catch (error) {
    console.error('Error in handleSubmit: ', error);
  }
}
  // content blocks helpers
  const addPrimeTextBlock = () => {
        const newBlock = { type: 'text', content: '' };
    setContentBlocks([...contentBlocks.map(block => ({ ...block })), newBlock]);
    setActiveBlock(contentBlocks.length);
    window.scrollTo({
      left: 0,
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }
  const addVideoBlock = () => {
    const newBlock = { type: 'video', content: '', };
    setContentBlocks([...contentBlocks.map(block => ({ ...block })), newBlock]);
    window.scrollTo({
      left: 0,
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
    setActiveBlock(contentBlocks.length); // New block's index
  };
  const addPhotoBlock = (format) => {
    const newBlock = { type: 'photo', content: null, format: format || 'grid'};
    setContentBlocks([...contentBlocks.map(block => ({ ...block })), newBlock]);
    setActiveBlock(contentBlocks.length); // New block's index
    window.scrollTo({
      left: 0,
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
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
    console.log('photos passed to updatePhotoContent: ', photos);
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
  const safeEditorState = activeBlock !== null && contentBlocks[activeBlock]
  ? contentBlocks[activeBlock].content
  : null;


  if (!user) {
    return <div>Loading...</div>;
  }



  return (
    <>
      {/* <h1 className={styles.loginHeader}>New Post</h1> */}
      <PostNavbar
        onAddText={addPrimeTextBlock}
        onAddPhoto={addPhotoBlock}
        onAddVideo={addVideoBlock}
        activeBlock={activeBlock}
        setActiveBlock={setActiveBlock}
        handleSubmit={handleSubmit}
      />

      <div className='postPreview'>
      {contentBlocks.map((block, index) => (
        <div key={index} className='blockWrapper'>
          <div className={styles.blockControlsLeft}>
            <FontAwesomeIcon icon={faCaretUp} onClick={() => moveBlockUp(index)} className={styles.iconUp}/>
            <FontAwesomeIcon icon={faCaretDown} onClick={() => moveBlockDown(index)} className={styles.iconDown}/>
          </div>
          {block.type === 'title' && (
              <PostTitle
                isEditable={index === activeBlock}
                title={block.content}
                updateTitle={updateTitle}
                index={index}
                activeBlock={activeBlock}
                setActiveBlock={setActiveBlock}
              />
          )}
          {block.type === 'text' && (
            <PrimeText
            isEditable={index === activeBlock}
            textState={block.content}
            setTextState={updateActiveTextEditorState}
            onClick={() => setActiveBlock(index)}
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
              />
          }
          {block.type === 'video' &&
            <Video
              updateVideoUrl={(url) => updateVideoUrl(index, url)}
              setActiveBlock={setActiveBlock}
              isEditable={index === activeBlock}
              src={block.content}
            />
            }
          <div className={styles.blockControlsRight}>
          <FontAwesomeIcon icon={index === activeBlock ? faFloppyDisk : faPencil} onClick={() => toggleEditable(index)} className={styles.iconStatus}/>
          {block.type === 'title' ? (null) : (<FontAwesomeIcon icon={faX} onClick={() => removeBlock(index)} className={styles.iconX}/>)}
          </div>
        </div>
      ))}
        {/* {contentBlocks.length === 1 && contentBlocks[0].type === 'title' && <div className={styles.noBlocksMessage}>Add some content above to get started!</div>} */}
      </div>
    </>
  );
}