// Lightweight hook wrapper for user data. This preserves the original hook API
// but delegates storage access to the auth service. Keeping the hook file in
// place ensures all existing imports continue to work while simplifying the
// implementation.
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { getCachedUserData } from '../services/authService';

export default function useUserData() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        const cached = await getCachedUserData();
        if (!mounted) return;
        if (cached) setUser(cached);
      } catch (err) {
        console.error('useUserData load error:', err);
        setError(err);
        Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Failed to load user data' });
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const refreshUserData = async () => {
    try {
      const cached = await getCachedUserData();
      if (cached) setUser(cached);
      else setUser(null);
    } catch (err) {
      console.error('useUserData refresh error:', err);
    }
  };

  const clearUserData = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync('user'),
        SecureStore.deleteItemAsync('userID')
      ]);
      setUser(null);
    } catch (err) {
      console.error('useUserData clear error:', err);
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Failed to clear user data' });
    }
  };

  return { user, isLoading, error, clearUserData, refreshUserData };
}