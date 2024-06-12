import { NextResponse } from 'next/server';
import supabaseAdmin from '../../../utils/supabaseAdmin';

export async function POST(request) {
  console.log('INSIDE COMPLETE SIGNUP');
  const { email, firstName, lastName, position, password } = await request.json();

  if (!email || !firstName || !lastName || !position || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Update the user's password
    const { error: authError } = await supabaseAdmin.auth.api.updateUserById(email, {
      password,
    });

    if (authError) {
      console.error('Error updating password:', authError);
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }

    // Update the user's details in the users table
    const { data, error: updateError } = await supabaseAdmin
      .from('users')
      .update({ first_name: firstName, last_name: lastName, position })
      .eq('email', email);

    if (updateError) {
      console.error('Error updating user details:', updateError);
      return NextResponse.json({ error: 'Failed to update user details' }, { status: 500 });
    }

    return NextResponse.json({ message: 'User updated successfully', data }, { status: 200 });
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
