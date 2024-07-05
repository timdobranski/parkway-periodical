import supabase from './supabase';

const userPhotos = {

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
  // should be used for uploading/upserting original, uncropped user photos
  // given an email and photo file, adds it to supabase storage under the given email and filename 'original'
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

    result.success = true;
    return result;
  },

  setPhotoShortcutInTables: async (email, url) => {
    const result = {};

    const { error } = await supabase
      .from('users')
      .update({photo: url})

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