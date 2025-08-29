import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';
import { SplashScreen, router } from 'expo-router';
import useAuthStatus from '../hooks/useAuthStatus';
import { colors } from '../constants/color';
import * as SecureStore from 'expo-secure-store';

export default function Index() {
  const { isLoggedIn, isLoading } = useAuthStatus();
  const [fontsLoaded, error] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/PlusJakartaSans[wght].ttf'),
    'PlusJakartaSans-Italic': require('../assets/fonts/PlusJakartaSans-Italic[wght].ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'PlusJakartaSans-SemiBoldItalic': require('../assets/fonts/PlusJakartaSans-SemiBoldItalic.ttf'),
  });

  useEffect(() => {
    const prepare = async () => {
      if (fontsLoaded || error) {
        await SplashScreen.hideAsync();
        if (isLoading) return;
        if (isLoggedIn) {
          router.replace('/(tabs)/map');
        } else {
          router.replace('/pages/SignInScreen');
        }
      }
    };
    prepare();
  }, [fontsLoaded, error, isLoggedIn, isLoading]);

  if (!fontsLoaded || isLoading) {
    return (
      // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      //   <ActivityIndicator size="large" color={colors.primary || '#000'} />
      // </View>
      null
    );
  }

  return <View />;
}

