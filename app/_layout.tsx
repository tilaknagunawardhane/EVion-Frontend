import { Stack } from 'expo-router';
import Sample1 from './pages/sample1';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="sample1" component={Sample1} options={{ title: 'Sample 1' }}/> */}
    </Stack>
  );
}
