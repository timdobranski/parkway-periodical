import React, { createContext, useState, useContext } from 'react';


const AdminContext = createContext();

export function useAdmin() {
  return useContext(AdminContext);
}
export const AdminProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  return (
    <AdminContext.Provider value={{ isLoading, setIsLoading, saving, setSaving }}>
      {children}
    </AdminContext.Provider>
  );
};
