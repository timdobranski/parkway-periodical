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
        let html = data.content.html;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const sections = doc.querySelectorAll('section');
        const sectionsArray = Array.from(sections);

        // Remove the first and last 5 sections
        if (sectionsArray.length > 5) {
          sectionsArray.shift();
          sectionsArray.splice(-6);
        }

        // Set the remaining sections as content to be rendered
        const remainingSectionsHtml = sectionsArray.map(section => section.outerHTML).join('');
        setContent(remainingSectionsHtml);

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

  useEffect(() => {
    // Set the background colors you want to change and the new background color
    const targetBackgroundColors = ['rgb(252, 229, 205)', 'rgb(217, 210, 233)']; // Colors you want to reset
    const newBackgroundColor = '#ffc5bf'; // Color you want to set

    // Get all elements inside the blog container
    const blogContainer = document.querySelector('.blogContainer');
    const allElements = blogContainer ? blogContainer.getElementsByTagName('*') : [];

    // Iterate through all elements and change their background color
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      const computedStyle = window.getComputedStyle(element);

      // Check if the element has one of the target background colors
      // if (targetBackgroundColors.includes(computedStyle.backgroundColor)) {
      //   element.style.setProperty('background-color', newBackgroundColor, 'important');
      // }
    }
  }, [content]);

  return (
    <div className='blogContainer'>
      <div>{parse(content)}</div>
    </div>
  );
}