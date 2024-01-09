import styles from './PostNavbar.module.css';

export default function PostNavbar() {

  return (
    <div className={styles.navbarWrapper}>
      <h3>Add A Header</h3>
      <h3>Add Text</h3>
      <h3>Add A Photo</h3>
      <h3>Add Gallery</h3>
      <h3>Add a Video</h3>
    </div>
  )
}