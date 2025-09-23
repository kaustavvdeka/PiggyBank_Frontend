import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiPost } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('auth');
      if (saved) {
        const parsed = JSON.parse(saved);
        setToken(parsed.token);
        setUser(parsed.user);
      }
      setLoading(false);
    })();
  }, []);

  const loginDemo = async () => {
    const res = await apiPost('/api/auth/demo');
    setToken(res.token);
    setUser(res.user);
    await AsyncStorage.setItem('auth', JSON.stringify(res));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
