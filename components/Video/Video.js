'use client'

import { useState, useEffect } from 'react';
import styles from './video.module.css'

export default function Video({ updateVideoUrl, src, isEditable }) {
  const [url, setUrl] = useState(src || '');

  useEffect(() => {
    if (!isEditable) {
      updateVideoUrl(url);
    }
  }, [isEditable]);

  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

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

  if (isEditable) {
    return (
      <input
        type="text"
        value={url}
        onChange={handleInputChange}
        placeholder="Enter video URL"
        className={styles.videoInput}
      />
    );
  } else {
    const embedUrl = src ? (getYoutubeEmbedUrl(src) || getGoogleDriveEmbedUrl(src)) : null;

    if (embedUrl && embedUrl.includes("youtube.com")) {
      return (
        <div className={styles.youtubeVideoWrapper}>
          <iframe
            src={embedUrl}
            frameBorder="0"
            allowFullScreen
            title="Embedded video"
          />
        </div>
      );
    } else if (embedUrl) {
      return <video src={embedUrl} controls />;
    }

    return <p className={styles.noVideoMessage}>No video URL provided</p>;
  }
}
