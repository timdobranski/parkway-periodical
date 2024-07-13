'use client'

import React, { useEffect, useState, useContext, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '../../utils/supabase/client'; // Update the path as per your directory structure
import HeaderAdmin from '../../components/HeaderAdmin/HeaderAdmin';
import { useAdmin } from '../../contexts/AdminContext';
import ErrorHandling from '../../components/ErrorHandling/ErrorHandling';

export default function AdminLayout({ children }) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, setUser } = useAdmin();


  if (!user) {
    return <div className='loadingMessage'>Loading...</div>
  }

  return (
    <>
        {pathname !== 'admin/register' && <HeaderAdmin />}
        <div className='adminPageWrapper'>
          <Suspense>
            {children}
          </Suspense>
        </div>
    </>
  );
}
