import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
  auth: null | { /* define your auth object structure here */ },
  setAuth: React.Dispatch<React.SetStateAction<null | { /* define your auth object structure here */ }>>
}

export const AuthContext = createContext<AuthContextType>({
  auth: null,
  setAuth: () => {}
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<null | { /* define your auth object structure here */ }>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
