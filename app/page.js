'use client';

import { useEffect, useState } from 'react';
import parse from 'html-react-parser';


export default function Home() {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/api/page')
      .then((res) => res.json())
      .then((data) => {
        setContent(data.content.html);
      })
      .catch((err) => {
        console.error('Error fetching scraped content:', err);
      });
  }, []);

  return (
    <div>
      <h1>Scraped Content</h1>
      <div>{parse(content)}</div>
    </div>
  );
}





