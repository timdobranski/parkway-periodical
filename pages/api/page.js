import { JSDOM } from 'jsdom';
import cache from '../../lib/cache';

export default async function handler(req, res) {
  try {
    const data = await cache.getData();
    res.status(200).json({ content: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


// export default async function handler(req, res) {
//   try {
//     const data = await cache.getData();  // This should return the updated data from the cache
//     res.status(200).json({ content: data });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch data' });
//   }
// }