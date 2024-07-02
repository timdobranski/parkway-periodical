import { NextResponse } from 'next/server';
import supabaseAdmin from '../../../utils/supabaseAdmin';

export async function POST(request) {
  console.log('INSIDE COMPLETE SIGNUP');
  const { firstName, lastName, position, password, id, email, includeInStaff, aboutMe, phoneExt } = await request.json();

  if (!firstName || !lastName || !position || !password || !id || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Update the user's password
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, {
      password: password,
    });

    if (authError) {
      console.error('Error updating password:', authError);
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }
    const { data } = await supabaseAdmin
      .storage
      .from('users')
      .getPublicUrl(`/photos/${email}/cropped`)


    // Update the user's details in the users table
    const { error: usersInsertError } = await supabaseAdmin
      .from('users')
      .insert({ first_name: firstName, last_name: lastName, position: position, email: email, auth_id: id, photo: data.publicUrl })


    if (usersInsertError) {
      console.error('Error adding new user to users table:', updateError);
      return NextResponse.json({ error: 'Failed to add user to users table' }, { status: 500 });
    }
    // add staff table entry if includeInStaff is true
    if (includeInStaff) {
      const { error: staffInsertError } = await supabaseAdmin
        .from('staff')
        .insert({
          name: `${firstName} ${lastName}`,
          position: position,
          email: email,
          image: data.publicUrl,
          bio: aboutMe,
          phone: `Ext. ${phoneExt}`
        })
    }

    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
