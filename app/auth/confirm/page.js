'use client'

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAdmin } from '../../../contexts/AdminContext';

export default function Confirm() {
  const { setIsLoading, setUser, setAuthUser, setSession } = useAdmin();
  const searchParams = useSearchParams();
  const token_hash = searchParams.get('token_hash');
  const router = useRouter();

  useEffect(() => {
    if (token_hash) {
      const supabase = createClient();

      const checkAuth = async () => {
        try {
          setIsLoading(true);
          const { data, error } = await supabase.auth.verifyOtp({
            type: 'email',
            token_hash
          });

          if (error) {
            console.log('Error verifying OTP:', error.message);
            router.push('/error');
            // Redirect to error page if verification fails
            return;
          }

          // console.log('data returned from verifyOtp:', data);
          setSession(data.session);
          setAuthUser(data.user);
          router.push('/admin/changePassword');
        } catch (err) {
          console.error('Unexpected error:', err);
          router.push('/error');
          // Redirect to error page on unexpected errors
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }
  }, [token_hash]);

  return (
    <div className='smallerTitle'>Signing You In...</div>
  )
}