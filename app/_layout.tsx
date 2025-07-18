import { Stack } from 'expo-router';
import React from 'react';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { AuthProvider } from '../context/AuthContext';

// import ForgotPasswordScreen from './pages/SignIn2FP';


export default function Layout() {
  return (
    <AlertNotificationRoot>
      <AuthProvider>
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
    </AuthProvider>
    </AlertNotificationRoot>
  );
}
