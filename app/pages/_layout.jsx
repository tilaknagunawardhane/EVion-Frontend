import { Stack } from 'expo-router';
import React from 'react';

export default function PagesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Profile1"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile/ManageAccount/UpdateEmailScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile/ManageAccount/VerifyEmailScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile/ManageAccount/ManageAccountScreen"
        options={{ headerShown: false }}
      />
      {/* Add other page screens as needed */}
    </Stack>
  );
}
