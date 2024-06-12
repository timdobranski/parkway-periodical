import { NextResponse } from 'next/server';
import supabaseAdmin from '../../../utils/supabaseAdmin';

export async function POST(request) {
  const siteURL = process.env.NEXT_SITE_URL;

  async function inviteNewUser(email) {
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${siteURL}/register`,
    });

    if (error) {
      console.error('Error inviting user:', error);
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

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 }); // Return the error message if there is one
    }

    return NextResponse.json({ message: 'Invite sent successfully', data: result.data }, { status: 200 });
  } catch (error) {
    console.error('Error inviting user:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export function OPTIONS() {
  return NextResponse.json({ error: `Method Not Allowed` }, { status: 405, headers: { Allow: 'POST' } });
}

