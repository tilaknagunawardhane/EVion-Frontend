// src/services/authService.js
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@env';

if (!SecureStore) {
  console.error('SecureStore is not available!');
  throw new Error('SecureStore module not found');
}

export const getAuthToken = async () => {
  try {
    return await SecureStore.getItemAsync('accessToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const setAuthToken = async (token) => {
  try {
    await SecureStore.setItemAsync('accessToken', token);
  } catch (error) {
    console.error('Error setting auth token:', error);
    throw error;
  }
};

export const login = async (email, password, userType) => {
  try {
    const endpoint = `/${userType}/login`;
    const response = await fetch(`${API_BASE_URL}/api/auth${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store tokens securely
    await SecureStore.setItemAsync('accessToken', data.accessToken);
    await SecureStore.setItemAsync('refreshToken', data.refreshToken);

    // Store user data in state (not in secure storage)
    return {
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    // Remove all auth-related items
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    // Add any other items you need to clear
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const register = async (userData, userType) => {
  try {
    const endpoint = `/${userType}/register`;
    const response = await fetch(`${API_BASE_URL}/api/auth${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store tokens securely (same as login)
    await SecureStore.setItemAsync('accessToken', data.token);
    
    // Return both user data and token
    return {
      user: data.user,
      token: data.token
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};