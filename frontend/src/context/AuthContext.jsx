import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mg_user');
    return saved ? JSON.parse(saved) : null;
  });

  const loginUser = (authData) => {
    localStorage.setItem('mg_token', authData.token);
    localStorage.setItem('mg_user', JSON.stringify(authData));
    setUser(authData);
  };

  const updateUserSession = (updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('mg_user', JSON.stringify(next));
      return next;
    });
  };

  const logoutUser = () => {
    localStorage.removeItem('mg_token');
    localStorage.removeItem('mg_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, updateUserSession, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);