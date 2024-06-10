import { sendErrorEmail } from '../../../utils/sendErrorEmail';

export async function POST(request) {
  try {
    const { error, context } = await request.json();

    if (!error || !context) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
      });
    }

    const errorEmailResult = await sendErrorEmail(error, context);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
    console.log('Error email result:', errorEmailResult)
  } catch (err) {
    console.error('Error in API route:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
