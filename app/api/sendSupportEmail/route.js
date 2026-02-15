import { sendSupportEmail } from '../../../utils/sendSupportEmail';

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      deviceUsed,
      browserUsed,
      issueDescription,
      userAgent,
      url,
      page,
    } = body || {};

    if (!name || !email || !deviceUsed || !browserUsed || !issueDescription) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
      });
    }

    await sendSupportEmail({
      name,
      email,
      deviceUsed,
      browserUsed,
      issueDescription,
      userAgent,
      url,
      page,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Error in sendSupportEmail API route:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
