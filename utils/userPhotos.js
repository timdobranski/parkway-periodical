import { createClient } from './supabase/client';
const supabase = createClient();

const userPhotos = {
  // returns the cropped or original photo as response.value
  getProfilePhoto: async (email, croppedOrOriginal) => {
    const result = {};

    const { data } = await supabase
      .storage
      .from('users')
      .getPublicUrl(`photos/${email}/${croppedOrOriginal}`);

    if (data.publicUrl) {
      const cacheBustedUrl = `${data.publicUrl}?t=${Date.now()}`;
      const response = await fetch(cacheBustedUrl);
      if (response.ok) {
        result.success = true;
        result.value = cacheBustedUrl;
        return result;
      }
      result.success = false;
      result.error = response;
      return result;
    }

    result.success = false;
    result.error = 'The publicUrl request\'s response from supabase did not contain a publicUrl property'
    return result;
  },
  // sets the cropped or original photo in supabase storage, adds the photo url to the users table, then returns the url
  setProfilePhoto: async (email, croppedOrOriginal, file) => {
    const result = {};

    // Step 1: Read the image file
    const fileReader = new FileReader();
    const fileReaderPromise = new Promise((resolve, reject) => {
      fileReader.onload = (e) => resolve(e.target.result);
      fileReader.onerror = (e) => reject(e);
    });

    fileReader.readAsDataURL(file);

    try {
      const imageSrc = await fileReaderPromise;
      const img = new Image();
      img.src = imageSrc;

      const imageLoadPromise = new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
      });

      await imageLoadPromise;

      // Step 2: Create a canvas and draw the resized image
      const maxDimension = 1500;
      let { width, height } = img;

      if (width > height) {
        if (width > maxDimension) {
          height *= maxDimension / width;
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width *= maxDimension / height;
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Step 3: Convert the canvas content to a WebP blob
      const blobPromise = new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/webp');
      });

      const blob = await blobPromise;

      // Step 4: Upload the WebP image blob
      const { data, error } = await supabase
        .storage
        .from('users')
        .upload(`photos/${email}/${croppedOrOriginal}`, blob, { upsert: true });

      if (error) {
        result.success = false;
        result.error = error;
      } else {
        console.log('successfully uploaded new original photo to supabase storage');
        result.success = true;

        const { data: imageUrl } = supabase
          .storage
          .from('users')
          .getPublicUrl(`photos/${email}/${croppedOrOriginal}`);

        result.data = imageUrl;
      }
    } catch (error) {
      result.success = false;
      result.error = error;
    }

    return result;
  },





  setPhotoInUsersTable: async (email, url) => {
    const result = {};

    const { error } = await supabase
      .from('users')
      .update({photo: url})
      .match({ email });

    if (error) {
      result.success = false;
      result.error = error;
      return result;
    }

    result.success = true;
    return result;
  }
}

export default userPhotos;