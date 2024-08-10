import React, { useRef } from 'react';
import { render, screen, act, fireEvent, waitFor, prettyDOM } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { setupDatabaseWithPostId5 } from '../utils/testing/supabase';

import NewPostPage from '../app/admin/new-post/page.js';

// Mock the next/navigation useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));


// Mock the debounce function
jest.mock('../utils/debounce', () => ({
  debounce: (fn) => fn,
}));

jest.mock('../contexts/AdminContext', () => ({
  useAdmin: jest.fn(),
}));

describe('NewPostPage', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    // Mock the useRouter return value
    useRouter.mockReturnValue(mockRouter);

    require('../contexts/AdminContext').useAdmin.mockReturnValue({
      isLoading: false,
      setIsLoading: jest.fn(),
      saving: false,
      setSaving: jest.fn(),
      user: { id: 1, email: 'timdobranski@gmail.com' },
      authUser: { id: 1, email: 'timdobranski@gmail.com' },
    });

    // Mock useRef to return a debounced function
    const mockDebouncedUpdateDraftRef = { current: jest.fn() };
    jest.spyOn(React, 'useRef').mockReturnValue(mockDebouncedUpdateDraftRef);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with id of 5 in url', async () => {
    await setupDatabaseWithPostId5();

    // Mock useSearchParams to return id of 5
    useSearchParams.mockReturnValue({
      get: jest.fn().mockImplementation((key) => {
        if (key === 'id') return '5';
        return null;
      }),
    });

    await act(async () => {
      render(<NewPostPage />);
    });
  });

  it('renders the correct post when given an id of 5 in the url', async () => {
    await setupDatabaseWithPostId5(); // clear posts and add one with id of 5

    // Mock useSearchParams to return id of 5
    useSearchParams.mockReturnValue({
      get: jest.fn().mockImplementation((key) => {
        if (key === 'id') return '5';
        return null;
      }),
    });

    await act(async () => {
      render(<NewPostPage />);
    });
    await waitFor(() => {
      const postFromQueryStringId = screen.getByTestId('5');
      if (!postFromQueryStringId) {
        screen.debug(undefined, 50000);
      }
      expect(postFromQueryStringId).toBeInTheDocument();
    });

  });

  it('renders correctly with no id', async () => {
    // Mock useSearchParams to return no id
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });

    await act(async () => {
      render(<NewPostPage />);
    });
  });

  it('renders a file input when addPhoto button is clicked', async () => {
    // Mock useSearchParams to return no id
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });

    await act(async () => {
      render(<NewPostPage />);
    });

    // Find the addPhoto button using its data-testid
    const addPhotoButton = screen.getByTestId('addPhoto');

    // Simulate a click on the addPhoto button
    fireEvent.click(addPhotoButton);

    // Assert that the file input is rendered
    const photoInput = screen.getByTestId('singlePhotoInput'); // Adjust the data-testid as needed
    expect(photoInput).toBeInTheDocument();
  });

  it('renders a photo when one is selected from the photo block input', async () => {
    await setupDatabaseWithPostId5(); // clear posts and add one with id of 5

    // Mock useSearchParams to return no id
    useSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });

    let container;
    await act(async () => {
      const rendered = render(<NewPostPage />);
      container = rendered.container;
    });

    // Find the addPhoto button using its data-testid
    const addPhotoButton = screen.getByTestId('addPhoto');

    // Simulate a click on the addPhoto button
    fireEvent.click(addPhotoButton);

    // Assert that the file input is rendered
    const photoInput = screen.getByTestId('singlePhotoInput');
    expect(photoInput).toBeInTheDocument();

    // Mock the file selection event
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    fireEvent.change(photoInput, { target: { files: [file] } });

    // Use waitFor to wait for the photo to be rendered
    await waitFor(() => {
      const uploadedPhoto = screen.getByTestId('photo1');

      if (!uploadedPhoto) {
        const post = container.querySelector('.adminPost');
        console.log(prettyDOM(post, 500000));
      }

      expect(uploadedPhoto).toBeInTheDocument();
      expect(uploadedPhoto.src).toContain('https://example.com/public/randomfilename.webp');
    });
  });
});

