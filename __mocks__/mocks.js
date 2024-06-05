import mockRouter from 'next-router-mock';
import { cleanup } from '@testing-library/react';

// Mock next/navigation to use next-router-mock
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockRouter.pathname,
  useSearchParams: () => new URLSearchParams(mockRouter.query),
}));

// Mock console methods before each test
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// Restore console methods and clean up after each test
afterEach(() => {
  jest.restoreAllMocks();
  cleanup(); // Clean up after each test to prevent leaks
  jest.resetAllMocks(); // Reset all mocks after each test
});

export { mockRouter };
