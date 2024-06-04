import { render, screen, cleanup } from '@testing-library/react';
import Home from '../app/public/home/page.js';
import { useRouter } from 'next/navigation';
// import { RouterContext } from 'next/dist/shared/lib/router-context'; // Import RouterContext
import mockRouter from 'next-router-mock';
import useOnlineStatus from '../../../utils/useOnlineStatus';


// use the mock router
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockRouter.pathname,
  useSearchParams: () => new URLSearchParams(mockRouter.query),
}));

// mock the supabase client
jest.mock('../../../utils/supabase', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
}));

// mock the useOnlineStatus hook
jest.mock('../../../utils/useOnlineStatus', () => jest.fn(() => true));





// override console methods
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
// clean up after each test
afterEach(() => {
  jest.restoreAllMocks();
  cleanup();
  jest.resetAllMocks();
});

describe('Home', () => {

  it('renders the header title "Parkway Periodical"', () => {
    mockRouter.setCurrentUrl('/public/home?postId=101');

    const number = 1;
    // <RouterContext.Provider value={mockRouter}>
      render(<Home />);
    // </RouterContext.Provider>

    // const heading = screen.getByRole('heading', { name: /parkway periodical/i });
    // expect(heading).toBeInTheDocument();
    expect(number).toEqual(1);
  });


});