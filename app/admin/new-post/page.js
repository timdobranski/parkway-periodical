'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../utils/supabase';
import styles from './new-post.module.css';
import PostNavbarLeft from '../../../components/PostNavbarLeft/PostNavbarLeft';
import PostNavbarRight from '../../../components/PostNavbarRight/PostNavbarRight'
import Feed from '../../../components/Feed/Feed';

export default function NewPostPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([{type: 'title', content: '', style: {width: '0px', height: '0px', x: 0, y: 0}, author: user?.supabase_user}]);
  const [activeBlock, setActiveBlock] = useState(null);
  const blocksRef = useRef({});


  // useEffect(() => {
  //   console.log('user: ', user)
  // }, [user])
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
    console.log('ROOT PAGE CONTENT BLOCK ARRAY CHANGED TO: ', contentBlocks)
  }, [contentBlocks])
  useEffect(() => {
    console.log('ACTIVE MAIN BLOCK CHANGED TO: ', activeBlock)
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
  const addBlock = (newBlock, parentIndex = null, nestedIndex = null) => {
    // console.log('INSIDE ADDBLOCK: ', 'newBlock: ', newBlock, 'parentIndex: ', parentIndex, 'nested index: ', nestedIndex);
    if (parentIndex !== null && nestedIndex !== null) {
      const updatedBlocks = contentBlocks.map((block, idx) => {
        if (idx === parentIndex) {
          if (block.type === 'flexibleLayout') {
            const updatedNestedBlocks = block.nestedBlocks.map((nestedBlock, nestedIdx) => {
              if (nestedIdx === nestedIndex) {
                return newBlock; // Explicit replacement, no merging
              }
              return nestedBlock;
            });
            // Explicitly define what gets returned to avoid unintentional key additions
            return { type: block.type, nestedBlocks: updatedNestedBlocks };
          }
        }
        return block;
      });
      setContentBlocks(updatedBlocks);
    } else {
      setContentBlocks([...contentBlocks, newBlock]);
    }
    setActiveBlock(contentBlocks.length);
  };



  // if (!user) {
  //   return <div>Loading...</div>;
  // }
  return (
    <>
      <PostNavbarLeft/>

      <Feed
        viewContext='edit'
        orientation='vertical'
        contentBlocks={contentBlocks}
        setContentBlocks={setContentBlocks}
        activeBlock={activeBlock}
        setActiveBlock={setActiveBlock}
        user={user}
        blocksRef={blocksRef}
        addBlock={addBlock}
      />


      <PostNavbarRight
        // onAddText={addPrimeTextBlock}
        // onAddPhoto={addPhotoBlock}
        // onAddVideo={addVideoBlock}
        // onAddLayout={addFlexibleLayout}
        activeBlock={activeBlock}
        setActiveBlock={setActiveBlock}
        handleSubmit={handleSubmit}
        addBlock={addBlock}
      />
    </>
  );
}