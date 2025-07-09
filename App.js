import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from './screens/SignUpScreen';
import BookingsScreen from './screens/BookingsScreen';
import BookingDetails from './screens/bookings/BookingDetails';
import ReportIssue from './app/pages/bookings/ReportIssue'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Bookings" component={BookingsScreen} />
        <Stack.Screen name="ReportIssue" component={ReportIssue} />
        <Stack.Screen name="BookingDetails" component={BookingDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
