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
  const [contentBlocks, setContentBlocks] = useState([]);
  const [activeBlock, setActiveBlock] = useState(null);
  const blocksRef = useRef({});
  const searchParams = useSearchParams();
  const postId = searchParams.get('postId');
  const [publishingStatus, setPublishingStatus] = useState(false);
  const { isLoading, setIsLoading, saving, setSaving, user, authUser } = useAdmin();
  const debouncedUpdateDraftRef = useRef(debounce(updateDraft, 3000));
  const newPost = [{type: 'title', content: '', style: {width: '0px', height: '0px', x: 0, y: 0}, author: user?.supabase_user}]
  const schoolYear = '2024-25';

  const getPostFromId = async () => {
    if (postId) {
      console.log('post id found: ', postId)
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) {
        console.error('Error fetching post from post Id in url:', error);
        return;
      }

      if (data) {
        setContentBlocks(JSON.parse(data.content));
      }
    }
  }
  const getDraft = async () => {
    const { data: draft, error } = await supabase

      .from('drafts')
      .select('*')
      .eq('author', user.id)
      .single();

    if (draft) {
      console.log('existing draft found')
      setContentBlocks(JSON.parse(draft.content));
    } else {
      console.log('no draft found')
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      if (postId) {
        const postContent = await getPostFromId(postId);
        if (postContent) {
          setContentBlocks(postContent);
        }
      } else if (user?.id) {
        const draftContent = await getDraft(user.id);
        if (draftContent) {
          setContentBlocks(draftContent);
        } else {
          setContentBlocks(newPost);
        }
      } else {
        setContentBlocks(newPost);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [postId, user]);



  useEffect(() => {
    console.log('post id: ', postId)
  }, [postId])


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
        .match({ author: user.id });

      if (error) {
        console.error('Error deleting draft:', error);
      } else {
        console.log('Draft deleted');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }
  // update the draft when content changes (debounced)
  useEffect(() => {
    const isNewPost = (contentBlocks.length === 1 && contentBlocks[0].content === '');
    if (contentBlocks.length && user) {
      if (isNewPost) { deleteDraft() } else {
        const post = {
          content: JSON.stringify(contentBlocks),
          'post-type': 'weekly-update', // Example type
          author: user.id
        };
        setSaving(true);
        debouncedUpdateDraftRef.current(post);
      }
    }
  }, [contentBlocks, user]);
  useEffect(() => {
    console.log('CONTENT BLOCKS CHANGED: ', contentBlocks)
  }, [contentBlocks])
  // to remove html from text blocks to facilitate searchable text
  const stripHTML = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  // PUBLISH POST---------------------------------------------

  async function publishPost(contentBlocks, postId) {
    const searchableText = contentBlocks.map((block) => {
      if (block.type === 'title') {
        // Return the text content directly for title blocks
        return block.content;
      }

      if (block.type === 'text') {
        // Strip HTML tags for text blocks
        return stripHTML(block.content);
      }

      if (block.type === 'photo') {
        // Iterate through the array and concatenate the text content from caption and title properties
        return block.content.map(item => `${item.caption} ${item.title}`).join(' ');
      }

      // Return an empty string for unhandled block types
      return '';
    });
    const completeSearchableText = searchableText.join(' ');

    console.log('searchableText: ', completeSearchableText)

    setPublishingStatus(true);
    const post = {
      content: JSON.stringify(contentBlocks),
      author: JSON.stringify(user.id),
      title: contentBlocks[0].content,
      searchableText: completeSearchableText,
      schoolYear: schoolYear
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
        .match({ author: user.id });

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