import axios from 'axios';
import { getStoredToken, getStoredTenantId } from '../utils/storage';

// Base API URL - update this with your actual API URL
const API_BASE_URL = __DEV__ 
  ? 'https://learn.ideo-cloud.ma/tenant' // Development - using live site
  // ? 'http://10.0.2.2/tenant' // Local Android Emulator
  // ? 'http://192.168.1.x:2622/tenant' // Local physical device
  : 'https://learn.ideo-cloud.ma/tenant'; // Production

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getStoredToken();
    const tenantId = await getStoredTenantId();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Tenant is already in the base URL
    // Add any additional headers if needed
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 - Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Here you could implement token refresh logic
      // For now, we'll just clear the token and force re-login
      // You can enhance this later with refresh token logic
      
      // Clear stored credentials
      const { clearAuth } = await import('../utils/storage');
      await clearAuth();
      
      // Optionally trigger navigation to login
      // This will be handled by the AuthContext
    }

    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };