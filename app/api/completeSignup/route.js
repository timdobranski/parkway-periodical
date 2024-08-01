import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function POST(request) {
  const supabaseAdmin = createClient();
  console.log('INSIDE COMPLETE SIGNUP');
  const { firstName, lastName, position, password, id, email, includeInStaff, aboutMe, phoneExt, isAdmin } = await request.json();

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
    const { data: photoData } = await supabaseAdmin
      .storage
      .from('users')
      .getPublicUrl(`/photos/${email}/cropped`)



    // check if user already exists in users table and is just inactive
    const { data: existingUserData, error: existingUserError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUserError && existingUserError.code !== 'PGRST116') {
      console.error('Error fetching existing user data:', existingUserError);
      return NextResponse.json({ error: 'Failed to fetch existing user data' }, { status: 500 });
    }

    const updatePayload = { first_name: firstName, last_name: lastName, position: position, email: email, auth_id: id, photo: photoData.publicUrl, active: true, admin: isAdmin };
    if (existingUserData) {
    // Only update fields if they are different
      if (existingUserData.first_name !== firstName) updatePayload.first_name = firstName;
      if (existingUserData.last_name !== lastName) updatePayload.last_name = lastName;
      if (existingUserData.position !== position) updatePayload.position = position;
      if (existingUserData.email !== email) updatePayload.email = email;
      if (existingUserData.auth_id !== id) updatePayload.auth_id = id;
      if (existingUserData.photo !== photoData.publicUrl) updatePayload.photo = photoData.publicUrl;

      // Update the user's details in the users table
      const { error: usersUpdateError } = await supabaseAdmin
        .from('users')
        .update(updatePayload)
        .eq('email', email);

      if (usersUpdateError) {
        console.error('Error updating user in users table:', usersUpdateError);
        return NextResponse.json({ error: 'Failed to update user in users table' }, { status: 500 });
      }
    } else {
    // Insert new user
      const { error: usersInsertError } = await supabaseAdmin
        .from('users')
        .insert(updatePayload);

      if (usersInsertError) {
        console.error('Error adding new user to users table:', usersInsertError);
        return NextResponse.json({ error: 'Failed to add user to users table' }, { status: 500 });
      }
    }
    // add staff table entry if includeInStaff is true
    if (includeInStaff) {
      const { error: staffInsertError } = await supabaseAdmin
        .from('staff')
        .insert({
          name: `${firstName} ${lastName}`,
          position: position,
          email: email,
          image: photoData.publicUrl,
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
