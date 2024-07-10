'use client'

import React, { useEffect, useState, useContext, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../utils/supabase'; // Update the path as per your directory structure
import HeaderAdmin from '../../components/HeaderAdmin/HeaderAdmin';
import { useAdmin } from '../../contexts/AdminContext';
import { AdminProvider } from '../../contexts/AdminContext';
import ErrorHandling from '../../components/ErrorHandling/ErrorHandling';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);


  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession()

        if (error) console.log('Error: ', error)

      // If there's no session, redirect to /login
      if (!data || !data.session || !data.session.user) {
        router.push('/login');
        return;
      }
      console.log('session response data: ', data)
      const { data: userData, error: userDataError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', data.session.user.id)
        .single();

      if(userDataError) {
        console.error('Error fetching user data: ', userDataError)
        // throw userDataError;
      }
      setUser(userData);

    };
    checkAuth();
  }, [router]);

  if (!user) {
    return <div className='loadingMessage'>Loading...</div>
  }

  return (
    <>
      <AdminProvider>
        <HeaderAdmin user={user}/>
        <div className='adminPageWrapper'>
          <Suspense>
            {children}
            {/* <ErrorHandling /> */}
          </Suspense>
        </div>
      </AdminProvider>
    </>
  );
}
