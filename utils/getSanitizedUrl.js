const getSanitizedUrl = (string) => {
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
  url += string;

  return url;
};

export default getSanitizedUrl;
