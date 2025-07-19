// hooks/useUserData.js
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

export default function useUserData() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get both user data and ID for consistency check
        const [userString, userId] = await Promise.all([
          SecureStore.getItemAsync('user'),
          SecureStore.getItemAsync('userID')
        ]);

        if (userString && userId) {
          try {
            const userObj = JSON.parse(userString);
            
            // Validate that stored ID matches user data
            if (userObj._id === userId) {
              setUser(userObj);
            } else {
              console.warn('User ID mismatch - clearing data');
              await clearUserData();
            }
          } catch (parseError) {
            console.error('Failed to parse user data:', parseError);
            await clearUserData();
          }
        }
      } catch (error) {
        console.error('User data load error:', error);
        setError(error);
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'Failed to load user data',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const clearUserData = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync('user'),
        SecureStore.deleteItemAsync('userID')
      ]);
      setUser(null);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  };

  const refreshUserData = async () => {
    try {
      const userString = await SecureStore.getItemAsync('user');
      if (userString) {
        setUser(JSON.parse(userString));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  return {
    user,
    isLoading,
    error,
    clearUserData,
    refreshUserData
  };
}