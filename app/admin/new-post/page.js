'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {createClient } from '../../../utils/supabase/client';
import styles from './new-post.module.css';
import PostNavbarLeft from '../../../components/PostNavbarLeft/PostNavbarLeft';
import PostNavbarRight from '../../../components/PostNavbarRight/PostNavbarRight'
import PostEditor from '../../../components/PostEditor/PostEditor';
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
  let postId = searchParams.get('id');
  const [publishingStatus, setPublishingStatus] = useState(false);
  const { isLoading, setIsLoading, saving, setSaving, user, authUser } = useAdmin();
  const debouncedUpdateDraftRef = useRef(debounce(updateDraft, 3000));
  const newPost = [{type: 'title', content: '', style: {width: '0px', height: '0px', x: 0, y: 0}, author: user?.id}];
  const schoolYear = '2024-25';
  const [categoryTags, setCategoryTags] = useState([]);
  const [existingPostOldCategoryTags, setExistingPostOldCategoryTags] = useState([]);
  const [existingPostTitle, setExistingPostTitle] = useState('');
  const postWrapperRef = useRef(null);
  const [prevContentLength, setPrevContentLength] = useState(contentBlocks.length);

  // scroll to the bottom if new content is added to the post
  useEffect(() => {
    if (prevContentLength && contentBlocks.length > prevContentLength) {
      if (postWrapperRef.current) {
        postWrapperRef.current.scrollTop = postWrapperRef.current.scrollHeight;
      }
    }
    setPrevContentLength(contentBlocks.length);
  }, [contentBlocks, prevContentLength]);

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
      console.log('post data from id: ', data)

      return JSON.parse(data.content);

    }
  }
  const getDraft = async () => {
    console.log('inside getDraft')
    const { data: draft, error } = await supabase

      .from('drafts')
      .select('*')
      .eq('author', user.id)
      .single();

    if (error) {
      console.error('Error fetching draft:', error);
    }

    if (draft) {
      console.log('existing draft found: ', draft)
      // setContentBlocks(JSON.parse(draft.content));
      return JSON.parse(draft.content);
    } else {
      console.log('no draft found')
    }
  }
  // get existing post if id provided, or draft if there is one
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // if we're editing an existing post, fetch the post content
      if (postId) {
        console.log('postId found in post editor page: ', postId)
        const postContent = await getPostFromId(postId);
        console.log('postContent: ', postContent)
        if (postContent) {
          setContentBlocks(postContent);
          setExistingPostTitle(postContent[0].content);

          // get the existing post's category tags
          const { data, error } = await supabase
            .from('post_tags')
            .select('tag')
            .eq('post', postId);

          if (error) {
            console.error('Error fetching post tags:', error);
          }
          const tags = data.map(tag => tag.tag);
          setExistingPostOldCategoryTags(tags);
          setCategoryTags(tags);
        }
        // not an existing post, check for a draft
      } else if (user?.id) {
        console.log('no post id but getting user id draft')
        const draftContent = await getDraft(user.id);
        if (draftContent) {
          console.log('draft content found and being set')
          setContentBlocks(draftContent);
        } else {
          console.log('draft content not found, draftContent variable: ', draftContent)
          console.log('no draft content found, setting to new post')
          setContentBlocks(newPost);
        }
      } else {
        console.log('no user id found when searching for draft, setting to new post')
        setContentBlocks(newPost);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [postId, user]);

  async function updateDraft(post) {
    try {
      const { data, error } = await supabase
        .from('drafts')
        .upsert([post], { onConflict: 'author' });

      if (error) throw error;
      // console.log('Draft saved:', data);
      setSaving(false);
    } catch (error) {
      console.error('Error updating draft:', error);
    }
  }
  // TODO: update to also remove associated photos from storage
  async function deleteDraft() {
    try {
      const { error } = await supabase
        .from('drafts')
        .delete()
        .match({ author: user.id });

      if (error) {
        console.error('Error deleting draft:', error);
      } else {
        // console.log('Draft deleted');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }
  // given a contentBlock array, this deletes all photos from supabase storage that the blocks reference
  const deletePhotosFromStorage = async (contentBlocks) => {
    const photosToDelete = [];

    // gather all photos to delete
    contentBlocks.forEach((block, index) => {
      if (block.type === 'photo') {
        block.content.forEach(async (photo) => {
          photosToDelete.push(`photos/${photo.fileName}`)
        })
      }
      if (block.type === 'carousel') {
        block.content.forEach(async (photo) => {
          photosToDelete.push(`photos/${photo.fileName}`)
        })
      }
      if (block.type === 'flexibleLayout') {
        block.content.forEach((nestedBlock) => {
          if (nestedBlock.type === 'photo') {
            nestedBlock.content.forEach(async (photo) => {
              photosToDelete.push(`photos/${photo.fileName}`);
            })
          }
        })
      }
    })
    console.log('photos to be deleted: ', photosToDelete)
    // delete photos from storage
    const { data: photosData, error: photoError } = await supabase
      .storage
      .from('posts')
      .remove(photosToDelete);

    if (photosData) {
      console.log('Photos deleted:', photosData);
    }

    if (photoError) {
      console.error('Error deleting photos:', photoError);
      return;
    }
  }
  // delete post and associated photos. deletes from posts table or drafts table by user id if there is no postId
  async function deletePost() {
    try {

      deletePhotosFromStorage(contentBlocks);
      // first, iterate through contentBlocks and delete all associated photos (type photo, carousel, and flexibleLayout)

      // then, delete the post from posts if id or drafts if no id
      if (postId) {
        const { error } = await supabase
          .from('posts')
          .delete()
          .match({ id: postId });

        if (error) { console.log('error deleting post (after deleting photos): ', error); }
      } else {
        const { error } = await supabase
          .from('drafts')
          .delete()
          .match({ author: user.id });

        if (error) { console.log('error deleting draft (after deleting photos): ', error); }
      }

      // then either redirect to home or show a message that the post was deleted (reset contentBlocks);
      // router.push('/admin/new-post')
      setContentBlocks(newPost);
      let postId = null;

    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }


  // update the draft when content changes (debounced)
  useEffect(() => {
    const isNewPost = (contentBlocks.length === 1 && contentBlocks[0].content === '');
    // update the draft if there are content blocks and a user, and this is not a preexisting post
    if (contentBlocks.length && user && !postId) {
      // if (isNewPost) { deleteDraft() } else {
      const post = {
        content: JSON.stringify(contentBlocks),
        'post-type': 'weekly-update', // Example type
        author: user.id
      };
      setSaving(true);
      debouncedUpdateDraftRef.current(post);
      // }
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
    if (!contentBlocks[0].content) {
      alert(`It looks like this post doesn't have a title. Please add a title before publishing.`);
      return;
    }
    // STEP 1: generate a string of searchable text from the content blocks
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

    // STEP 2: set the post object with the content, author, title, and searchable text
    setPublishingStatus(true);
    const post = {
      content: JSON.stringify(contentBlocks),
      author: JSON.stringify(user.id),
      title: contentBlocks[0].content,
      searchableText: completeSearchableText,
      schoolYear: schoolYear
    };
    // STEP 3: insert or update the post in the posts table
    try {
      let postData;

      if (postId) {
        // Update existing post
        const { data, error } = await supabase
          .from('posts')
          .update(post)
          .match({ id: postId});

        if (error) throw error;

        // iterate through category tags. if any are not in the existing tags, insert them. if any existing tags are not in the new tags, delete them
        const addedTags = categoryTags.filter(tag => !existingPostOldCategoryTags.includes(tag));
        const removedTags = existingPostOldCategoryTags.filter(tag => !categoryTags.includes(tag));

        if (addedTags.length) {
          console.log('added tags: ', addedTags)
          const postNumber = parseInt(postId, 10);
          const postTags = addedTags.map(tag => {
            return {
              post: postNumber,
              tag: tag
            }
          });
          console.log('post tags in insert query: ', postTags)
          const { error: postTagsError } = await supabase
            .from('post_tags')
            .insert(postTags);

          console.log('post tags error: ', postTagsError)

          if (postTagsError) throw postTagsError;
        }
        if (removedTags.length) {
          const { error: postTagsError } = await supabase
            .from('post_tags')
            .delete()
            .eq('post', postId)
            .in('tag', removedTags);

          if (postTagsError) throw postTagsError;
        }


      } else {
        // Insert new post
        const { data, error } = await supabase
          .from('posts')
          .insert([post])
          .select();

        if (error) throw error;
        postData = data;

        // STEP 4: insert into the post_tags table if there are category tags
        if (categoryTags.length) {
          const postTags = categoryTags.map(tag => {
            return {
              post: postId || postData[0].id,
              tag: tag
            }
          });
          const { error: postTagsError } = await supabase
            .from('post_tags')
            .insert(postTags);

          if (postTagsError) throw postTagsError;
        }
      }

      // STEP 5: delete the draft
      if (!postId) {
      const { error: draftError } = await supabase
        .from('drafts')
        .delete()
        .match({ author: user.id });

      if (draftError) throw draftError;
      }
      // STEP 6: redirect to the home page
      setPublishingStatus(false);
      router.push('/home');



    } catch (error) {
      console.error('Error publishing post:', error);
    }
  }
  // adds a new block. if nestedIndex is provided, adds a block to an existing flexible layout block
  const addBlock = (newBlock, parentIndex = null, nestedIndex = null) => {
    // console.log('INSIDE ADDBLOCK: ', 'newBlock: ', newBlock, 'parentIndex: ', parentIndex, 'nested index: ', nestedIndex);
    if (parentIndex !== null && nestedIndex !== null) {
      const updatedBlocks = contentBlocks.map((block, idx) => {
        if (idx === parentIndex) {
          if (block.type === 'flexibleLayout') {
            const updatedNestedBlocks = block.content.map((nestedBlock, nestedIdx) => {
              if (nestedIdx === nestedIndex) {
                return newBlock; // Explicit replacement, no merging
              }
              return nestedBlock;
            });
            // Explicitly define what gets returned to avoid unintentional key additions
            return { type: block.type, content: updatedNestedBlocks };
          }
        }
        return block;
      });
      setContentBlocks(updatedBlocks);
    } else {
      setContentBlocks([...contentBlocks, newBlock]);
    }
    console.log('NESTED INDEX INSIDE ADDBLOCK: ', nestedIndex)
    // only set the new block as active if it's not inside a nested layout
    if (nestedIndex === null) {console.log('setting active block from inside addBlock'); setActiveBlock(contentBlocks.length);}
  };
  const postEditMenu = (
    <div className={styles.postEditMenu}>
      {postId && <p className={styles.editMenuLabel}>{`EDITING EXISTING POST:`}</p>}
      {postId && <p className={styles.editMenuPostTitle}>{`"${existingPostTitle}"`}</p>}

      <button onClick={deletePost}>{`${postId ? 'Delete Post' :'Delete draft and reset Post'}`}</button>


    </div>
  );

  return (
    <div className='adminPageWrapper' ref={postWrapperRef}>
      {postEditMenu}

      <PostNavbarLeft
        categoryTags={categoryTags}
        setCategoryTags={setCategoryTags}
      />
      <PostEditor
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
        updateMode={postId ? true : false}
      />
    </div>
  );
}