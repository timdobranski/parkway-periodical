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
  const [user, setUser] = useState(null);

  const router = useRouter();




  return (
    <AdminContext.Provider value={{ isLoading, setIsLoading, saving, setSaving, alerts, setAlerts, user, setUser }}>
      {children}
    </AdminContext.Provider>
  );
};
