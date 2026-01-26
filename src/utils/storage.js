import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  TENANT_ID: 'tenant_id',
  LANGUAGE: 'language',
  THEME: 'theme',
};

// ============ Secure Storage (for sensitive data like tokens) ============

export const storeToken = async (token) => {
  try {
    if (!token) return false;
    const tokenString = typeof token === 'string' ? token : String(token);
    await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, tokenString);
    return true;
  } catch (error) {
    console.error('Error storing token:', error);
    return false;
  }
};

export const getStoredToken = async () => {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const storeRefreshToken = async (token) => {
  try {
    if (!token) return true; // Don't fail if no refresh token
    const tokenString = typeof token === 'string' ? token : String(token);
    await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, tokenString);
    return true;
  } catch (error) {
    console.error('Error storing refresh token:', error);
    return false;
  }
};

export const getStoredRefreshToken = async () => {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

// ============ Regular Storage (for non-sensitive data) ============

export const storeUserData = async (userData) => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, jsonValue);
    return true;
  } catch (error) {
    console.error('Error storing user data:', error);
    return false;
  }
};

export const getStoredUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const storeTenantId = async (tenantId) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TENANT_ID, tenantId);
    return true;
  } catch (error) {
    console.error('Error storing tenant ID:', error);
    return false;
  }
};

export const getStoredTenantId = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.TENANT_ID);
  } catch (error) {
    console.error('Error getting tenant ID:', error);
    return null;
  }
};

export const storeLanguage = async (language) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    return true;
  } catch (error) {
    console.error('Error storing language:', error);
    return false;
  }
};

export const getStoredLanguage = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
  } catch (error) {
    console.error('Error getting language:', error);
    return 'en'; // Default to English
  }
};

export const storeTheme = async (theme) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    return true;
  } catch (error) {
    console.error('Error storing theme:', error);
    return false;
  }
};

export const getStoredTheme = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.THEME);
  } catch (error) {
    console.error('Error getting theme:', error);
    return 'light'; // Default to light theme
  }
};

// ============ Clear All Auth Data ============

export const clearAuth = async () => {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    await AsyncStorage.removeItem(STORAGE_KEYS.TENANT_ID);
    return true;
  } catch (error) {
    console.error('Error clearing auth:', error);
    return false;
  }
};

// ============ Clear All Storage ============

export const clearAllStorage = async () => {
  try {
    await clearAuth();
    await AsyncStorage.removeItem(STORAGE_KEYS.LANGUAGE);
    await AsyncStorage.removeItem(STORAGE_KEYS.THEME);
    return true;
  } catch (error) {
    console.error('Error clearing all storage:', error);
    return false;
  }
};