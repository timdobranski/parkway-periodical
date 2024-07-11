'use client'

import React, { useEffect, useState, useContext, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client'; // Update the path as per your directory structure
import HeaderAdmin from '../../components/HeaderAdmin/HeaderAdmin';
import { useAdmin } from '../../contexts/AdminContext';
import { AdminProvider } from '../../contexts/AdminContext';
import ErrorHandling from '../../components/ErrorHandling/ErrorHandling';

export default function AdminLayout({ children }) {
  const supabase = createClient();
  const router = useRouter();
  const { isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, setUser } = useAdmin();
  // const [user, setUser] = useState(null);


  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      // if there's no session or user, reidrect to login
      if (error || !data || !data.session || !data.session.user) {
        router.push('/login');
        return;
      }

      // if there's a session and user
      if (data && data.session && data.session.user) {

        // valid session and user with full permissions
        const { data: userData, error: userDataError } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', data.session.user.id)
          .single();

        if (userDataError) {
          console.error('Error fetching user data: ', userDataError);
        } else {
          // set the user data
          setUser(userData);
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    const { data: {subscription}} = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AUTH EVENT: ', event)
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        router.push('/login');
      }

      if (event === 'PASSWORD_RECOVERY') {
        // router.push('/admin/changePassword');
      } else {
        setUser(session?.user || null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

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
          </Suspense>
        </div>
      </AdminProvider>
    </>
  );
}
