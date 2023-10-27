'use client';

import { useEffect, useState } from 'react';
import parse from 'html-react-parser';

export default function Home() {
  const [content, setContent] = useState('');
  const [styles, setStyles] = useState('');

  useEffect(() => {
    fetch('/api/page')
      .then((res) => res.json())
      .then((data) => {
        setContent(data.content.html);
        setStyles(data.content.styles.join('\n'));
        console.log('old blog data: ', data.content);
      })
      .catch((err) => {
        console.error('Error fetching scraped content:', err);
      });
  }, []);

  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.type = 'text/css';
    styleTag.appendChild(document.createTextNode(styles));
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, [styles]);

  return (
    <div className='blogContainer'>
      <div>{parse(content)}</div>
    </div>
  );
}





