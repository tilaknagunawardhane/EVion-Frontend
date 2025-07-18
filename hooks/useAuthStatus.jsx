// hooks/useAuthStatus.js
import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';

export default function useAuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check both SecureStore and AsyncStorage for maximum compatibility
        const accessToken = await SecureStore.getItemAsync('accessToken');
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const user = await AsyncStorage.getItem("user");
        
        setIsLoggedIn(!!(accessToken || refreshToken || user));
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