import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Platform, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';

// InputField import is already present below as:
// import InputField from '../components/InputField';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
// Make sure that '../components/CustomButton' exists and exports a valid component
import colors from '../../constants/color.js';
import fonts from '../../constants/fonts.js';
import AppBar from '../../components/AppBar';
import { API_BASE_URL } from '@env'; // Ensure you have the correct path to your .env file
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';


const ForgotPasswordScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    async function getUser() {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        // console.log(user);
        setUser(JSON.parse(user));
      }
    }
    getUser();
  }, []);

  const handleRequestOTP = async () => {
    const trimmedPhone = phoneNumber.trim();
    const phoneRegex = /^07\d{8}$/;

    if (!phoneRegex.test(trimmedPhone)) {
      setError('Please enter a valid phone number (e.g., 07X XXX XXXX).');
      return;
    }

    try {
      setError('');
      console.log(user);

      if (user && user.email) {
        const userEmail = user.email;
        console.log(userEmail);

        const response = await fetch(`${API_BASE_URL}/api/evowners/send-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail,
            mobile: trimmedPhone,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: data.message || 'Failed to send OTP',
          });
          return;
        }

        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'OTP sent successfully!',
        });

        console.log('Requesting OTP for:', trimmedPhone);
        router.push('/pages/SignInOTP', { phoneNumber: trimmedPhone });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'Please Sign Up first',
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: error.message,
      });
    }
  };




  return (
    <View style={styles.container}>
      <AppBar />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.mainContent}>
          {/* Title */}
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>Enter your phone number to verify.</Text>

          {/* Phone Input */}
          <InputField
            label="Phone Number*"
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text);
              if (error) setError(''); // Clear error on typing
            }}
            placeholder="07X XXX XXXX"
            keyboardType="phone-pad"
            autoCapitalize="none"
            error={error}
          />
          {/* Request OTP Button */}
          <CustomButton title="Request  OTP" onPress={handleRequestOTP} />



          {/* Sign Up Link moved higher */}
          <View style={[styles.signupContainer, { marginTop: 374, marginBottom: 0 }]}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/pages/SignUpScreen')}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.PlusJakartaSansBold, // Use font from fonts.js
    marginBottom: 4,
    color: colors.mainTextColor,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans, // Use font from fonts.js
    marginBottom: 32,
    color: colors.secondaryText,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  signupText: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    marginBottom: 3,
  },
  signupLink: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSansBold,
    textAlign: 'center',
  },
  headerBackButton: {
    padding: 5,
  },
  headerBackIcon: {
    width: 24,
    height: 24,
  },
});

export default ForgotPasswordScreen;