'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../utils/supabase';
import styles from './new-post.module.css';
import PostNavbar from '../../../components/PostNavbar/PostNavbar';
import PostNavbarLeft from '../../../components/PostNavbarLeft/PostNavbarLeft';
import PrimeText from '../../../components/PrimeText/PrimeText';
import Video from '../../../components/Video/Video';
import PostTitle from '../../../components/PostTitle/PostTitle';
import PhotoBlock from '../../../components/PhotoBlock/PhotoBlock';
import BlockEditMenu from '../../../components/BlockEditMenu/BlockEditMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan, faFloppyDisk, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Intro from '../../../components/Intro/Intro';

export default function NewPostPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([{type: 'title', content: '', style: {width: '0px', height: '0px', x: 0, y: 0}, author: user?.supabase_user}]);
  const [bottomEdge, setBottomEdge] = useState(0);
  const [activeBlock, setActiveBlock] = useState(0);

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
  // calculate the bottom edge of the post
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
    // console.log('BOTTOM EDGE RESULT: ', result)
    setBottomEdge(result);
  }, [contentBlocks])
  // NOT WORKING -- scroll to the bottom when a new content block is added
  useEffect(() => {
    console.log('BOTTOM EDGE CHANGED TO: ', bottomEdge)
    window.scrollTo({
      left: 0,
      top: bottomEdge,
      behavior: 'smooth'
    });
  }, [bottomEdge])


  // on new block: add new gridlines for left, right, top, bottom and center vert/center horizontal
  // during drag or resize: check for gridlines & force snap
  // if within 5px of gridline, force snap
  // if exactly on gridline, allow movement away from gridline, but toward will snap again
  // on snap, update gridlines in contentblocks state

  // on drag or resize stop: update gridlines using addGridlines function
  // separate function for replace vs add gridlines?
  const enableGridSnap = () => {}
  const addGridlines = () => {}
  const removeGridlines = () => {}

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
  // content blocks helpers
  const addPrimeTextBlock = () => {
    const newBlock = { type: 'text', content: '', style: { width:'1000px', height:'200px' , x:0, y: bottomEdge }};
    setContentBlocks([...contentBlocks.map(block => ({ ...block })), newBlock]);
    setActiveBlock(contentBlocks.length);
  }
  const addVideoBlock = () => {
    const newBlock = { type: 'video', content: '', style: { width: '500px', height: '281.25px' , x: 325, y: bottomEdge } };
    setContentBlocks([...contentBlocks.map(block => ({ ...block })), newBlock]);
    setActiveBlock(contentBlocks.length); // New block's index
  };
  const addPhotoBlock = (format) => {
    const newBlock = { type: 'photo', content: null, format: format || 'grid', style: { width: '100%', height: '400px' , x: 325, y: bottomEdge }};
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
  const safeEditorState = activeBlock !== null && contentBlocks[activeBlock]
    ? contentBlocks[activeBlock].content
    : null;


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
      <PostNavbarLeft/>
      {/* <div className={styles.adminFeedWrapper}> */}
      <div className='feedWrapper'>
        <div className='post' style={{height: `${bottomEdge + 200}px`}}>
          {contentBlocks.map((block, index) => (
            <>
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
                  className={`blockWrapper ${index === activeBlock ? 'outlined' : ''}`}
                  style={{height: parseInt(block.style.height, 10) + block.style.y + 50}}
                  onClick={() => {if (index !== activeBlock) {setActiveBlock(index)}}}
                >
                  {activeBlock === index && block.type !== 'title' &&
                    <BlockEditMenu
                      setStatus={() => { toggleEditable(index)}}
                      {...(block.type !== 'title' ? { removeBlock: () => removeBlock(index) } : {})}
                      {...(index !== 1 ? { moveBlockUp: () => moveBlockUp(index) } : {})}
                      {...(contentBlocks[index + 1] ? { moveBlockDown: () => moveBlockDown(index) } : {})}

                    />}


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
                    />
                  </>
                  }

                  {/* <div className={styles.blockControlsRight}>
                    <FontAwesomeIcon icon={index === activeBlock ? faFloppyDisk : faPencil} onClick={() => toggleEditable(index)} className={styles.iconStatus}/>
                    <FontAwesomeIcon icon={faTrashCan} onClick={() => removeBlock(index)} className={styles.iconTrash}/>
                  </div> */}
                </div>
              )}
            </>

          ))}
        </div>
      </div>
      {/* </div> */}
    </>
  );
}