import React, { useRef } from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import NewPostPage from '../app/admin/new-post/page.js';

// Mock the next/navigation useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock the supabase client
jest.mock('../utils/supabase/client', () => ({
  createClient: jest.fn().mockReturnValue({
    from: jest.fn((table) => {
      // mock the tags data query that gets category tags
      if (table === 'tags') {
        return {
          select: jest.fn().mockResolvedValue({
            data: [{ id: 1, name: 'tag1' }, { id: 2, name: 'tag2' }],
            error: null,
          }),
        };
      }
      // mock the posts data query which retrieves a matching post for the post id
      if (table === 'posts') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: {
              id: 5,
              title: 'Mock Post',
              author: 1,
              content: "[{\"type\":\"title\",\"content\":\"Almost Ready!\",\"style\":{}}]",
            },
            error: null,
          }),
        };
      }
      if (table === 'post_tags') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: [{ tag: 1, post: 5 }],
            error: null,
          }),
        };
      }
      if (table === 'drafts') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'No drafts found' },
          }),
          upsert: jest.fn().mockResolvedValue({
            data: [{ id: 10, title: 'Draft Post', author: 1, content: "[{\"type\":\"title\",\"content\":\"Work in Progress\",\"style\":{}}]" }],
            error: null,
          }),
        };
      }
      // Add more cases as needed
      return {
        select: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };
    }),
  }),
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

  it('renders correctly with id of 5', async () => {
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

  // photo renders when uploaded
  // renders a title input when add title is clicked
  // title renders when typed
  // renders a caption input when add caption is clicked
  // caption renders when typed
  // when isEditable changes to false, the input is replaced with the text
});
