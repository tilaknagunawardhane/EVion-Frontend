import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { SplashScreen, router } from 'expo-router';
import IsUserLoggedIn from '../hooks/IsUserLoggedIn';
import SignInScreen from './pages/SignInScreen';
import SignUpScreen from './pages/SignUpScreen';

export default function Index() {
  const isLoggedIn = IsUserLoggedIn();

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
        if (isLoggedIn) {
          // router.replace('/(tabs)');
          router.replace('/(tabs)/map');
          // router.replace('/pages/SignInScreen');

        } else {
          router.replace('/pages/SignUpScreen');
        }
      }
    };

    prepare();
  }, [fontsLoaded, error, isLoggedIn]);

  if (!fontsLoaded && !error) {
    return null; // Show nothing until fonts are loaded
  }

  return <View />; // Loading Screen
  //  return <SignUpScreen />;
}
