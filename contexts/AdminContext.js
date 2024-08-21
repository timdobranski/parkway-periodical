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
  const [authUser, setAuthUser] = useState(null); // user in auth table
  const [introOver, setIntroOver] = useState(false); // user in users table

  const router = useRouter();
  const isMounted = useRef(false);

  // takes a session and sets user profile from users table
  const getUserData = async (session) => {
    const { data, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', session.user.id)
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
    setUser(data);
  }


  // get the session on mount, then set up a listener for auth state changes
  // whenever the session changes, update the user
  useEffect(() => {
    const getInitialSession = async () => {

      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        // console.log('No user session: ', error);
        setIsLoading(false);
        return;
      }
      // console.log('RESULT FROM INITIAL SESSION CHECK: ', data);
      setSession(data.session);
      setAuthUser(data.session.user);
      setIsLoading(false);
    }

    getInitialSession();


    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // console.log('AUTH EVENT: ', event);

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setAuthUser(null);
          setSession(null);
        }
        if (event === 'PASSWORD_RECOVERY') {
          // router.push('/admin/changePassword');
        }

        if (event === 'INITIAL_SESSION' || event === 'USER_UPDATED' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {

          setSession(session);

          if (session && session.user) {
            setAuthUser(session.user);
          } else {
            setAuthUser(null);
          }
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };


  }, []);

  useEffect(() => {
    // console.log('USER IN ADMIN CONTEXT FILE: ', user);
  }, [user]);

  useEffect(() => {
    if (session && session.user) {
      getUserData(session);
    }
    // console.log('SESSION IN ADMIN CONTEXT FILE: ', session);
    setIsLoading(false);
  }, [session]);

  return (
    <AdminContext.Provider value={{ isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, authUser, setAuthUser, session, setSession, introOver, setIntroOver }}>
      {children}
    </AdminContext.Provider>
  );
};
