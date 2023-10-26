import { JSDOM } from 'jsdom';

export default async function scraper(req, res) {
  const url = 'https://sites.google.com/lmsvsd.net/parkway-periodical?usp=sharing';

  const response = await fetch(url);
  const html = await response.text();

  console.log('html: ', html);

  const dom = new JSDOM(html);
  const document = dom.window.document;
  const content = document.querySelector('#yDmH0d > div:nth-child(1) > div > div:nth-child(2) > div.QZ3zWd > div > div.UtePc.RCETm');

  if (!content) {
    return res.status(404).json({ error: 'Content not found' });
  }

  // Convert HTML element to JSON
  const contentJSON = {
    html: content.outerHTML,
    text: content.textContent.trim(),
    // add other properties as needed
  };

  res.status(200).json({ content: contentJSON });
}