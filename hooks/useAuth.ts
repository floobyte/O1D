import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Save token to session storage and update state
  const login = (token: string) => {
    sessionStorage.setItem('authToken', token);
    setAuthToken(token);
  };

  // Clear token from session storage and update state
  const logout = () => {
    sessionStorage.removeItem('authToken');
    setAuthToken(null);
  };

  // Load token from session storage on app load
  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return { authToken, login, logout };
};
