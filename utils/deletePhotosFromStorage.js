import { createClient } from './supabase/client';

export default async function deletePhotosFromStorage(contentBlocks) {
  const supabase = createClient();
  const photosToDelete = [];

  // gather all photos to delete
  contentBlocks.forEach((block, index) => {
    if (block.type === 'photo') {
      block.content.forEach(async (photo) => {
        photosToDelete.push(`photos/${photo.fileName}`)
      })
    }
    if (block.type === 'carousel') {
      block.content.forEach(async (photo) => {
        photosToDelete.push(`photos/${photo.fileName}`)
      })
    }
    if (block.type === 'flexibleLayout') {
      block.content.forEach((nestedBlock) => {
        if (nestedBlock.type === 'photo') {
          nestedBlock.content.forEach(async (photo) => {
            photosToDelete.push(`photos/${photo.fileName}`);
          })
        }
      })
    }
  })
  if (!photosToDelete.length) {
    console.log('no photos to delete');
    return;
  }
  console.log('photos to be deleted: ', photosToDelete)
  // delete photos from storage
  const { data: photosData, error: photoError } = await supabase
    .storage
    .from('posts')
    .remove(photosToDelete);

  if (photosData) {
    console.log('Photos deleted:', photosData);
  }

  if (photoError) {
    console.error('Error deleting photos:', photoError);
    return;
  }
}