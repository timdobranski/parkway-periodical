import { mockRouter } from '../__mocks__/mocks.js';
import { render, screen, cleanup } from '@testing-library/react';
import Home from '../app/home/page.js';
// import mockRouter from 'next-router-mock';

// // Mock next/navigation to use next-router-mock
// jest.mock('next/navigation', () => ({
//   useRouter: () => mockRouter,
//   usePathname: () => mockRouter.pathname,
//   useSearchParams: () => new URLSearchParams(mockRouter.query),
// }));

// // Mock console methods before each test
// beforeEach(() => {
//   jest.spyOn(console, 'log').mockImplementation(() => {});
//   jest.spyOn(console, 'warn').mockImplementation(() => {});
//   jest.spyOn(console, 'error').mockImplementation(() => {});
// });

// // Restore console methods and clean up after each test
// afterEach(() => {
//   jest.restoreAllMocks();
//   cleanup(); // Clean up after each test to prevent leaks
//   jest.resetAllMocks(); // Reset all mocks after each test
// });

describe('Home', () => {
  it('renders a specific post when provided a postId', () => {
    mockRouter.setCurrentUrl('/public/home?postId=96');

    const { container } = render(<Home />);

    // Find all elements with the post class name
    const posts = container.getElementsByClassName('post');
    expect(posts.length).toBe(1); // Ensure only one post is rendered

    // Check that the post's content matches the expected text for post 96
    expect(posts[0]).toHaveTextContent('Demo of Photo Carousel & Text Options');
  });
});
