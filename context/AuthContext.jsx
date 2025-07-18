// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '@env';
import * as AuthService from '../services/authService';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AuthService.getAuthToken();
        if (!token) {
          setIsLoading(false);
          return;
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON, got: ${contentType}. Response: ${text}`);
        }
        const result = await response.json();
        if (!response.ok) {
          if (response.status === 401) {
            await AuthService.logout();
            setUser(null);
            Toast.show({
              type: ALERT_TYPE.WARNING,
              title: 'Session Expired',
              textBody: 'Please login again',
              autoClose: 2000
            });
            return;
          }
          throw new Error(result.message || `Server error: ${response.status}`);
        }
        if (!result.success || !result.data?.user) {
          throw new Error('Invalid server response format');
        }
        await AuthService.storeUserData(result.data.user);
        setUser(result.data.user);
      } catch (error) {
        console.error('Auto-login error:', error);
        let errorMessage = 'Failed to load user session';
        if (error.name === 'AbortError') {
          errorMessage = 'Network timeout - please check your connection';
        } else if (error.message.includes('JSON')) {
          errorMessage = 'Server response format error';
        }
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: errorMessage,
          autoClose: 2500
        });
        await AuthService.clearInvalidAuthState();
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password, userType) => {
    try {
      setIsLoading(true);
      const result = await AuthService.login(email, password, userType);
      setUser(result.user);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Welcome back!',
        textBody: 'You have successfully logged in',
      });
      return result;
    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: ALERT_TYPE.ERROR,
        title: 'Login Failed',
        textBody: error.message || 'Invalid credentials. Please try again.',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password, userType) => {
    try {
      setIsLoading(true);
      const result = await AuthService.register(name, email, password, userType);
      setUser(result.user);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Registration Successful',
        textBody: 'Your account has been created successfully',
      });
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      Toast.show({
        type: ALERT_TYPE.ERROR,
        title: 'Registration Failed',
        textBody: error.message || 'Please check your details and try again',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      Toast.show({
        type: ALERT_TYPE.INFO,
        title: 'Logged Out',
        textBody: 'You have been logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      Toast.show({
        type: ALERT_TYPE.ERROR,
        title: 'Logout Failed',
        textBody: 'There was an issue logging out. Please try again.',
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register
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