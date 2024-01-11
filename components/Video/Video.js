'use client'

import { useState } from 'react';
import styles from './video.module.css'

export default function Video({ updateVideoUrl, src }) {
  const [url, setUrl] = useState('');

  const getYoutubeEmbedUrl = (url) => {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const getGoogleDriveEmbedUrl = (url) => {
    const regExp = /^(?:https?:\/\/)?drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/?.*$/;
    const match = url.match(regExp);
    return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : null;
  };

  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateVideoUrl(url);
  };

  let embedUrl = getYoutubeEmbedUrl(src) || getGoogleDriveEmbedUrl(src);

  if (embedUrl) {
    return embedUrl.includes("youtube.com") ? (
      <div className={styles.youtubeVideoWrapper}>
      <iframe
        src={embedUrl}
        frameBorder="0"
        allowFullScreen
        title="Embedded video"
      />
    </div>
    ) : (
      <video src={embedUrl} controls />
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={url}
        onChange={handleInputChange}
        placeholder="Enter video URL"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
