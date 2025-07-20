import { Stack } from 'expo-router';

export default function ActivityLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Activity" />
      <Stack.Screen name="SessionHistory" />
      <Stack.Screen name="TripHistory" />
      <Stack.Screen name="BookingHistory" />
    </Stack>
  );
}