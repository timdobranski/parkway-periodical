'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {createClient } from '../../../utils/supabase/client';
import styles from './new-post.module.css';
import PostNavbarLeft from '../../../components/PostNavbarLeft/PostNavbarLeft';
import PostNavbarRight from '../../../components/PostNavbarRight/PostNavbarRight'
import Feed from '../../../components/Feed/Feed';
import { useSearchParams } from 'next/navigation';
import { debounce } from '../../../utils/debounce';
import { useAdmin } from '../../../contexts/AdminContext';


export default function NewPostPage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [activeBlock, setActiveBlock] = useState(null);
  const blocksRef = useRef({});
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const [publishingStatus, setPublishingStatus] = useState(false)
  const { isLoading, setIsLoading, saving, setSaving } = useAdmin();
  const debouncedUpdateDraftRef = useRef(debounce(updateDraft, 3000));
  const newPost = [{type: 'title', content: '', style: {width: '0px', height: '0px', x: 0, y: 0}, author: user?.supabase_user}]



  // fetch user
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
      console.log('post id found: ', postId)
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
        console.log('existing draft found')
        setContentBlocks(JSON.parse(draft.content));
      } else {
        console.log('no draft found')
        const emptyPost = [{ type: 'title', content: '', style: { width: '0px', height: '0px', x: 0, y: 0 } }];
        setContentBlocks(emptyPost);
        // updateDraft({ author: user.supabase_user.id, content: emptyPost });
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
      setSaving(false);
    } catch (error) {
      console.error('Error updating draft:', error);
    }
  }
  async function deleteDraft() {
    try {
      const { error } = await supabase
        .from('drafts')
        .delete()
        .match({ author: user.supabase_user.id });

      if (error) throw error;
      console.log('Draft deleted');
    } catch (error) {
      console.error('Error deleting draft:', error);
    }
  }
  // update the draft when content changes (debounced)
  useEffect(() => {
    const isNewPost = contentBlocks.length === 1 && contentBlocks[0].content === '';
    if (contentBlocks.length && user) {
      if (isNewPost) { deleteDraft() } else {
        const post = {
          content: JSON.stringify(contentBlocks),
          'post-type': 'weekly-update', // Example type
          author: user.supabase_user.id
        };
        setSaving(true);
        debouncedUpdateDraftRef.current(post);
      }
    }
  }, [contentBlocks, user]);
  useEffect(() => {
    console.log('CONTENT BLOCKS CHANGED: ', contentBlocks)
  }, [contentBlocks])

  // PUBLISH POST---------------------------------------------

  async function publishPost(contentBlocks, postId) {
    const searchableText = contentBlocks.map((block) => {
      if (block.type === 'text') {
        return block.content;
      }
      return '';
    });
    console.log('searchableText: ', searchableText)

    setPublishingStatus(true);
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
      setPublishingStatus(false);
      router.push('/public/home');
    } catch (error) {
      console.error('Error publishing post:', error);
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

  if (!user || !contentBlocks) { return null; }

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
        publishingStatus={publishingStatus}
      />
    </>
  );
}