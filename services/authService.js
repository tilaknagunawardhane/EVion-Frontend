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

// Helper to ensure SecureStore only receives strings. If value is an object
// it will be JSON.stringified. Null/undefined values are skipped.
const safeSetItemAsync = async (key, value) => {
  if (value === null || value === undefined) return;
  try {
    if (typeof value === 'string') {
      await SecureStore.setItemAsync(key, value);
    } else {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
    }
  } catch (err) {
    console.error(`SecureStore failed to set ${key}:`, err);
    throw err;
  }
};

export const getAuthToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('accessToken');
    if (!token) {
      console.warn('No auth token found');
      return null;
    }
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const setAuthToken = async (token) => {
  try {
    await safeSetItemAsync('accessToken', token);
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
    // Normalize userType to the backend's expected resource path.
    // Frontend passes values like 'evOwner' but backend routes use 'evowners'.
    const userTypeMap = {
      evOwner: 'evowners',
    };
    const resource = userTypeMap[userType] || String(userType).toLowerCase();
  const endpoint = `/${resource}/login`;
    Toast.show({
      type: ALERT_TYPE.INFO,
      title: 'Logging In',
      textBody: 'Authenticating your credentials...',
      autoClose: 1500,
    });
    // Some backend routes live under /api/evowners (not under /api/auth).
    // Pick the correct base path depending on resource.
    const authBase = (resource === 'evowners') ? `/api/${resource}` : `/api/auth/${resource}`;
    const requestUrl = `${API_BASE_URL}${authBase}/login`;
    // Debug: print the request URL and a masked payload to help backend troubleshooting
    try {
      const masked = { email, password: password ? '*****' : password };
      console.log('[authService] POST', requestUrl, 'payload:', masked);
    } catch (e) { /* ignore logging errors */ }

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    // Guard against non-JSON responses (e.g., HTML error pages) which cause
    // JSON.parse errors. Read content-type first and parse accordingly.
    let data = {};
    try {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
        console.log('[authService] login response JSON:', data);
      } else {
        // Read text (could be HTML) to surface useful debug info
        const text = await response.text();
        console.warn('[authService] Non-JSON response from login endpoint:', text);
        data = { message: text };
      }
    } catch (parseError) {
      // If parsing fails for any reason, capture raw text
      try {
        const raw = await response.text();
        console.warn('Failed to parse response as JSON, raw response:', raw);
        data = { message: raw };
      } catch (e) {
        data = { message: 'Unable to read server response' };
      }
    }

    if (!response.ok) {
      const message = data?.message || `Login failed: ${response.status} ${response.statusText}`;
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Login Failed',
        textBody: typeof message === 'string' ? message : 'Invalid credentials',
      });
      throw new Error(typeof message === 'string' ? message : 'Login failed');
    }
    await safeSetItemAsync('accessToken', data.accessToken);
    await safeSetItemAsync('refreshToken', data.refreshToken);
    if (data.user?._id) {
      await safeSetItemAsync('userID', String(data.user._id));
    }
    if (data.user) {
      await safeSetItemAsync('user', data.user);
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
    await Promise.all([
      SecureStore.deleteItemAsync('accessToken'),
      SecureStore.deleteItemAsync('refreshToken'),
      SecureStore.deleteItemAsync('userID'),
      SecureStore.deleteItemAsync('user')
    ]);
    const remainingItems = await Promise.all([
      SecureStore.getItemAsync('accessToken'),
      SecureStore.getItemAsync('refreshToken'),
      SecureStore.getItemAsync('user')
    ]);
    if (remainingItems.some(item => item !== null)) {
      throw new Error('Failed to clear all authentication data');
    }
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
    // Normalize userType to the backend's expected resource path.
    const userTypeMap = {
      evOwner: 'evowners',
    };
    const resource = userTypeMap[userType] || String(userType).toLowerCase();
  const endpoint = `/${resource}/register`;
    Toast.show({
      type: ALERT_TYPE.INFO,
      title: 'Creating Account',
      textBody: 'Setting up your new account...',
      autoClose: 1500,
    });
    // Use the appropriate base path for registration as well.
    const regBase = (resource === 'evowners') ? `/api/${resource}` : `/api/auth/${resource}`;
    const requestUrl = `${API_BASE_URL}${regBase}/register`;
    try {
      const masked = { name, email, password: password ? '*****' : password };
      console.log('[authService] POST', requestUrl, 'payload:', masked);
    } catch (e) { }

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    // See login: handle non-JSON responses gracefully and surface server text
    let data = {};
    try {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
        console.log('[authService] register response JSON:', data);
      } else {
        const text = await response.text();
        console.warn('[authService] Non-JSON response from register endpoint:', text);
        data = { message: text };
      }
    } catch (parseError) {
      try {
        const raw = await response.text();
        console.warn('Failed to parse register response as JSON, raw response:', raw);
        data = { message: raw };
      } catch (e) {
        data = { message: 'Unable to read server response' };
      }
    }

    if (!response.ok) {
      const message = data?.message || `Registration failed: ${response.status} ${response.statusText}`;
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Registration Failed',
        textBody: typeof message === 'string' ? message : 'Account creation failed',
      });
      throw new Error(typeof message === 'string' ? message : 'Registration failed');
    }
    await safeSetItemAsync('accessToken', data.accessToken);
    await safeSetItemAsync('refreshToken', data.refreshToken);
    if (data.user?._id) {
      await safeSetItemAsync('userID', String(data.user._id));
    }
    if (data.user) {
      await safeSetItemAsync('user', data.user);
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

export const storeUserData = async (userData) => {
  try {
    if (!userData) return;
    // Load existing stored user (if any) and merge to avoid overwriting with partial objects
    let existing = null;
    try {
      const existingStr = await SecureStore.getItemAsync('user');
      if (existingStr) existing = JSON.parse(existingStr);
    } catch (err) {
      // ignore parse errors and continue with null existing
      console.warn('Failed to parse existing stored user while merging:', err);
      existing = null;
    }

    const merged = {
      ...(existing || {}),
      ...(userData || {}),
    };

    const safeUserData = {
      _id: merged._id,
      email: merged.email,
      name: merged.name,
      contact_number: merged.contact_number || merged.contactNumber || null,
      home_address: merged.home_address || merged.homeAddress || null,
    };

    await safeSetItemAsync('user', safeUserData);
    // Persist userID string if available
    if (safeUserData._id) {
      try {
        await safeSetItemAsync('userID', String(safeUserData._id));
      } catch (err) {
        console.warn('Failed to persist userID as string:', err);
      }
    }
  } catch (error) {
    console.error('User data storage error:', error);
    throw error;
  }
};

export const getCachedUserData = async () => {
  try {
    const userDataString = await SecureStore.getItemAsync('user');
    return userDataString ? JSON.parse(userDataString) : null;
  } catch (error) {
    console.error('User data retrieval error:', error);
    return null;
  }
};

export const clearInvalidAuthState = async () => {
  try {
    const [token, user] = await Promise.all([
      SecureStore.getItemAsync('accessToken'),
      SecureStore.getItemAsync('user')
    ]);
    if (token && !user) {
      await Promise.all([
        SecureStore.deleteItemAsync('accessToken'),
        SecureStore.deleteItemAsync('refreshToken'),
        SecureStore.deleteItemAsync('user')
      ]);
    }
  } catch (error) {
    console.error('Auth state cleanup error:', error);
  }
};

export const validateAuthTokens = async () => {
  try {
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync('accessToken'),
      SecureStore.getItemAsync('refreshToken')
    ]);
    if (!accessToken || !refreshToken) return false;
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};