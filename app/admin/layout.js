'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../utils/supabase'; // Update the path as per your directory structure
import HeaderAdmin from '../../components/HeaderAdmin/HeaderAdmin';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      const session = supabase.auth.getSession();

      // If there's no session, redirect to /login
      if (!session) {
        router.push('/login');
      } else {
        setIsLoading(false); // Authenticated, stop showing loading state
      }
    };
    checkAuth();
  }, [router]);

  // Show a loading state or spinner while checking authentication
  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or similar component
  }

  return (
    // <div className='background'>
    <>
      <HeaderAdmin saving={saving}/>
      <div className='adminPageWrapper'>
        {children}
      </div>
    </>
    // </div>
  );
}
