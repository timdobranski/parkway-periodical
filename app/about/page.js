'use client';

import { useEffect, useState } from 'react';
import parse from 'html-react-parser';

export default function About() {
  const [content, setContent] = useState('');
  const [styles, setStyles] = useState('');

  useEffect(() => {
    fetch('/api/page')
      .then((res) => res.json())
      .then((data) => {
        let html = data.content.html;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const sections = doc.querySelectorAll('section');
        const sectionsArray = Array.from(sections);

        // Get the 4th and 5th section from the end
        const selectedSections = sectionsArray.slice(-6, -4).concat(sectionsArray.slice(-1));

        // Set the remaining sections as content to be rendered
        const selectedSectionsHtml = selectedSections.map(section => section.outerHTML).join('');
        setContent(selectedSectionsHtml);

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
