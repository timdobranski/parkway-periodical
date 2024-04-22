import styles from './ContentLayout.module.css'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faImage, faText } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import PhotoBlock from '../PhotoBlock/PhotoBlock';
import PrimeText from '../PrimeText/PrimeText';
import Video from '../Video/Video';
import SelectLayoutContent from '../SelectLayoutContent/SelectLayoutContent';

export default function Layout({ columns, src, isEditable, updateBlockContent, updateBlock, addBlock, parentIndex }) {
  const [isEmpty, setIsEmpty] = useState(true)
  console.log('SRC: ', src)
  useEffect(() => {
    const hasTruthyContent = src.some(element => element.content);
    setIsEmpty(!hasTruthyContent);
  }, [src]);

  return (
    <div className={`${styles.layoutGrid} ${isEmpty || isEditable ? 'outlined' : ''}`}>
      {src.map((contentBlock, index) => (
        contentBlock.type === 'undecided' ? (
          <div key={index} className={`${styles.layoutColumn} ${isEditable ? 'outlined' : ''}`}>
            <SelectLayoutContent
              isEditable={isEditable}
              addBlock={(newBlock) => addBlock(newBlock, parentIndex, index)}
            />
          </div>
        ) : contentBlock.type === 'video' ? (
          <div key={index} className={`${styles.layoutColumn} ${isEditable ? 'outlined' : ''}`}>
            <Video src={contentBlock}
              isEditable={true}
            />
          </div>
        ) : null
      ))}
    </div>
  )
}
