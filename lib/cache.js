import { JSDOM } from 'jsdom';

class Cache {
  constructor(fetchInterval = 300000) { // Default to 5 minutes (5 * 60 * 1000 milliseconds)
    this.data = null;

    // Fetch initial data
    this.updateData();

    // Set up a timer to fetch data periodically
    setInterval(this.updateData.bind(this), fetchInterval);
  }

  async fetchData() {
    const url = 'https://sites.google.com/lmsvsd.net/parkway-periodical?usp=sharing';
    const response = await fetch(url);
    const html = await response.text();

    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Retrieve CSS styles
    const styles = [];
    const linkElements = document.querySelectorAll('head link[rel="stylesheet"]');
    for (const linkElement of linkElements) {
      const href = linkElement.getAttribute('href');
      if (href) {
        const styleResponse = await fetch(href);
        const styleText = await styleResponse.text();
        styles.push(styleText);
      }
    }

    const content = document.querySelector('#yDmH0d > div:nth-child(1) > div > div:nth-child(2) > div.QZ3zWd > div > div.UtePc.RCETm');

    if (!content) {
      throw new Error('Content not found');
    }

    const additionalElement = document.querySelector('#h\\.7c821d5264973ebb_78');

    if (additionalElement) {
      // Append the additional element to the content
      content.appendChild(additionalElement);
    } else {
      console.warn('Additional element not found');
    }

    // Convert HTML element to JSON
    return {
      html: content.outerHTML,
      styles,
    };
  }

  async updateData() {
    try {
      this.data = await this.fetchData();
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }

  async getData() {
    if (!this.data) {
      // If data is not available yet, fetch it
      await this.updateData();
    }
    return this.data;
  }
}

const cache = new Cache();

export default cache;
