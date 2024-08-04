import { mockRouter } from '../__mocks__/mocks.js';
import { render, screen, cleanup } from '@testing-library/react';
import Home from '../app/(public)/home/page.js';


describe('Home', () => {
  it('renders a specific post when provided a postId', () => {
    mockRouter.setCurrentUrl('/home?postId=96');

    const { container } = render(<Home />);

    // Find all elements with the post class name
    const posts = container.getElementsByClassName('post');
    expect(posts.length).toBe(1); // Ensure only one post is rendered

    // Check that the post's content matches the expected text for post 96
    expect(posts[0]).toHaveTextContent('Demo of Photo Carousel & Text Options');
  });
});
