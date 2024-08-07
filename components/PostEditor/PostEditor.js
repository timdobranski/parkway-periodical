'use client'

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import styles from './PostEditor.module.css';
import PrimeText from '../../components/PrimeText/PrimeText';
import Video from '../../components/Video/Video';
import PostTitle from '../../components/PostTitle/PostTitle';
import PhotoBlock from '../../components/PhotoBlock/PhotoBlock';
import PhotoCarousel from '../../components/PhotoCarousel/PhotoCarousel';
import ContentLayout from '../../components/ContentLayout/ContentLayout';
import BlockEditMenu from '../../components/BlockEditMenu/BlockEditMenu';


export default function PostEditor({ contentBlocks, setContentBlocks, user,
  activeBlock, setActiveBlock, viewContext, orientation, addBlock }) {

  const supabase = createClient();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const handleClick = (event) => {
      // Get the adminPageWrapper element
      const adminPageWrapper = document.querySelector('.adminPageWrapper');

      // Check if the clicked element is the adminPageWrapper itself
      if (adminPageWrapper && event.target === adminPageWrapper) {
        // Set activeBlock to null if adminPageWrapper is clicked
        setActiveBlock(null);
      }
    };

    // Add event listener on mount
    document.addEventListener('click', handleClick);

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [setActiveBlock]);


  const addPhoto = async (event, nestedIndex) => {
    setLoading(true);
    const files = event.target.files;
    // console.log('FILES: ', files)
    const fileInput = event.target;
    let newPhotosArr = [];

    // Process each file and store promises
    const uploadPromises = Array.from(files).map(file => processFile(file));
    // Wait for all files to be processed
    newPhotosArr = await Promise.all(uploadPromises);

    // Update content once all photos are processed
    updatePhotoContent(activeBlock, newPhotosArr, nestedIndex);
    fileInput.value = ''; // Clear the input after processing all files
    setLoading(false);
  };
  const processFile = (file) => new Promise((resolve, reject) => {
    if (!file) reject("No file provided");
    const reader = new FileReader();
    reader.onload = async (e) => {
      // All processing here, then resolve with new photo object
      const newPhoto = await createAndUploadImage(e.target.result);
      resolve(newPhoto);
    };
    reader.readAsDataURL(file);
  });
  const createAndUploadImage = async (dataURL) => {
    return new Promise((resolve, reject) => {
      // Create an image element
      const img = new Image();
      img.onload = async () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate resizing
        const maxSize = 1500; // Max size for width or height
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        const width = img.width * ratio;
        const height = img.height * ratio;

        canvas.width = width;
        canvas.height = height;

        // Draw the resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
          try {
            const fileName = `${Math.random().toString(36).substring(2)}POSTID.webp`; // Generate a random file name
            // Upload the image blob to your server or storage service
            const { data, error } = await supabase
              .storage
              .from('posts/photos')
              .upload(fileName, blob, {
                contentType: 'image/webp'
              });

            if (error) throw new Error(error.message);

            // Get the URL of the uploaded file
            const { data: publicURL, error: urlError } = supabase
              .storage
              .from('posts/photos')
              .getPublicUrl(fileName);

            if (urlError) throw new Error(urlError.message);

            resolve({src: publicURL.publicUrl, caption: false, title: false, fileName: fileName}); // Resolve the photo object with the new data
          } catch (uploadError) {
            reject(uploadError);
          }
        }, 'image/webp', 0.90); // Adjust the quality of the image
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = dataURL;
    });
  };
  // deletes photo from supabase storage, then calls removeFromPhotoBlock
  const deletePhoto = async (blockIndex, filename, nestedIndex) => {
    // console.log('INSIDE DELETE PHOTO FUNCTION: ', blockIndex, filename, nestedIndex);
    // Attempt to remove the photo from storage
    const { data, error } = await supabase
      .storage
      .from('posts')
      .remove([`photos/${filename}`]);

    // Handle any errors during the deletion
    if (error) {
      console.error('Error deleting photo:', error.message);
      throw error;
    } else {
      console.log('Photo deleted successfully from storage, now updating UI');
      // Successfully deleted, now update the content blocks by removing the photo
      removePhotoFromBlock(blockIndex, filename, nestedIndex);
    }
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
  const removeBlock = (index) => {
    // if the block has images in supabase, delete them
    if (contentBlocks[index].type === 'photo' || contentBlocks[index].type === 'carousel') {

      const photoPromises = contentBlocks[index].content.map(photo => {
        return supabase.storage.from('posts').remove([`photos/${photo.fileName}`]);
      })
      Promise.all(photoPromises).then(() => {
        console.log('All photos deleted');
      }).catch((error) => {
        console.error('Error deleting photos: ', error);
      });
    }
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
  const updateTextEditorState = (index, text, nestedIndex = null) => {
    const newContentBlocks = [...contentBlocks];
    console.log('text: ', text)
    console.log('index: ', index)
    console.log('nestedIndex: ', nestedIndex)

    if (nestedIndex !== null) {
      console.log('running update text block with nested index...')
      newContentBlocks[index] = {
        ...newContentBlocks[index],
        content: newContentBlocks[index].content.map((item, i) =>
          i === nestedIndex
            ? {
              ...item,
              content: text,
            }
            : item
        ),
      };
    } else {
      newContentBlocks[index] = {
        ...newContentBlocks[index],
        content: text,
      };
    }

    setContentBlocks(newContentBlocks);
  };

  // adds new photos to the photo block or carousel block
  const updatePhotoContent = (index, newPhotos, nestedIndex) => {
    setContentBlocks(prevContentBlocks => {
      const updatedContentBlocks = [...prevContentBlocks];

      if (nestedIndex !== undefined) {
        // Handle nested content update
        const contentItem = updatedContentBlocks[index].content[nestedIndex];
        if (contentItem.type === 'carousel') {
          // Append new photos to the existing array
          contentItem.content = [...contentItem.content, ...newPhotos];
        } else {
          // Replace existing content with new photos
          contentItem.content = newPhotos;
        }
        updatedContentBlocks[index].content[nestedIndex] = { ...contentItem };
      } else {
        // Handle non-nested content update
        const contentItem = updatedContentBlocks[index];
        if (contentItem.type === 'carousel') {
          // Append new photos to the existing array
          contentItem.content = [...contentItem.content, ...newPhotos];
        } else {
          // Replace existing content with new photos
          contentItem.content = newPhotos;
        }
        updatedContentBlocks[index] = { ...contentItem };
      }

      return updatedContentBlocks;
    });
  };


  // updates the order of the photos in the carousel block
  const reorderPhotos = (startIndex, endIndex) => {
    // First, we need to operate on the correct block within contentBlocks
    setContentBlocks(prevBlocks => {
      // Create a copy of the current state to avoid direct mutations
      const updatedBlocks = [...prevBlocks];

      // Extract the current photos from the active block
      const currentPhotos = Array.from(updatedBlocks[activeBlock].content);

      // Perform the reordering on the extracted photos
      const [removed] = currentPhotos.splice(startIndex, 1);
      currentPhotos.splice(endIndex, 0, removed);

      // Update the active block's content with the new photo order
      updatedBlocks[activeBlock] = {
        ...updatedBlocks[activeBlock],
        content: currentPhotos
      };

      // Return the newly formed array of content blocks
      return updatedBlocks;
    });
  };
  // removes the specified photo from the photo block
  const removePhotoFromBlock = (blockIndex, filename, nestedIndex) => {
    // Update the contentBlocks state to remove the specified photo
    setContentBlocks(prevContentBlocks => {
      // Copy the array to avoid direct mutation
      const updatedContentBlocks = [...prevContentBlocks];

      if (nestedIndex !== undefined) {
        // Handle case with nestedIndex
        const nestedContent = updatedContentBlocks[blockIndex].content[nestedIndex].content;

        // Filter out the photo with the specified filename
        const filteredPhotos = nestedContent.filter(photo => photo.fileName !== filename);

        // Update the nested content array
        updatedContentBlocks[blockIndex].content[nestedIndex].content = filteredPhotos;
      } else {
        // Handle case without nestedIndex
        const filteredPhotos = updatedContentBlocks[blockIndex].content.filter(photo => photo.fileName !== filename);

        // Update the block's content array
        updatedContentBlocks[blockIndex].content = filteredPhotos;
      }

      // Return the newly formed array which triggers the update
      return updatedContentBlocks;
    });
  };
  // video block helpers
  const updateVideoUrl = (index, url, nestedIndex = null) => {
    const newContentBlocks = [...contentBlocks];
    console.log('url: ', url)
    console.log('index: ', index)
    console.log('nestedIndex: ', nestedIndex)

    if (nestedIndex !== null) {
      console.log('running update URL with nested index...')
      newContentBlocks[index] = {
        ...newContentBlocks[index],
        content: newContentBlocks[index].content.map((item, i) =>
          i === nestedIndex
            ? {
              ...item,
              content: [{ ...item.content[0], url }],
            }
            : item
        ),
      };
    } else {
      newContentBlocks[index] = {
        ...newContentBlocks[index],
        content: [{ ...newContentBlocks[index].content[0], url }],
      };
    }

    setContentBlocks(newContentBlocks);
  };
  const updateVideoOrientation = (index, orientation) => {
    const newContentBlocks = [...contentBlocks];
    newContentBlocks[index] = { ...newContentBlocks[index], orientation: orientation };
    setContentBlocks(newContentBlocks);
  }
  // style should be an object with height, width, top, and left values set to numbers
  const updateBlockStyle = (index, style, nestedIndex = null) => {
    const newContentBlocks = [...contentBlocks];

    if (nestedIndex !== null) {
      // If nestedIndex is provided, update the style at the nested position
      newContentBlocks[index] = {
        ...newContentBlocks[index],
        content: newContentBlocks[index].content.map((contentItem, i) =>
          i === nestedIndex
            ? {
              ...contentItem,
              content: [
                {
                  ...contentItem.content[0],
                  style: style,
                },
                ...contentItem.content.slice(1),
              ],
            }
            : contentItem
        ),
      };
    } else {
      // If no nestedIndex is provided, update the style at the top level
      newContentBlocks[index] = {
        ...newContentBlocks[index],
        content: [
          {
            ...newContentBlocks[index].content[0],
            style: style,
          },
          ...newContentBlocks[index].content.slice(1),
        ],
      };
    }

    setContentBlocks(newContentBlocks);
  };
  const toggleTitleOrCaption = (titleOrCaption, index, nestedIndex) => {
    setContentBlocks(prev => {
      const newContent = [...prev];
      console.log('newContent: ', newContent)
      console.log('index and nested index: ' , index, nestedIndex)
      if (nestedIndex !== undefined && nestedIndex !== null) {
        // Ensure nested structure exists
        if (newContent[index] && newContent[index].content[nestedIndex] && newContent[index].content[nestedIndex].content[0]) {
          const currentValue = newContent[index].content[nestedIndex].content[0][titleOrCaption];
          console.log('currentValue: ', currentValue)
          newContent[index].content[nestedIndex].content[0][titleOrCaption] = (typeof currentValue === 'string') ? false : '';
        }
      } else {
        // Ensure structure exists
        if (newContent[index] && newContent[index].content[0]) {
          const currentValue = newContent[index].content[0][titleOrCaption];
          newContent[index].content[0][titleOrCaption] = (typeof currentValue === 'string') ? false : '';
        }
      }

      return newContent;
    });
  };

  if (!user) { return <h1>Loading...</h1>}

  const post = (
    <div className={`editablePost ${styles.adminPost}`} >

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
                viewContext={viewContext}
              />
              {contentBlocks.length === 1 && <div className={styles.noBlocksMessage}>Add some content from the menu on the right to get started</div>}

            </>
          ) : (

            <div
              key={index}
              // ref={el => blocksRef.current[index] = el}
              // className={`${'blockWrapper'} ${index === activeBlock ? 'outlined' : ''}`}
              className={`${'blockWrapper'} ${activeBlock === null ? '' : 'outlined'}`}

              onClick={(e) => {
                const excludedClasses = ['arrowLeft', 'arrowLeftDisabled', 'arrowRight', 'arrowRightDisabled'];

                // Check if the event target or any of its ancestors has any of the excluded classes
                if (excludedClasses.some(cls => e.target.closest(`.${cls}`))) {
                  return; // Do nothing if the element or its ancestors have any of the excluded classes
                }

                e.stopPropagation();
                if (index !== activeBlock) {
                  setActiveBlock(index);
                }
              }}

            >
              {/* any blocks that aren't of type 'title' will have an edit menu below them */}
              {block.type !== 'title' && index === activeBlock &&
                <BlockEditMenu
                  isEditable={index === activeBlock}
                  setStatus={() => { toggleEditable(index)}}
                  {...(block.type !== 'title' ? { removeBlock: () => removeBlock(index) } : {})}
                  {...(index !== 1 ? { moveBlockUp: () => moveBlockUp(index) } : {})}
                  {...(contentBlocks[index + 1] ? { moveBlockDown: () => moveBlockDown(index) } : {})}
                />}

              {block.type === 'flexibleLayout' && (
                <ContentLayout
                  parentContentBlocks={contentBlocks}
                  block={block}
                  setActiveOuterBlock={setActiveBlock}
                  viewContext={viewContext}
                  orientation='horizontal'
                  setTextState={(text, nestedIndex) => {updateTextEditorState(index, text, nestedIndex)}}
                  user={user}
                  addBlock={addBlock}
                  addPhoto={addPhoto}
                  setContentBlocks={setContentBlocks}
                  parentIndex={index}
                  parentActiveBlock={activeBlock}
                  layoutIsEditable={index === activeBlock}
                  setPhotoStyle={(style, nestedIndex) => updateBlockStyle(index, style, nestedIndex)}
                  deletePhoto={(fileName, nestedIndex) => deletePhoto(index, nestedIndex, fileName)}
                  toggleTitleOrCaption={toggleTitleOrCaption}
                  updateVideoUrl={(url, nestedIndex) => updateVideoUrl(index, url, nestedIndex)}
                />
              )}

              {block.type === 'text' && (
                <PrimeText
                  blockIndex={index}
                  isEditable={index === activeBlock}
                  toggleEditable={toggleEditable}
                  src={block}
                  setActiveBlock={setActiveBlock}
                  setTextState={(text, nestedIndex) => updateTextEditorState(index, text, nestedIndex)}
                  onClick={() => setActiveBlock(index)}
                  updateBlockStyle={(style) => updateBlockStyle(index, style)}
                  removeBlock={() => removeBlock(index)}
                />
              )}
              {block.type === 'photo' &&
                <PhotoBlock
                  key={index}
                  index={index}
                  setContentBlocks={setContentBlocks}
                  addPhoto={addPhoto}
                  deletePhoto={(fileName) => deletePhoto(index, fileName)}
                  blockIndex={index}
                  isEditable={index === activeBlock}
                  photo={block.content?.length ? block.content[0] : null}
                  setActiveBlock={setActiveBlock}
                  removeBlock={() => removeBlock(index)}
                  setPhotoStyle={(style) => updateBlockStyle(index, style)}
                  viewContext={viewContext}
                  toggleTitleOrCaption={toggleTitleOrCaption}
                />
              }
              {block.type === 'carousel' &&
                <PhotoCarousel
                  key={index}
                  addPhoto={addPhoto}
                  deletePhoto={(fileName) => deletePhoto(index, fileName)}
                  blockIndex={index}
                  isEditable={index === activeBlock}
                  photos={block.content}
                  setActiveBlock={setActiveBlock}
                  removeBlock={() => removeBlock(index)}
                  reorderPhotos={reorderPhotos}
                />
              }
              {block.type === 'video' &&
                <>
                  <Video
                    updateVideoUrl={(url, nestedIndex) => updateVideoUrl(index, url, nestedIndex)}
                    updateBlockStyle={(style) => updateBlockStyle(index, style)}
                    setActiveBlock={orientation === 'vertical' ? setActiveBlock : null}
                    isEditable={orientation === 'vertical' ? (index === activeBlock) : true }
                    toggleTitleOrCaption={(type) => {toggleTitleOrCaption(type, index)}}
                    setContentBlocks={setContentBlocks}
                    toggleEditable={toggleEditable}
                    video={block.content?.length ? block.content[0] : null}
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

  return (
    <div className={`adminFeedWrapper`}>
      {post}
    </div>
  )
}
