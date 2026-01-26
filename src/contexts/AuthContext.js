import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  storeToken,
  storeRefreshToken,
  storeUserData,
  storeTenantId,
  getStoredToken,
  getStoredUserData,
  getStoredTenantId,
  clearAuth,
} from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = await getStoredToken();
      const userData = await getStoredUserData();
      const storedTenantId = await getStoredTenantId();

      if (token && userData) {
        setUser(userData);
        setTenantId(storedTenantId);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (authData) => {
    try {
      // authData should contain: { token, refreshToken, user, tenantId }
      const { token, refreshToken, user: userData, tenantId: tenant } = authData;

      // Store auth data
      await storeToken(token);
      if (refreshToken) {
        await storeRefreshToken(refreshToken);
      }
      await storeUserData(userData);
      if (tenant) {
        await storeTenantId(tenant);
        setTenantId(tenant);
      }

      // Update state
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      // Clear storage
      await clearAuth();

      // Reset state
      setUser(null);
      setTenantId(null);
      setIsAuthenticated(false);

      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      return { success: false, error: error.message };
    }
  };

  const updateUser = async (userData) => {
    try {
      await storeUserData(userData);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    tenantId,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;