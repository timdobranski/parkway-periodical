import supabase from './supabase';

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

    const { data, error } = await supabase
      .storage
      .from('users')
      .upload(`photos/${email}/${croppedOrOriginal}`, file, {upsert: true});

    if (error) {
      result.success = false;
      result.error = error;
      return result;
    }
    const { success: gotUrl, error: errorGettingUrl, value: url } = await userPhotos.getProfilePhoto(email, croppedOrOriginal);

    if (errorGettingUrl) {
      console.log('successfully uploaded photo, but error returning its url: ', errorGettingUrl)
      result.success = false;
      return result
    }
    result.value = url

    const { error: tableEntryError } = await userPhotos.setPhotoInUsersTable(email, url)
    if (tableEntryError) {
      console.log('successfully uploaded photo, but error adding url to users table: ', tableEntryError)
      result.success = false;
      return result
    }

    result.success = true;
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