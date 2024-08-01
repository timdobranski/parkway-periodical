import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function POST(request) {
  const supabaseAdmin = createClient();

  // appends the public site url with the register page path to redirect authenticated users
  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      'http://localhost:3000/';

    console.log('url before refinements: ', url);
    // If the URL contains 'localhost', ensure it starts with 'http://'
    if (url.includes('localhost')) {
      url = url.startsWith('http://') ? url : `http://${url.replace(/^https?:\/\//, '')}`;
    } else {
      // For non-localhost URLs, ensure it starts with 'https://'
      url = url.startsWith('https://') ? url : `https://${url.replace(/^http?:\/\//, '')}`;
    }

    // Make sure to include a trailing `/`
    url = url.endsWith('/') ? url : `${url}/`;
    url += 'register';

    return url;
  };


  async function inviteNewUser(email) {
    const url = getURL();
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: url,
      data: { admin }
    });

    // if there's an error and it's not because the email already exists, return an error message
    if (error && error.code !== 'email_exists') {
      console.error('Error inviting user in inviteNewUser function:', JSON.stringify(error));
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

      // if there's an error and it IS because the email already exists, resend the invite email
    if (error && error.code === 'email_exists') {

      const getUserIdByEmail = async (email) => {
        const { data, error } = await supabaseAdmin
          .from('auth.users')
          .select('id')
          .eq('email', email)
          .single()

        if (error) {
          console.error('Error fetching user ID:', error)
          return null
        }
        console.log('data: ', data)
        return data.id
      }
      const userId = await getUserIdByEmail(email);

      const { data: deleteData, error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (deleteError) {
        console.error('Error deleting user:', deleteError);
        return { error: 'Error deleting user' };
      }
      const { data: retryData, error: retryError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: url,
      });
      if (retryError) {
        console.error('Error resending invite:', retryError);
        return { error: 'Error resending invite' };
      }
      return { data: retryData };

    }
    return data;
  }


  const { email, admin } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const result = await inviteNewUser(email);
    console.log('Invite user: ', result);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 }); // Return the error message if there is one
    }

    return NextResponse.json({ message: 'Invite sent successfully', data: result.data }, { status: 200 });
  } catch (error) {
    console.error('Error inviting userrr:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export function OPTIONS() {
  console.log('hit options');
  return NextResponse.json({ error: `Method Not Allowed` }, { status: 405, headers: { Allow: 'POST' } });
}

