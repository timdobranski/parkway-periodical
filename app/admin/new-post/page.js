'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../utils/supabase';
import styles from './new-post.module.css';
import PostNavbar from '../../../components/PostNavbar/PostNavbar';
import PrimeText from '../../../components/PrimeText/PrimeText';
import Video from '../../../components/Video/Video';
import PostTitle from '../../../components/PostTitle/PostTitle';
import PhotoBlock from '../../../components/PhotoBlock/PhotoBlock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faCaretUp, faCaretDown, faPencil, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

export default function NewPostPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([{type: 'title', content: '', style: {width: '0px', height: '0px', x: 0, y: 0}}]);
  const [bottomEdge, setBottomEdge] = useState(0);
  const [activeBlock, setActiveBlock] = useState(0);
  const prevLengthRef = useRef(contentBlocks.length);
  const [postHeight, setPostHeight] = useState(500);
  const minHeight = 500;

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
    console.log('ROOT PAGE contentblocks changed: ', contentBlocks)
  }, [contentBlocks])

  // supposed to make the page scroll to the bottom when a new block is added - doesnt work
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

  useEffect(() => {
    // create a bottomEdges array to store the bottom edge of each content block
    const bottomEdges = [];
    // for each content block
    contentBlocks.forEach((block) => {
      console.log('block: ', block)
      // calculate its bottom edge by adding its height to its y position
      var bottomEdge = block.style.y + parseInt(block.style.height, 10);
      bottomEdges.push(bottomEdge);
    })
    console.log('BOTTOM EDGES: ', bottomEdges)
    // find the biggest number, add 50, and set the bottomEdge state to the result
    const largestNumber = Math.max(...bottomEdges);
    const result = largestNumber + 50; // add 50 pixels for padding
    console.log('RESULT: ', result)
    setBottomEdge(result);
  }, [contentBlocks])

  // post height helpers
  let startY = 0; // Starting Y position of the mouse
  let startHeight = 0; // Starting height of the div

  const handleMouseDown = (e) => {
    startY = e.clientY;
    startHeight = postHeight;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const newHeight = startHeight + e.clientY - startY;
    setPostHeight(Math.max(newHeight, minHeight)); // minHeight is the minimum allowed height of the div
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };



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
    console.log('inside handle submit');
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
            format: block.format
          };
        }
        return block;
      }));

      const post = {
        content: JSON.stringify(processedBlocks)
      };

      const { error } = await supabase.from('posts').insert([post]);
      if (error) throw new Error('Error submitting content blocks: ', error.message);

      router.push('/public/home');
    } catch (error) {
      console.error('Error in handleSubmit: ', error);
    }
  }
  // content blocks helpers
  const addPrimeTextBlock = () => {
    const newBlock = { type: 'text', content: '', style: { width:'1000px', height:'200px' , x:0, y: bottomEdge }};
    setContentBlocks([...contentBlocks.map(block => ({ ...block })), newBlock]);
    setActiveBlock(contentBlocks.length);
    window.scrollTo({
      left: 0,
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }
  const addVideoBlock = () => {
    const newBlock = { type: 'video', content: '', style: { width: '1000px', height: '562.5px' , x: 0, y: bottomEdge } };
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
  // style should be an object with height, width, top, and left values set to numbers
  const updateBlockStyle = (index, style) => {
    const newContentBlocks = [...contentBlocks];
    newContentBlocks[index] = { ...newContentBlocks[index], style: style };
    setContentBlocks(newContentBlocks);
  }
  // const safeEditorState = activeBlock !== null && contentBlocks[activeBlock]
  //   ? contentBlocks[activeBlock].content
  //   : null;


  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <PostNavbar
        onAddText={addPrimeTextBlock}
        onAddPhoto={addPhotoBlock}
        onAddVideo={addVideoBlock}
        activeBlock={activeBlock}
        setActiveBlock={setActiveBlock}
        handleSubmit={handleSubmit}
      />

      <div className='postPreview' style={{height: `${bottomEdge + 500}px`}}>
        {contentBlocks.map((block, index) => (
          <div key={index} className='blockWrapper'>
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
                blockIndex={index}
                isEditable={index === activeBlock}
                toggleEditable={toggleEditable}
                src={block}
                setActiveBlock={setActiveBlock}
                setTextState={updateActiveTextEditorState}
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
            <Video
              updateVideoUrl={(url) => updateVideoUrl(index, url)}
              updateBlockStyle={(style) => updateBlockStyle(index, style)}
              setActiveBlock={setActiveBlock}
              isEditable={index === activeBlock}
              toggleEditable={toggleEditable}
              src={block}
              blockIndex={index}
              removeBlock={() => removeBlock(index)}
            />
            }
            <div className={styles.blockControls}>
              {block.type === 'title' ? (null) : (<FontAwesomeIcon icon={index === activeBlock ? faFloppyDisk : faPencil} onClick={() => toggleEditable(index)} className={styles.iconStatus}/>)}
              {block.type === 'title' ? (null) : (<FontAwesomeIcon icon={faTrashCan} onClick={() => removeBlock(index)} className={styles.iconTrash}/>)}
            </div>
          </div>
        ))}
        {/* {contentBlocks.length === 1 && contentBlocks[0].type === 'title' && <div className={styles.noBlocksMessage}>Add some content above to get started!</div>} */}
        <div
          className={styles.bottomResizer}
          onMouseDown={handleMouseDown}
        >
          {/* This is the resize handler */}
        </div>
      </div>
    </>
  );
}