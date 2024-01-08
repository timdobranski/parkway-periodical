import axios from 'axios';
import querystring from 'querystring';

export async function GET() {
  const clientId = process.env.WORDPRESS_CLIENT_ID; // Ensure these are correctly set in your .env file
  const clientSecret = process.env.WORDPRESS_CLIENT_SECRET;

  try {
    // Step 1: Fetch access token
    const tokenResponse = await axios.post('https://public-api.wordpress.com/oauth2/token', querystring.stringify({
      client_id: clientId,
      client_secret: clientSecret,
    //   grant_type: 'client_credentials',
      // If specific scopes are needed, add them here. Otherwise, you might omit this line.
      // scope: 'your_required_scopes',
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = tokenResponse.data.access_token;
    console.log('token response: ', tokenResponse)
    // Step 2: Use access token to fetch data from WordPress
    const dataResponse = await axios.get('https://public-api.wordpress.com/rest/v1.1/sites/timdobranski.wordpress.com/shortcodes/render', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Step 3: Return data to the client
    return new Response(JSON.stringify(dataResponse.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    // console.error('Error fetching data:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

