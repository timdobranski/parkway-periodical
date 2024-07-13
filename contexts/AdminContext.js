'use client'

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabase/client';
import { redirect } from 'next/navigation';

const AdminContext = createContext();
const supabase = createClient();

export function useAdmin() {
  return useContext(AdminContext);
}
export const AdminProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  const router = useRouter();

  const getSessionAndUsersTableData = async () => {

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session in AdminContext: ', error);
      return;
    }
    setSession(data.session);


    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', data.session.user.id)
      .single();

    if (userError) {
      console.error('Error getting user data in AdminContext: ', userError);
      return;
    }
    setUser(userData);
  }

  useEffect(() => {
    // Check for an existing session on mount
    getSessionAndUsersTableData();

    // Listen for changes to the session
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AUTH EVENT: ', event)
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          // router.push('/login');
        }

        if (event === 'PASSWORD_RECOVERY') {
          // router.push('/admin/changePassword');
        } else {
          getSessionAndUsersTableData();
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('USER IN GLOBAL ADMIN CONTEXT: ', user)
  }, [user])

  return (
    <AdminContext.Provider value={{ isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, setUser, session }}>
      {children}
    </AdminContext.Provider>
  );
};
