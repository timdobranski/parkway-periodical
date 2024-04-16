import styles from './ContentLayout.module.css'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faImage, faText } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import PhotoBlock from '../PhotoBlock/PhotoBlock';
import PrimeText from '../PrimeText/PrimeText';
import Video from '../Video/Video';
import SelectLayoutContent from '../SelectLayoutContent/SelectLayoutContent';


export default function Layout({ columns, src, isEditable, updateBlockContent }) {
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    // Check if any element in the src array has a truthy content value
    const hasTruthyContent = src.some(element => element.content);

    // Set isEmpty based on the presence of truthy content
    setIsEmpty(!hasTruthyContent);
  }, [src]);

  // src is an array of content blocks
  // should i recursively render a new feed, but inside the flex row container?



  return (
    <div className={`${styles.layoutGrid} ${isEmpty || isEditable ? 'outlined' : ''}`}>
      { src.map((contentBlock, index) => {
        // if no content in the block, render a select component
        if (!contentBlock.content) {
          return (
            <div
              key={index}
              className={`${styles.layoutColumn} ${isEditable ? 'outlined' : '' }`}
            >
              <SelectLayoutContent isEditable={isEditable}/>
            </div>
          )
        }


        return (
          <div
            className={`${styles.layoutColumn}`}
            key={index}
          >
            {contentBlock.content}
            {/* <h1> hi</h1> */}
          </div>
        )
      })}

    </div>
  )
}