'use client'

import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../utils/supabase'; // Update the path as per your directory structure
import HeaderAdmin from '../../components/HeaderAdmin/HeaderAdmin';
import { useAdmin } from '../../contexts/AdminContext';
import { AdminProvider } from '../../contexts/AdminContext';



export default function AdminLayout({ children }) {
  const router = useRouter();



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

  return (
    <>
      <AdminProvider>
        <HeaderAdmin/>
        <div className='adminPageWrapper'>
          {children}
        </div>
      </AdminProvider>
    </>
  );
}
