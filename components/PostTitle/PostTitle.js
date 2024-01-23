import styles from './postTitle.module.css';

export default function PostTitle({ isEditable, title, updateTitle, index, activeBlock, setActiveBlock }) {

  return (
    <div className={'postTitleWrapper'}>
    {index === activeBlock ? (
      //  <div className={'postTitleWrapper'} >
       <input
         type="text"
         value={title}
         onChange={(e) => updateTitle(e.target.value)}
         className='postTitle'
         placeholder="Enter title"
         onKeyDown={(e) => { if (e.key === 'Enter') { setActiveBlock(null) } }}
       />
      //  </div>
     ) : (
       <div className={'postTitleWrapper'} onClick={() => setActiveBlock(index)}>
         <div className='postTitle'>
           {title}
         </div>
       </div>
     )}
     <div className={styles.date}>
     {new Date().toLocaleDateString()} {/* Render the current date */}
   </div>
   </div>
  )
}