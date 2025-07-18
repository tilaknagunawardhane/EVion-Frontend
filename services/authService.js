// src/services/authService.js
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@env';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

if (!SecureStore) {
  Toast.show({
    type: ALERT_TYPE.DANGER,
    title: 'Security Error',
    textBody: 'Secure storage not available!',
  });
  throw new Error('SecureStore module not found');
}

export const getAuthToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('accessToken');
    if (!token) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Session Expired',
        textBody: 'Please login again',
      });
    }
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    Toast.show({
      type: ALERT_TYPE.DANGER,
      title: 'Security Error',
      textBody: 'Failed to retrieve authentication token',
    });
    return null;
  }
};

export const setAuthToken = async (token) => {
  try {
    await SecureStore.setItemAsync('accessToken', token);
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Session Updated',
      textBody: 'Authentication token stored securely',
    });
  } catch (error) {
    console.error('Error setting auth token:', error);
    Toast.show({
      type: ALERT_TYPE.DANGER,
      title: 'Security Error',
      textBody: 'Failed to store authentication token',
    });
    throw error;
  }
};

export const login = async (email, password, userType) => {
  try {
    const endpoint = `/${userType}/login`;

    Toast.show({
      type: ALERT_TYPE.INFO,
      title: 'Logging In',
      textBody: 'Authenticating your credentials...',
      autoClose: 1500,
    });

    const response = await fetch(`${API_BASE_URL}/api/auth${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Login Failed',
        textBody: data.message || 'Invalid credentials',
      });
      throw new Error(data.message || 'Login failed');
    }

    await SecureStore.setItemAsync('accessToken', data.accessToken);
    await SecureStore.setItemAsync('refreshToken', data.refreshToken);

    // Store user ID as string
    if (data.user?._id) {
      await SecureStore.setItemAsync('userID', String(data.user._id));
    }

    // Store user data as JSON string
    if (data.user) {
      await SecureStore.setItemAsync('user', JSON.stringify(data.user));
    }

    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Welcome Back!',
      textBody: 'You have successfully logged in',
      autoClose: 2000,
    });

    return {
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    };
  } catch (error) {
    console.error('Login error:', error);
    Toast.show({
      type: ALERT_TYPE.DANGER,
      title: 'Login Error',
      textBody: error.message || 'Network error during login',
    });
    throw error;
  }
};

export const logout = async () => {
  try {
    // 1. Try to call backend logout endpoint
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (apiError) {
      console.warn('Logout API call failed:', apiError);
    }

    // 2. Clear ALL storage completely
    await Promise.all([
      SecureStore.deleteItemAsync('accessToken'),
      SecureStore.deleteItemAsync('refreshToken'),
      SecureStore.deleteItemAsync('userData'),
      SecureStore.deleteItemAsync('userID'),
      SecureStore.deleteItemAsync('user'), // Add this line
      // AsyncStorage.clear() // Clear any non-secure storage
    ]);

    // 3. Verify everything is cleared
    const remainingItems = await Promise.all([
      SecureStore.getItemAsync('accessToken'),
      SecureStore.getItemAsync('refreshToken'),
      SecureStore.getItemAsync('user')
    ]);
    
    if (remainingItems.some(item => item !== null)) {
      throw new Error('Failed to clear all authentication data');
    }

    // 4. Show success feedback
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Logged Out',
      textBody: 'You have been securely signed out',
      autoClose: 2000
    });

  } catch (error) {
    console.error('Logout error:', error);
    Toast.show({
      type: ALERT_TYPE.DANGER,
      title: 'Logout Error',
      textBody: 'Failed to complete logout. Please try again.',
    });
    throw error;
  }
};

export const register = async (name, email, password, userType) => {
  try {
    const endpoint = `/${userType}/register`;

    Toast.show({
      type: ALERT_TYPE.INFO,
      title: 'Creating Account',
      textBody: 'Setting up your new account...',
      autoClose: 1500,
    });

    const response = await fetch(`${API_BASE_URL}/api/auth${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Registration Failed',
        textBody: data.message || 'Account creation failed',
      });
      throw new Error(data.message || 'Registration failed');
    }

    await SecureStore.setItemAsync('accessToken', data.accessToken);
    await SecureStore.setItemAsync('refreshToken', data.refreshToken);

    // Store user ID as string
    if (data.user?._id) {
      await SecureStore.setItemAsync('userID', String(data.user._id));
    }

    // Store user data as JSON string
    if (data.user) {
      await SecureStore.setItemAsync('user', JSON.stringify(data.user));
    }

    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Account Created!',
      textBody: 'Welcome to our community!',
      autoClose: 2000,
    });

    return {
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    };
  } catch (error) {
    console.error('Registration error:', error);
    Toast.show({
      type: ALERT_TYPE.DANGER,
      title: 'Registration Error',
      textBody: error.message || 'Failed to create account',
    });
    throw error;
  }
};