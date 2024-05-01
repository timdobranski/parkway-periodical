'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../../utils/supabase';
import styles from './new-post.module.css';
import PostNavbarLeft from '../../../components/PostNavbarLeft/PostNavbarLeft';
import PostNavbarRight from '../../../components/PostNavbarRight/PostNavbarRight'
import Feed from '../../../components/Feed/Feed';
import { useSearchParams } from 'next/navigation';
import { debounce } from '../../../utils/debounce';  // Adjust the path as necessary


export default function NewPostPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [activeBlock, setActiveBlock] = useState(null);
  const blocksRef = useRef({});
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const [saving, setSaving] = useState(false);

  // if a post id is provided, fetch the post data
  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (error) {
          console.error('Error fetching post data:', error);
          return;
        }

        if (data) {
          const parsedData = JSON.parse(data.content);
          setContentBlocks(parsedData);
        }
      };
      fetchPost();
    } else {
      setContentBlocks([{type: 'title', content: '', style: {width: '0px', height: '0px', x: 0, y: 0}, author: user?.supabase_user}]);
    }
  }, [postId])

  // debounce helper for submitting/saving posts

  // UPDATE DRAFT---------------------------------------------
  async function updateDraft(post, isNew = false) {
    try {
      let result;
      if (isNew) {
        // If it's a new draft, insert it
        result = await supabase
          .from('drafts')
          .insert([post]);
      } else {
        // If it's an existing draft, upsert it (update or insert)
        result = await supabase
          .from('drafts')
          .upsert([post], { onConflict: 'id' });
      }

      const { data, error } = result;
      if (error) throw error;
      console.log('Draft saved:', data);
    } catch (error) {
      console.error('Error updating draft:', error);
    }
  }
  const debouncedUpdateDraft = useCallback(debounce(updateDraft, 3000), []);

  useEffect(() => {
    if (contentBlocks && user) {
      const post = {
        // Assuming you manage a state or prop for postID and type

        content: JSON.stringify(contentBlocks),
        'post-type': 'weekly-update',  // Example type
        author: user.supabase_user.id
      };
      const postID = !postId;
      debouncedUpdateDraft(post, !postID);  // isNew based on if postID is undefined
    }
  }, [contentBlocks, user, debouncedUpdateDraft]);

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
    // Cleanup function to reset when component unmounts
    return () => {
      setContentBlocks([{type: 'title', content: '', style: {width: '0px', height: '0px', x: 0, y: 0}, author: user?.supabase_user}]);
    };
  }, []);

  useEffect(() => {
    console.log('ROOT PAGE CONTENT BLOCK ARRAY CHANGED TO: ', contentBlocks)
  }, [contentBlocks])
  // useEffect(() => {
  //   console.log('ACTIVE MAIN BLOCK CHANGED TO: ', activeBlock)
  // }, [activeBlock])


    // PUBLISH POST---------------------------------------------

  async function publishPost(post, isUpdate = false) {
    try {
      if (isUpdate) {
        // Update existing post
        const { data, error } = await supabase
          .from('posts')
          .update(post)
          .match({ id: post.id }); // Assuming 'id' is the primary key

        if (error) throw error;
        console.log('Post updated:', data);
      } else {
        // Insert new post
        const { data, error } = await supabase
          .from('posts')
          .insert([post]);

        if (error) throw error;
        console.log('Post published:', data);
      }

      // Optionally, delete the draft
      const { error: draftError } = await supabase
        .from('drafts')
        .delete()
        .match({ id: post.id });

      if (draftError) throw draftError;

      router.push('/public/home');
    } catch (error) {
      console.error('Error publishing post:', error);
    }
  }

  // HANDLE SUBMIT---------------------------------------------
  // async function handleSubmit(type) {
  //   setSaving(true);
  //   // console.log('inside handle submit');
  //   try {
  //     const post = {
  //       content: JSON.stringify(contentBlocks),
  //       'post-type': type || 'weekly-update',
  //       author: JSON.stringify(user.supabase_user.id)
  //     };

  //     const { error } = await supabase
  //       .from('posts')
  //       .insert([post]);

  //     setSaving(false);
  //     if (error) throw new Error('Error submitting content blocks: ', error.message);

  //     router.push('/public/home');
  //   } catch (error) {
  //     console.error('Error in handleSubmit: ', error);
  //   }
  // }

  async function handleSubmit(type, isPublish = false) {
    setSaving(true);
    const post = {
      id: postID, // Make sure to handle the ID correctly for updates
      content: JSON.stringify(contentBlocks),
      'post-type': type || 'weekly-update',
      author: JSON.stringify(user.supabase_user.id)
    };

    try {
      if (isPublish) {
        await publishPost(post, !!postID);
      } else {
        debouncedUpdateDraft(post, !postID);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setSaving(false);
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
  if (!user) {
    return null;
  }
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
        activeBlock={activeBlock}
        setActiveBlock={setActiveBlock}
        handleSubmit={handleSubmit}
        addBlock={addBlock}
      />
    </>
  );
}