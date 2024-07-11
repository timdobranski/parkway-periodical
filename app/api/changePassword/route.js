import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';


export async function POST(request) {
  const supabaseAdmin = createClient();
  const { id, password } = await request.json();

  if (!password || !id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    console.log('no password or no id provided')
  }

  try {
    // Update the user's password
    const { data: user, error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, {
      password: password,
    });

    if (authError) {
      console.error('Error updating password:', authError);
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }

    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
