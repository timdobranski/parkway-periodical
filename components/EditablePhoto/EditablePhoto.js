'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faCropSimple, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import styles from './editablePhoto.module.css';

export default function EditablePhoto({ fileObj, handleTitleChange, handleCaptionChange, handleRemovePhoto, index }) {


  return (
    <div>
      <div className={styles.photoWrapper}>
        <div className={styles.photoEditMenu}>
          <div className={styles.photoEditMenuIconWrapper}>
            <FontAwesomeIcon icon={faCropSimple} className={styles.cropIcon} />
            <h3 className={styles.photoEditMenuIconLabel}>Crop</h3>
          </div>

          <div className={styles.photoEditMenuIconWrapper}>
            <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} className={styles.resizeIcon}/>
            <h3 className={styles.photoEditMenuIconLabel}>Resize</h3>
          </div>

          <div className={styles.photoEditMenuIconWrapper} onClick={() => handleRemovePhoto(index)}>
            <FontAwesomeIcon icon={faX} className={styles.removePhotoIcon}  />
            <h3 className={styles.photoEditMenuIconLabel}>Remove</h3>
          </div>
        </div>

        <img src={fileObj.file ? URL.createObjectURL(fileObj.file) : fileObj.src}
              className={styles.photoPreview}
              alt={`Preview ${index}`} />
      </div>
      <input
        value={fileObj.title}
        onChange={(e) => handleTitleChange(index, e.target.value)}
        placeholder="Enter title"
        className={styles.titleInput}
      />
      <textarea
        value={fileObj.caption}
        onChange={(e) => handleCaptionChange(index, e.target.value)}
        placeholder="Enter caption (optional)"
        className={styles.captionInput}
        onKeyDown={(e) => { if (e.key === 'Enter') { setActiveBlock(null) } }}
        rows={4}
      />
    </div>
  )
}