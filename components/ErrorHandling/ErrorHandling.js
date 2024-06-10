// components/ErrorHandler.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ErrorHandler = () => {
  const router = useRouter();

  const sendErrorToServer = async (error, context) => {
    try {
      await fetch('/api/sendErrorEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error, context }),
      });
    } catch (err) {
      console.error('Failed to send error to server:', err);
    }
  };

  useEffect(() => {
    const handleError = (error) => {
      console.error(error);

      const context = {
        page: router.pathname,
        user: 'current-user-id-or-info', // Replace with actual user info retrieval logic
        additionalInfo: 'Any other relevant info',
      };

      sendErrorToServer(error, context).catch(console.error);
    };

    // Catch unhandled errors
    window.addEventListener('error', (event) => {
      handleError(event.error);
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      handleError(event.reason);
    });

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, [router.pathname]);

  return null;
};

export default ErrorHandler;
