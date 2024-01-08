import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('supabaseUrl in supabase file: ', supabaseUrl);
// console.log('supabaseAnonKey: ', supabaseAnonKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase;
