import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/authApi.js';
import initialDemoData from '../data/demoData.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('finflow_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(() => {
    return localStorage.getItem('finflow_demo_mode') === 'true';
  });

  // Verify stored session or load demo mode on initialization
  useEffect(() => {
    const initializeAuth = async () => {
      if (isDemoMode) {
        setUser(initialDemoData.user);
        setIsLoading(false);
        return;
      }

      const storedToken = localStorage.getItem('finflow_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            handleLogoutClean();
          }
        } catch (err) {
          console.warn('[FinFlow Auth] Session verification failed:', err.message);
          handleLogoutClean();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [isDemoMode]);

  const handleLogoutClean = () => {
    localStorage.removeItem('finflow_token');
    localStorage.removeItem('finflow_demo_mode');
    setToken(null);
    setUser(null);
    setIsDemoMode(false);
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('finflow_token', res.token);
        localStorage.removeItem('finflow_demo_mode');
        setToken(res.token);
        setUser(res.user);
        setIsDemoMode(false);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Authentication error' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(userData);
      if (res.success && res.token) {
        localStorage.setItem('finflow_token', res.token);
        localStorage.removeItem('finflow_demo_mode');
        setToken(res.token);
        setUser(res.user);
        setIsDemoMode(false);
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration error' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (!isDemoMode && token) {
        await authApi.logout();
      }
    } catch (e) {
      // ignore server logout errors
    } finally {
      handleLogoutClean();
    }
  };

  const enterDemoMode = () => {
    localStorage.removeItem('finflow_token');
    localStorage.setItem('finflow_demo_mode', 'true');
    setToken('demo-token-active');
    setUser(initialDemoData.user);
    setIsDemoMode(true);
  };

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : prev));
  };

  const currency = user?.preferredCurrency || 'INR';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isDemoMode,
        currency,
        login,
        register,
        logout,
        enterDemoMode,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
