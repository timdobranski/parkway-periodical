import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;


// THIS SUPABASE CLIENT USES THE SERVICE ROLE KEY -- IT SHOULD NOT BE USED IN THE FRONTEND
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
// THIS SUPABASE CLIENT USES THE SERVICE ROLE KEY -- IT SHOULD NOT BE USED IN THE FRONTEND


export default supabaseAdmin;