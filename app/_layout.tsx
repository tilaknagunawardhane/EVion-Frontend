import { Stack } from 'expo-router';
import React from 'react';
import { AlertNotificationRoot } from 'react-native-alert-notification';

// import ForgotPasswordScreen from './pages/SignIn2FP';


export default function Layout() {
  return (
    <AlertNotificationRoot>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
    </Stack>
    </AlertNotificationRoot>
  );
}
