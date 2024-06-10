import { NextResponse } from 'next/server';
import supabase from '../../../utils/supabase';

export async function POST(request) {
  console.log('INSIDE REMOVE USER')
  const { authId } = await request.json();

  if (!authId) {
    return NextResponse.json({ error: 'Auth ID is required' }, { status: 400 });
  }

  try {
    const { data, error } = await deleteUser(authId);

    if (error) {
      return NextResponse.json({ error: 'User unable to be deleted at this time' }, { status: 500 });
    }

    return NextResponse.json({ message: 'User deleted', data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
