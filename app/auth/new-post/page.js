'use client'

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import supabase from '../../../utils/supabase';
import styles from './new-post.module.css';
import {Editor, EditorState} from 'draft-js';
import PostNavbar from '../../../components/PostNavbar/PostNavbar';

export default function NewPostPage () {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty()
  );

  const editor = useRef(null);

  function focusEditor() {
    editor.current.focus();
  }

  // Check if there is a current session
  useEffect(() => {
    const getAndSetUser = async () => {
      const response = await supabase.auth.getSession();
      console.log('data in new post page: ', response.data);
      if (response.data.session.user) {
        setUser(response.data.session.user)
    } else {
      // console.log('no user')
      router.push('/auth');
    }
  }
  getAndSetUser();
  }, []);

  useEffect(() => {
    if (editor.current) {
      focusEditor();
    }
  }, [editorState]);


  if (!user) { return <div>Loading...</div>; }


  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.loginHeader}>New Post</h1>
      <PostNavbar />
      <div onClick={focusEditor}>
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={editorState => setEditorState(editorState)}
      />
    </div>
    </div>
  )
}