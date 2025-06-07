import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, handleRequestOTP, Platform } from 'react-native';
import colors from '../../constants/color.js';
import fonts from '../../constants/fonts.js';
import CustomButton from '../../components/CustomButton.jsx';
import AppBar from '../../components/AppBar.jsx';
import InputField from '../../components/InputField.jsx';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';

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
    navigation.navigate('NextScreen');
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

            <Text style={[styles.mainTextColor, { fontSize: 16, fontFamily: fonts.PlusJakartaSans }]}>OTP</Text>
                
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
                        style={[styles.otpInput, styles.signupText, { fontSize: 20 }]} // Set font size to 16
                    />
                ))}
            </View>

            {/* Continue Button */}
            <CustomButton
                title="Continue"
                onPress={handleContinue}
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
    backgroundColor: colors.background ,
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
    color: colors.mainTextColor ,
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
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 12,
  marginBottom: 28,
  // Removed marginHorizontal: 24


  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  resendText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    marginTop:350,
    marginBottom: 50,
  },
  resendLink: {
    color: colors.primary,
    fontFamily: fonts.PlusJakartaSansBold,
    
  },
});

export default OTPScreen;
