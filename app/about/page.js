'use client';

import { useEffect, useState } from 'react';
import parse from 'html-react-parser';

export default function About() {
  const [content, setContent] = useState('');
  const [styles, setStyles] = useState('');
  const [loading, setLoading] = useState(true);

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

        const imgs = doc.querySelectorAll('img');
        if (imgs.length === 0) {
          setLoading(false);
          return;
        }

        let loadedImages = 0;
        imgs.forEach(img => {
          if (img.complete) {
            loadedImages++;
          } else {
            img.addEventListener('load', () => {
              loadedImages++;
              if (loadedImages === imgs.length) {
                setLoading(false);
              }
            });
            // Handle the case where the image fails to load
            img.addEventListener('error', () => {
              loadedImages++;
              if (loadedImages === imgs.length) {
                setLoading(false);
              }
            });
          }
        });

        if (loadedImages === imgs.length) {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching scraped content:', err);
        setLoading(false);
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

  if (loading) {
    return (
      <div className='blogContainer'>
        Loading...
      </div>
    );
  } else {
    return (
      <div className='blogContainer'>
        <div>{parse(content)}</div>
      </div>
    );
  }
}

