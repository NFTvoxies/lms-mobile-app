import { useAuth } from '../../../contexts/AuthContext';
import apiClient from '../../../api/client';
import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';

// ============ Login Hook ============
export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (credentials) => {
      // Adjust this endpoint to match your API
      const response = await apiClient.post('/auth/v1/login', credentials);
      const responseData = response.data;
      
      // Check if the API returned an error (even with 200 status)
      if (responseData.data && responseData.data.status === 'error') {
        throw new Error(responseData.data.message || 'Login failed');
      }
      
      return responseData;
    },
    onSuccess: async (data) => {
      console.log('Login response data:', data);
      // Extract actual data from nested structure
      const actualData = data.data || data;
      
      // Decode JWT token to get user information
      const decodedToken = jwtDecode(actualData.access_token);
      console.log('Decoded token:', decodedToken);
      
      // Build user object from the decoded token
      const user = {
        id: decodedToken.user_id,
        username: decodedToken.username,
        email: decodedToken.email,
        firstName: decodedToken.first_name,
        lastName: decodedToken.last_name,
        fullName: decodedToken.full_name,
        level: decodedToken.level,
        tenantId: decodedToken.tenant_id,
        menuId: decodedToken.menu_id,
        authorization: {
          isPowerUser: decodedToken.authorization?.is_power_user || false,
          isManager: decodedToken.authorization?.is_manager || false,
          isSystemUser: decodedToken.authorization?.is_system_user || false,
          level: decodedToken.authorization?.level || null,
          roles: decodedToken.authorization?.roles || [],
          managedResources: decodedToken.authorization?.managed_resources || [],
        },
      };

      const tenantSlug = decodedToken.tenant_id === 'learn'
        ? 'taallum'
        : decodedToken.tenant_id;
      
      await login({
        token: actualData.access_token,
        refreshToken: actualData.refresh_token || null,
        user: user,
        tenantId: tenantSlug,
        tokenExpiry: decodedToken.exp, // JWT expiry timestamp
      });
    },
    onError: (error) => {
      console.error('Login error:', error);
      // Error handling is done in the component
    },
  });
};

// ============ Logout Hook ============
export const useLogout = () => {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      // Optional: Call backend logout endpoint
      // await apiClient.post('/auth/logout');
      return { success: true };
    },
    onSuccess: async () => {
      await logout();
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Still logout locally even if API call fails
      logout();
    },
  });
};

// ============ Get Current User Hook ============
export const useGetUser = () => {
  const { user } = useAuth();
  
  // You can enhance this to fetch fresh user data from API if needed
  return {
    data: user,
    isLoading: false,
    error: null,
  };
};

// ============ Refresh Token Hook ============
export const useRefreshToken = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (refreshToken) => {
      const response = await apiClient.post('/auth/refresh', {
        refreshToken,
      });
      return response.data;
    },
    onSuccess: async (data) => {
      await login({
        token: data.token,
        refreshToken: data.refreshToken,
        user: data.user,
        tenantId: data.tenantId,
      });
    },
  });
};