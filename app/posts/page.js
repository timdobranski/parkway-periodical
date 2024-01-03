// 'use client';

// import { useEffect, useState } from 'react';
// import parse from 'html-react-parser';

// export default function Posts() {
//   const [content, setContent] = useState('');
//   const [styles, setStyles] = useState('');

//   useEffect(() => {
//     fetch('/api/page')
//       .then((res) => res.json())
//       .then((data) => {
//         let html = data.content.html;
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(html, 'text/html');
//         const sections = doc.querySelectorAll('section');
//         const sectionsArray = Array.from(sections);

//         // Get the second-to-last section
//         const selectedSection = sectionsArray.slice(-3, -2)[0];

//         // Set the content to be rendered
//         setContent(selectedSection.outerHTML);

//         setStyles(data.content.styles.join('\n'));
//         console.log('old blog data: ', data.content);
//       })
//       .catch((err) => {
//         console.error('Error fetching scraped content:', err);
//       });
//   }, []);

//   useEffect(() => {
//     const styleTag = document.createElement('style');
//     styleTag.type = 'text/css';
//     styleTag.appendChild(document.createTextNode(styles));
//     document.head.appendChild(styleTag);

//     return () => {
//       document.head.removeChild(styleTag);
//     };
//   }, [styles]);

//   return (
//     // <div className='sectionContainer'>
//       <div>
//         {parse(content)}
//         </div>
//     // </div>
//   );
// }