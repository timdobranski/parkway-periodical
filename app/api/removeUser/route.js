import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function POST(request) {
  console.log('INSIDE REMOVE USER')
  const supabaseAdmin = createClient();
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Auth ID is required' }, { status: 400 });
  }

  try {
    // step 1: get the user's auth id
    const { data: userIdFetch, error: userIdError } = await supabaseAdmin
      .from('users')
      .select('auth_id')
      .eq('email', email)
      .single();

      if (userIdError) {
        console.log(`Error getting the user's auth ID for deletion: ${JSON.stringify(userIdError)}`)
        return NextResponse.json({ error: `Error getting the user's auth ID for deletion` }, { status: 500 });
      }
      console.log('Step 1 success: Retrieved user auth ID: ', userIdFetch)

      // step 2, set the user's active status to false
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({active: false})
        .eq('auth_id', userIdFetch.auth_id)

      if (error) {
        console.log(`Error setting the user's active status to false in users table: ${JSON.stringify(error)}`)
        return NextResponse.json({ error: `Error setting the user's active status to false in users table` }, { status: 500 });
      }
      console.log('Step 2 success: Set the user\'s active status to false in users table.')
      // step 3, if the user's email address is in the email column of the staff table, set the active status to false
      const { data: staffTableData, error: staffTableError, count } = await supabaseAdmin
      .from('staff')
      .update({ active: false })
      .eq('email', email)
      .select('id', { count: 'exact' }); // Using 'select' to get the count of affected rows

    if (staffTableError) {
      console.log(`Step 3 Error: setting the user's active status to false in staff table: ${JSON.stringify(staffTableError)}`);
      return NextResponse.json({ error: `Error setting the user's active status to false in users table` }, { status: 500 });
    }

    if (staffTableData.length === 0) {
      console.log('Step 3 success: User is not in the staff table.');
    } else if (staffTableData.length > 0) {
      console.log(`Step 3 success: User found in staff table and active status set to false`);
    }


      // finally, soft delete user in supabase auth
      const { data: result, error: deleteError } = await supabaseAdmin
        .auth.admin.deleteUser(userIdFetch.auth_id)

      if (deleteError) {
        console.log(`Step 4 Error: Delete user in supabase auth table: ${JSON.stringify(deleteError)}`)
        return NextResponse.json({ error: `Error in step 3: soft-delete in supabase auth table: ${JSON.stringify(deleteError)}` }, { status: 500 });
      }
      console.log('Step 4 success: User deleted in supabase auth table.')

    return NextResponse.json({ message: 'User deleted', data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
