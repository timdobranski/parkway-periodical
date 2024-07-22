import styles from './ContentLayout.module.css'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faImage, faText } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import PhotoBlock from '../PhotoBlock/PhotoBlock';
import PrimeText from '../PrimeText/PrimeText';
import Video from '../Video/Video';
import SelectLayoutContent from '../SelectLayoutContent/SelectLayoutContent';

// block is an object with type, style, and content properties
  // type is a string that determines the type of block
  // style is an object that determines the style of the overall layout
  // content is an array of objects that determine the content of the block

export default function Layout({ block, isEditable, updateBlockContent, updateBlock, addBlock, parentIndex, setContentBlocks }) {
  const content = block.content;

  const [isEmpty, setIsEmpty] = useState(true);
  const [activeBlock, setActiveBlock] = useState(null);

  console.log('Layout Content: ', content)

  useEffect(() => {
    const hasTruthyContent = content.some(element => element.content);
    setIsEmpty(!hasTruthyContent);
  }, [content]);

  const updateVideoOrientation = (layoutIndex, orientation) => {
    setContentBlocks(prev => {
      const newContent = [...prev];
      console.log('newContent: ', newContent[parentIndex].content[layoutIndex])
      newContent[parentIndex].content[layoutIndex].orientation = orientation;
      return newContent;
    })
  }
  const updateVideoUrl = (layoutIndex, url) => {
    setContentBlocks(prev => {
      const newContent = [...prev];
      console.log('newContent: ', newContent[parentIndex].content[layoutIndex])
      newContent[parentIndex].content[layoutIndex].content = url;
      return newContent;
    })
  }

  return (
    <div className={`${styles.layoutGrid} ${isEmpty || isEditable ? 'outlined' : ''}`} >

      {content.map((contentBlock, index) => (
        <div
          key={index}
          className={`${styles.layoutColumn} ${isEditable ? 'outlined' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (index !== activeBlock) {setActiveBlock(index)}
          }}
        >

          {contentBlock.type === 'undecided' && (
            <SelectLayoutContent
              isEditable={isEditable}
              addBlock={(newBlock) => addBlock(newBlock, parentIndex, index)}
            />
          )}
          {contentBlock.type === 'video' && (
            <Video
              src={contentBlock}
              isEditable={index === activeBlock}
              updateVideoOrientation={(orientation) => updateVideoOrientation(index, orientation)}
              updateVideoUrl={(url) => updateVideoUrl(index, url)}
            />
          )}
            {contentBlock.type === 'text' && (
            <PrimeText
              src={contentBlock}
              isEditable={index === activeBlock}
              setTextState={(url) => updateVideoUrl(index, url)}
            />
          )}
        </div>
      ))}
    </div>
  );

}
