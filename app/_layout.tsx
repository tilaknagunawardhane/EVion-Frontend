import { Stack } from 'expo-router';
import React from 'react';
// import ForgotPasswordScreen from './pages/SignIn2FP';


export default function Layout() {
  return (
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
  );
}
