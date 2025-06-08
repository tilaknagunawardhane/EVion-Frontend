import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, handleRequestOTP, Platform } from 'react-native';
import colors from '../../constants/color.js';
import fonts from '../../constants/fonts.js';
import CustomButton from '../../components/CustomButton.jsx';
import AppBar from '../../components/AppBar.jsx';
import InputField from '../../components/InputField.jsx';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const OTPScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

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

  const handleContinue = () => {
    const otpValue = otp.join('');
    console.log('Entered OTP:', otpValue);
    router.push('/pages/ResetPW', { otp: otpValue });
  };

// Resend code handler
const handleResendCode = () => {
    // Add your resend OTP logic here (e.g., API call)
    console.log('Resend code requested');
    // Optionally, show a message to the user
};

return (
  <View style={styles.container}>
    <AppBar />
    <View style={styles.mainContent}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter the 6 digit verification code.</Text>

      <Text
        style={[
          styles.mainTextColor,
          { fontSize: 16, fontFamily: fonts.PlusJakartaSans, marginBottom: 8}, // <-- Added marginBottom for gap
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
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: colors.stroke, // <-- Use color from colors file
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    backgroundColor: colors.background, // <-- Use color from colors file
    marginRight: 16,
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
