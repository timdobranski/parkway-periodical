import { NextResponse } from 'next/server';
import supabaseAdmin from '../../../utils/supabaseAdmin';

export async function POST(request) {
  console.log('INSIDE REMOVE USER')
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Auth ID is required' }, { status: 400 });
  }

  try {
    // first get the user's auth id
    const { data: userIdFetch, error: userIdError } = await supabaseAdmin
      .from('users')
      .select('auth_id')
      .eq('email', email)
      .single();

      console.log('userIdFetch: ', userIdFetch)
      if (userIdError) {
        console.log(`Error getting the user's auth ID for deletion: ${JSON.stringify(userIdError)}`)
        return NextResponse.json({ error: `Error getting the user's auth ID for deletion` }, { status: 500 });
      }
      // next, set the user's active status to false
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({active: false})
        .eq('auth_id', userIdFetch.auth_id)

      if (error) {
        console.log(`Error setting the user's active status to false in users table: ${JSON.stringify(error)}`)
        return NextResponse.json({ error: `Error setting the user's active status to false in users table` }, { status: 500 });
      }
      // finally, soft delete user in supabase auth
      const { data: result, error: deleteError } = await supabaseAdmin
        .auth.admin.deleteUser(userIdFetch.auth_id, true)

      if (deleteError) {
        console.log(`Error in step 3: soft-delete in supabase auth table: ${JSON.stringify(deleteError)}`)
        return NextResponse.json({ error: `Error in step 3: soft-delete in supabase auth table: ${JSON.stringify(deleteError)}` }, { status: 500 });
      }


    return NextResponse.json({ message: 'User deleted', data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
