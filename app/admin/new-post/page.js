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
  const debouncedUpdateDraftRef = useRef(debounce(updateDraft, 3000));
  const newPost = [{type: 'title', content: '', style: {width: '0px', height: '0px', x: 0, y: 0}, author: user?.supabase_user}]

  useEffect(() => {
    fetchUser().then(user => {
      if (!user) {
        router.push('/auth');
      } else {
        setUser(user);
        initContent(user);
      }
    });
  }, [router]);

  async function fetchUser() {
    const response = await supabase.auth.getSession();
    if (response.data.session) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', response.data.session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        return null;
      }

      return { ...response.data.session.user, supabase_user: data };
    }
    return null;
  }

  async function initContent(user) {
    if (postId) {
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
        setContentBlocks(JSON.parse(data.content));
      }
    } else {
      const { data: draft, error } = await supabase
        .from('drafts')
        .select('*')
        .eq('author', user.supabase_user.id)
        .single();

      if (draft) {
        setContentBlocks(JSON.parse(draft.content));
      } else {
        const emptyPost = [{ type: 'title', content: '', style: { width: '0px', height: '0px', x: 0, y: 0 } }];
        setContentBlocks(emptyPost);
        updateDraft({ author: user.supabase_user.id, content: emptyPost });
      }
    }
  }

  async function updateDraft(post) {
    try {
      const { data, error } = await supabase
        .from('drafts')
        .upsert([post], { onConflict: 'author' });

      if (error) throw error;
      console.log('Draft saved:', data);
    } catch (error) {
      console.error('Error updating draft:', error);
    }
  }

  useEffect(() => {
    if (contentBlocks.length && user) {
      const post = {
        content: JSON.stringify(contentBlocks),
        'post-type': 'weekly-update', // Example type
        author: user.supabase_user.id
      };
      debouncedUpdateDraftRef.current(post);
    }
  }, [contentBlocks, user]);
  useEffect(() => {
    console.log('CONTENT BLOCKS CHANGED: ', contentBlocks)
  }, [contentBlocks])
  // useEffect(() => {
  //   console.log('ACTIVE MAIN BLOCK CHANGED TO: ', activeBlock)
  // }, [activeBlock])


  // PUBLISH POST---------------------------------------------

  async function publishPost(contentBlocks, postId) {
    console.log('user id: ', user.supabase_user.id)
    const post = {
      content: JSON.stringify(contentBlocks),
      author: JSON.stringify(user.supabase_user.id),
      title: contentBlocks[0].content
    };
    try {
      if (postId) {
        // Update existing post
        const { data, error } = await supabase
          .from('posts')
          .update(post)
          .match({ id: postId}); // Assuming 'id' is the primary key

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
        .match({ author: user.supabase_user.id });

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
  if (!user || !contentBlocks) {
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
        handleSubmit={() => publishPost(contentBlocks, postId)}
        addBlock={addBlock}
      />
    </>
  );
}