import { createClient } from './supabase/client';
const supabase = createClient();
const limit = 2;


const getPosts = {
  // get more posts from the general table with no limits or filters
  all: async (schoolYear, lastId = null) => {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('schoolYear', schoolYear)
      .order('id', { ascending: false })
      .limit(limit); // Adjust the limit as needed

    if (lastId) {
      query = query.lt('id', lastId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return error;
    }
  },
  // get a single post by its id, no school year needed
  byId: async (id) => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(error)
      return error
    }
    return data
  },
  // return an array of posts that match the tag id. these posts should be added to the existing array of posts by tag
  // last id should be the id value at the last index of the existing array of posts by tag
  arrayOfPostIdsByTag: async (schoolYear, tagId, lastId) => {
    let query = supabase
      .from('post_tags')
      .select('post')
      .eq('tag', tagId)
      .limit(limit);

    if (lastId) {
      query = query.lt('id', lastId);
    }
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching post tags:', error);
      return;
    }
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('schoolYear', schoolYear)
      .in('id', data.map((post) => post.post));

    if (postsError) {
      console.error('Error fetching posts:', postsError);
      return;
    }

    return postsData;
  },
  arrayByIdTagInOneQuery: async (schoolYear, tagId, lastId) => {
    console.log('inside arrayByIdTagInOneQuery')
    const { data, error } = await supabase
      .from('posts')
      .select(`
      id,
      title,
      content,
      school_year,
      created_at,
      post_tags!inner (tag)
    `)
      .eq('post_tags.tag', tagId)
      .eq('school_year', schoolYear)
      .lt('id', lastId)
      .order('id', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching posts:', error)
      return null
    }
    console.log('DATA RETURNED FROM GIVEN POST ID: ', data)
    return data
  },
  // return an array of post
  bySearch: async (search) => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .ilike('title', `%${search}%`)

    if (error) {
      console.error(error)
      return error
    }

    return data
  },
}



export default getPosts;
