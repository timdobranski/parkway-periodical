'use client'

import React from 'react';
import parse, { domToReact } from 'html-react-parser';
import styles from './Post.module.css';

const Post = ({ postData }) => {
  const transform = (node) => {
    // If the node is an <a> tag, remove it by returning null
    if (node.type === 'tag' && node.name === 'a') {
      return null;
    }

    // If the node is an <img> tag, set its width to 400px and height to auto
    // if (node.type === 'tag' && node.name === 'img') {
    //   return <img {...node.attribs} style={{ width: '500px', height: 'auto' }} alt={node.attribs.alt || ''} />;
    // }
  };

  return (
    <div className={styles.postWrapper}>
      {parse(postData.content.rendered, { replace: transform })}
    </div>
  );
};

export default Post;

