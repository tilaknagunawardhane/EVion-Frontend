// hooks/useAuthStatus.js
import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';

export default function useAuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check for BOTH accessToken AND user data
        const [accessToken, user] = await Promise.all([
          SecureStore.getItemAsync('accessToken'),
          SecureStore.getItemAsync('user')
        ]);
        
        // Only consider logged in if BOTH exist
        const authenticated = !!(accessToken && user);
        setIsLoggedIn(authenticated);
        
        // If accessToken exists but no user, clear invalid state
        if (accessToken && !user) {
          console.warn('Invalid auth state - clearing tokens');
          await SecureStore.deleteItemAsync('accessToken');
          await SecureStore.deleteItemAsync('refreshToken');
        }
      } catch (error) {
        console.error("Auth status check error:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return { isLoggedIn, isLoading };
}