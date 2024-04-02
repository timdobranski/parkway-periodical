import styles from './postTitle.module.css';

export default function PostTitle({ isEditable, title, updateTitle, index, activeBlock, setActiveBlock }) {

  return (
    <div className={'postTitleWrapper'}>
      {isEditable ? (
        <input
          type="text"
          value={title}
          onChange={(e) => updateTitle(e.target.value)}
          className='postTitle editable'
          placeholder="Enter title"
          onKeyDown={(e) => { if (e.key === 'Enter') { setActiveBlock(null)}}}
        />
      ) : (
        <>
        <h1 className='postTitle' onClick={() => setActiveBlock(index)}>
          {title || 'Enter title'}
        </h1>
        <div className={styles.date}>
          {new Date().toLocaleDateString()} {/* Render the current date */}
        </div>
        </>
      )}
    </div>
  )
}