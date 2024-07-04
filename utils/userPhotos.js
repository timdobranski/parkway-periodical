import supabase from './supabase';

const userPhotos = {
  getOriginal: async (email) => {
    const { data } = await supabase
      .storage
      .from(users)
      .getPublicUrl(`photos/${email}/original`);

    if (data.publicUrl) {return data.publicUrl}
  },
  getCropped: async(email) => {
    const { data } = await supabase
      .storage
      .from(users)
      .getPublicUrl(`photos/${email}/cropped`);

    if (data.publicUrl) {return data.publicUrl}
  },
  setOriginal: async (email, file) => {
    const { data, error } = await supabase
    .storage
    .from(users)
    .upload(`photos/${email}/original`, file, {upsert: true});

    if (error) {
      console.error(error)
      return error
    }

    return data
  },
  setCropped: async (email, file) => {
    const { data, error } = await supabase
    .storage
    .from(users)
    .upload(`photos/${email}/cropped`, file, {upsert: true});

    if (error) {
      console.error(error)
      return error
    }

    return data
  },
}

export default userPhotos;