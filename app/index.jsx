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



// // app/index.js
// import React, { useEffect } from 'react';
// import { ActivityIndicator, View } from 'react-native';
// import { useFonts } from 'expo-font';
// import { SplashScreen, router } from 'expo-router';
// import useAuthStatus from '../hooks/useAuthStatus';
// import { colors } from '../constants/color';

// export default function Index() {
//   const { isLoggedIn, isLoading } = useAuthStatus();
//   const [fontsLoaded, error] = useFonts({
//     'PlusJakartaSans-Regular': require('../assets/fonts/PlusJakartaSans[wght].ttf'),
//     'PlusJakartaSans-Italic': require('../assets/fonts/PlusJakartaSans-Italic[wght].ttf'),
//     'PlusJakartaSans-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
//     'PlusJakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
//     'PlusJakartaSans-SemiBoldItalic': require('../assets/fonts/PlusJakartaSans-SemiBoldItalic.ttf'),
//   });

//   useEffect(() => {
//     const prepare = async () => {
//       if (fontsLoaded || error) {
//         await SplashScreen.hideAsync();
        
//         if (isLoading) return; // Wait for auth check to complete
        
//         if (isLoggedIn) {
//           router.replace('/(tabs)/map');
//         } else {
//           router.replace('/pages/SignInScreen');
//         }
//       }
//     };

//     prepare();
//   }, [fontsLoaded, error, isLoggedIn, isLoading]);

//   if (!fontsLoaded || isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color={colors.primary} />
//       </View>
//     );
//   }

//   return <View />;
// }