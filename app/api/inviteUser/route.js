import { NextResponse } from 'next/server';
import supabase from '../../../utils/supabase';
import { inviteNewUser } from '../../../utils/inviteNewUser';

export async function POST(request) {
  console.log('INSIDE POST FUNCTION')
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const result = await inviteNewUser(email);

    if (!result) {
      return NextResponse.json({ error: 'Failed to invite user' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Invite sent successfully', data: result }, { status: 200 });
  } catch (error) {
    console.error('Error inviting user:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export function OPTIONS() {
  return NextResponse.json({ error: `Method Not Allowed` }, { status: 405, headers: { Allow: 'POST' } });
}
