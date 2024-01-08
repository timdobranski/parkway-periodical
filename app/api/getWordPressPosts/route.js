
export async function GET() {
  try {
    const response = await fetch('https://public-api.wordpress.com/wp/v2/sites/timdobranski.wordpress.com/posts');
    // const themeResponse = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/timdobranski.wordpress.com/themes/current');
    const data = await response.json();
    console.log('response: ', data);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  }
  catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

}