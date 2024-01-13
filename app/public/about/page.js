// 'use client';

// import { useEffect, useState } from 'react';
// import parse from 'html-react-parser';

// export default function About() {
//   const [content, setContent] = useState('');
//   const [styles, setStyles] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch('/api/page')
//       .then((res) => res.json())
//       .then((data) => {
//         let html = data.content.html;
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(html, 'text/html');
//         const sections = doc.querySelectorAll('section');
//         let sectionsArray = Array.from(sections);

//         // Remove the first and last 5 sections
//         if (sectionsArray.length > 5) {
//           const lastSection = sectionsArray.pop();  // store the last section
//           sectionsArray = sectionsArray.slice(-5, -4).concat(lastSection);  // slice and add the last section back
//           // [sectionsArray[0], sectionsArray[1]] = [sectionsArray[1], sectionsArray[0]];
//         }

//         // Set the remaining sections as content to be rendered
//         const remainingSectionsHtml = sectionsArray.map(section => section.outerHTML).join('');
//         setContent(remainingSectionsHtml);

//         setStyles(data.content.styles.join('\n'));
//         console.log('old blog data: ', data.content);
//       })
//       .catch((err) => {
//         console.error('Error fetching scraped content:', err);
//       });
//   }, []);

//   useEffect(() => {
//     if (styles) {
//       const styleTag = document.createElement('style');
//       styleTag.type = 'text/css';
//       styleTag.appendChild(document.createTextNode(styles));
//       document.head.appendChild(styleTag);

//       setLoading(false);

//       return () => {
//         document.head.removeChild(styleTag);
//       };
//     }
//   }, [styles]);

//   useEffect(() => {
//     if (content && !loading) {
//       // Set the background colors you want to change and the new background color
//       const targetBackgroundColors = ['rgb(252, 229, 205)', 'rgb(217, 210, 233)']; // Colors you want to reset
//       const newBackgroundColor = '#ffc5bf'; // Color you want to set

//       // Get all elements inside the blog container
//       const blogContainer = document.querySelector('.blogContainer');
//       const allElements = blogContainer ? blogContainer.getElementsByTagName('*') : [];

//       // Iterate through all elements and change their background color
//       for (let i = 0; i < allElements.length; i++) {
//         const element = allElements[i];
//         const computedStyle = window.getComputedStyle(element);

//         // Check if the element has one of the target background colors
//         // if (targetBackgroundColors.includes(computedStyle.backgroundColor)) {
//         //   element.style.setProperty('background-color', newBackgroundColor, 'important');
//         // }
//       }
//     }
//   }, [content, loading]);

//   return (
//     <div className='blogContainer'>
//       {loading ? <div className='loadingHeader'>Loading...</div> : <div>{parse(content)}</div>}
//     </div>
//   );
// }