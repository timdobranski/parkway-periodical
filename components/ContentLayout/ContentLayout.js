import styles from './ContentLayout.module.css'
import { useState, useEffect, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faImage, faTex, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import PhotoBlock from '../PhotoBlock/PhotoBlock';
import PrimeText from '../PrimeText/PrimeText';
import Video from '../Video/Video';
import SelectLayoutContent from '../SelectLayoutContent/SelectLayoutContent';
import ContentBlockTitleAndCaption from '../ContentBlockTitleAndCaption/ContentBlockTitleAndCaption';

// block is an object with type, style, and content properties
// type is a string that determines the type of block
// style is an object that determines the style of the overall layout
// content is an array of objects that determine the content of the block

export default function Layout({
  block,
  layoutIsEditable,
  updateBlockContent,
  updateBlock,
  addBlock,
  addPhoto,
  parentIndex,
  setContentBlocks,
  setActiveOuterBlock,
  setPhotoStyle,
  deletePhoto,
  viewContext,
  toggleTitleOrCaption,
  updateVideoUrl,
  setTextState
}) {
  const content = block.content;

  const [isEmpty, setIsEmpty] = useState(true);
  const [activeBlock, setActiveBlock] = useState(null);
  const undecidedBlock = {type: 'undecided', content: [{title: false, caption: false}]}


  // useEffect(() => {
  //   console.log('viewContext: ', viewContext)
  // })

  // useEffect(() => {
  //   console.log('ACTIVE NESTED BLOCK: ', activeBlock)
  // }, [activeBlock])

  useEffect(() => {
    const hasTruthyContent = content.some(element => element.content);
    setIsEmpty(!hasTruthyContent);
  }, [content]);

  // if they layout block is no longer editable, neither are any of its children blocks
  useEffect(() => {
    if (!layoutIsEditable) {
      setActiveBlock(null);
    }
  }, [layoutIsEditable])

  // helpers to update various parts of each block's data structure (content, style, landscape, etc.)
  const updateVideoOrientation = (layoutIndex, orientation) => {
    setContentBlocks(prev => {
      const newContent = [...prev];
      console.log('newContent: ', newContent[parentIndex].content[layoutIndex])
      newContent[parentIndex].content[layoutIndex].orientation = orientation;
      return newContent;
    })
  }

  // used to reset a layout column's content to undecided
  const resetBlock = () => {
    setContentBlocks(prev => {
      const newContent = [...prev];
      newContent[parentIndex].content[activeBlock] = {type: 'undecided', content: [undecidedBlock]};
      return newContent;
    })
  }

  let columnsClass;
  switch (content.length) {
    case 1:
    case 2:
      columnsClass = 'twoColumnGrid';
      break;
    case 3:
      columnsClass = 'threeColumnGrid';
      break;
    default:
      columnsClass = 'fourColumnGrid';
      break;
  }

  if (!content || !content.length) { return null;};

  return (
    <div className={`${styles.layoutWrapper} ${isEmpty || layoutIsEditable ? 'outlined' : ''}`}>
      <div className={`${styles.layoutGrid} ${styles[columnsClass]}`} >
        {content.map((contentBlock, index) => (
          <Fragment key={index}>
            <div
              // style={{justifyContent: ''}}
              // grid item for all grid children, mainContent to signify type and mainContentIndex to signify which block it is
              className={`${styles.gridItem} ${styles.mainContent} ${styles[`mainContent${index}`]}`}
              onClick={viewContext === 'edit' ? (e) => {
                e.stopPropagation();
                if (index !== activeBlock) {setActiveOuterBlock(parentIndex); setActiveBlock(index)}
              } : null}
            >

              {contentBlock.type === 'undecided' && viewContext === 'edit' && (
                <SelectLayoutContent
                  isEditable={layoutIsEditable}
                  addBlock={(newBlock) => addBlock(newBlock, parentIndex, index)}
                  viewContext={viewContext}
                />
              )}
              {contentBlock.type === 'video' && (
                <Video
                  video={contentBlock?.content[0]}
                  isEditable={index === activeBlock}
                  updateVideoOrientation={(orientation) => updateVideoOrientation(index, orientation)}
                  updateVideoUrl={updateVideoUrl ? (url) => updateVideoUrl(url, index) : null}
                  viewContext={viewContext}
                  toggleTitleOrCaption={(titleOrCaption) => toggleTitleOrCaption(titleOrCaption, parentIndex, index)}
                  isLayout={true}
                  setContentBlocks={setContentBlocks}
                  blockIndex={parentIndex}
                  nestedIndex={index}
                />
              )}
              {contentBlock.type === 'text' && (
                <PrimeText
                  src={contentBlock}
                  isEditable={index === activeBlock}
                  setTextState={(text) => {setTextState(text, index)}}
                />
              )}
              {contentBlock.type === 'photo' && (
                <PhotoBlock
                  photo={contentBlock.content[0]}
                  isEditable={index === activeBlock}
                  index={parentIndex}
                  nestedIndex={index}
                  addPhoto={addPhoto}
                  setPhotoStyle={(style) => setPhotoStyle(style, index)}
                  deletePhoto={(fileName) => deletePhoto(index, fileName)}
                  isLayout={true}
                  setContentBlocks={setContentBlocks}
                  toggleTitleOrCaption={toggleTitleOrCaption}
                  viewContext = {viewContext}
                // deletePhoto={(fileName) => deletePhoto(index, fileName)} // how it's passed from postEditor direct to photoBlock
                />
              )}
            </div>

            {/* render a caption and title component no matter what */}
            <div className={`${styles.gridItem} ${styles.captionContent} ${styles[`captionContent${index}`]}`}
              onClick={(e) => {
                e.stopPropagation();
                if (index !== activeBlock) {setActiveOuterBlock(parentIndex); setActiveBlock(index)}
              }}
            >
              <ContentBlockTitleAndCaption
                index={parentIndex}
                nestedIndex={index}
                content={contentBlock.content && contentBlock.content.length > 0 ? contentBlock.content[0] : null}
                isEditable={index === activeBlock}
                setContentBlocks={setContentBlocks}
                updateBlockContent={(newContent) => updateBlockContent(newContent, parentIndex, index)}
                updateBlock={(newBlock) => updateBlock(newBlock, parentIndex, index)}
                removeBlock={() => removeBlock(index)}
                setActiveBlock={setActiveBlock}
                isText={contentBlock.type === 'text'}
              />

              {layoutIsEditable && index === activeBlock && contentBlock.type !== 'undecided' &&
            <div className={styles.layoutColumnEditMenu} onClick={resetBlock}>
              <div className={styles.resetColumnWrapper}>
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className={styles.resetBlockIcon}
                  onClick={resetBlock}
                />
                <p>Reset</p>
              </div>
            </div>
              }
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}


