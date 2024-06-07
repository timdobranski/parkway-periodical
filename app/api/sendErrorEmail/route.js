import { NextResponse } from 'next/server';
import { sendErrorEmail } from '../../../utils/sendErrorEmail';

export async function POST(request) {
  console.log('INSIDE SEND ERROR EMAIL')
  const { error, context } = await request.json();

  if (!error || !context) {
    return NextResponse.json({ error: 'Either error or context not provided to API route handler' }, { status: 400 });
  }

  try {
    const result = await sendErrorEmail(error, context);

    if (!result) {
      return NextResponse.json({ error: 'Failed to send email: no response' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent', data: result }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export function OPTIONS() {
  return NextResponse.json({ error: `Method Not Allowed` }, { status: 405, headers: { Allow: 'POST' } });
}
