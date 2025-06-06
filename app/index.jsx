import { View, Text } from 'react-native'
import React from 'react'
import { useFonts } from 'expo-font';

const index = () => {

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/PlusJakartaSans[wght].ttf'),
    'PlusJakartaSans-Italic': require('../assets/fonts/PlusJakartaSans-Italic[wght].ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'PlusJakartaSans-SemiBoldItalic': require('../assets/fonts/PlusJakartaSans-SemiBoldItalic.ttf'),

  });

  if (!fontsLoaded) {
    return null; // or a loading indicator
  }
  React.useEffect(() => {
    console.log('Fonts loaded:', fontsLoaded);
  }, [fontsLoaded]);
  
  return (
    <View className='flex-1 items-center justify-center bg-red-100'>
      <Text>Welcome</Text>
    </View>
  )
}

export default index