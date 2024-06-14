import { NextResponse } from 'next/server';
import supabaseAdmin from '../../../utils/supabaseAdmin';

export async function POST(request) {
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
    console.log('FINAL REDIRECT URL: ', url);
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: url,
    });

    if (error) {
      console.error('Error inviting user in inviteNewUser function:', error.message);
      return { error: error.message }; // Return the error message
    }

    return data;
  }

  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const result = await inviteNewUser(email);
    console.log('result: ', result);
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

