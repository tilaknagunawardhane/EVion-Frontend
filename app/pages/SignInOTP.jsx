import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, handleRequestOTP, Platform } from 'react-native';
import colors from '../../constants/color.js';
import fonts from '../../constants/fonts.js';
import CustomButton from '../../components/CustomButton.jsx';
import AppBar from '../../components/AppBar.jsx';
import InputField from '../../components/InputField.jsx';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { Dimensions } from 'react-native';
import { API_BASE_URL } from '@env'; // Ensure you have the correct path to your .env file
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

const OTPScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [user, setUser] = useState(null);
const { phoneNumber } = useLocalSearchParams();

// useEffect(() => {
//   console.log('Extracted phone number:', phoneNumber);
// }, [phoneNumber]); // ✅ track actual phone number

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

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = async () => {
    const otpValue = otp.join('');
    console.log('Entered OTP:', otpValue);

    try {

      if (user && user.email) {
        const userEmail = user.email;
        console.log(userEmail);

        const response = await fetch(`${API_BASE_URL}/api/evowners/verify-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            otp: otpValue,
            email: userEmail,
          }),
        });
        const data = await response.json();

        if (!response.ok) {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: data.error || data.message || 'OTP verification failed.',
          });
          return;
        }

        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'OTP sent successfully!',
        });

        router.push('/pages/ResetPW');
      }
      else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'Please Sign Up first',
        });
      }


    } catch (error) {
      console.error('OTP verification error:', error);
    Toast.show({
      type: ALERT_TYPE.DANGER,
      title: 'Error',
      textBody: error.message || 'Something went wrong.',
    });
    }

    // router.push('/pages/ResetPW', { otp: otpValue });
  };

  // Resend code handler
const handleResendCode = async () => {
  try {
    if (!phoneNumber) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Phone number is missing.',
      });
      return;
    }

    const userEmail = user.email;
    const response = await fetch(`${API_BASE_URL}/api/evowners/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobile: phoneNumber, email: userEmail }), // assuming email is optional
    });

    const data = await response.json();

    if (!response.ok) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: data.error || data.message || 'Failed to resend OTP',
      });
      return;
    }

    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Success',
      textBody: 'OTP resent successfully!',
    });

    console.log('New OTP sent to:', phoneNumber);
  } catch (error) {
    console.error('Resend OTP error:', error);
    Toast.show({
      type: ALERT_TYPE.DANGER,
      title: 'Error',
      textBody: error.message || 'Something went wrong',
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
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>Enter the 6 digit verification code.</Text>

          <Text
            style={[
              styles.mainTextColor,
              { fontSize: 16, fontFamily: fonts.PlusJakartaSans, marginBottom: 8 }, // <-- Added marginBottom for gap
            ]}
          >
            OTP
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                style={[
                  styles.otpInput,
                  index === otp.length - 1 && { marginRight: 0 }, // Remove margin from last box
                ]}
              />
            ))}
          </View>

          <CustomButton
            title="Continue"
            // onPress={() => {router.push('/pages/ResetPW', { otp: otp.join('') })}}
            onPress={handleContinue}
            type="primary"
            style={styles.continueButton}
          />

          <Text style={styles.resendText}>
            Don’t you receive any code?{' '}
            <Text style={styles.resendLink} onPress={handleResendCode}>
              Resend Code
            </Text>
          </Text>
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
    fontFamily: fonts.PlusJakartaSansBold,
    marginBottom: 4,
    color: colors.mainTextColor,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    marginBottom: 32,
    color: colors.secondaryText,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 8,
    paddingHorizontal: 24,
  },


  headerBackButton: {
    padding: 5,
  },
  headerBackIcon: {
    width: 24,
    height: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10, // ✅ Reduced gap
  },
  otpInput: {
    width: (screenWidth - 24 * 2 - 8 * 5) / 6, // Padding + margins
    height: 56,
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    backgroundColor: colors.background,
    marginRight: 8,

  },

  resendText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    marginTop: 370,
    marginBottom: 50,
  },
  resendLink: {
    color: colors.primary,
    fontFamily: fonts.PlusJakartaSansBold,
  },
});

export default OTPScreen;
