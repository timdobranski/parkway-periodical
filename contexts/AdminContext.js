'use client'

import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
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
  const [authUser, setAuthUser] = useState(null);
  const [introOver, setIntroOver] = useState(false);

  const router = useRouter();
  const isMounted = useRef(false);

  const getSessionAndUsersTableData = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session in AdminContext: ', error);
      return;
    }
    setSession(data.session);

    // if the session doesn't have an associated user, return
    if (!data?.session?.user) {
      return
    }
    setAuthUser(data.session.user);

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', data.session.user.id)
      .single();

    if (userError && userError.code === 'PGRST116') {
      console.log('USER DOES NOT YET EXIST IN USERS TABLE: ', userError);
      setUser({});
      return;
    }

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error getting user data in AdminContext: ', userError);
      return;
    }

    setUser(userData);
  };

  useEffect(() => {
    // Run only once when component mounts
    getSessionAndUsersTableData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AUTH EVENT: ', event);
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          // router.push('/login');
        }

        if (event === 'PASSWORD_RECOVERY') {
          // router.push('/admin/changePassword');
        }

        if (event === 'INITIAL_SESSION') {
          getSessionAndUsersTableData();
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
    console.log('USER IN ADMIN CONTEXT FILE: ', user);
  }, [user]);

  useEffect(() => {
    console.log('SESSION IN ADMIN CONTEXT FILE: ', session);
  }, [session]);

  return (
    <AdminContext.Provider value={{ isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, authUser, session, introOver, setIntroOver }}>
      {children}
    </AdminContext.Provider>
  );
};
