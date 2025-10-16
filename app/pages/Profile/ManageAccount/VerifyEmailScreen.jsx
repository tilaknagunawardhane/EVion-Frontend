import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AppBar from '../../../../components/AppBar';
import CustomButton from '../../../../components/CustomButton';
import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';

const VerifyEmailScreen = () => {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [success, setSuccess] = useState(false);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleContinue = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      // Replace this logic with actual OTP validation API call
      if (otpCode === '352935') {
        setSuccess(true);
        setTimeout(() => router.back(), 1500);
      } else {
        Alert.alert('Invalid OTP', 'Please check your code and try again.');
      }
    } else {
      Alert.alert('Incomplete OTP', 'Please enter all 6 digits.');
    }
  };

  const handleResend = () => {
    Alert.alert('OTP Resent', `A new OTP was sent to ${email}`);
  };

  return (
    <View style={styles.container}>
      <AppBar />

      <View style={styles.content}>
        <Text style={styles.title}>Verify Email</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit OTP to{'\n'}{email}
        </Text>

        <Text style={styles.otpLabel}>OTP</Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              maxLength={1}
              keyboardType="numeric"
              textAlign="center"
            />
          ))}
        </View>

        <CustomButton
          title="Continue"
          type="primary"
          onPress={handleContinue}
        />

        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resendText}>
            Don't you receive any code?{' '}
            <Text style={styles.resendLink}>Resend Code</Text>
          </Text>
        </TouchableOpacity>

        {success && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>✓ Verification successful!</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    marginBottom: 24,
    lineHeight: 22,
  },
  otpLabel: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 12,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E0E0E0',
    backgroundColor: colors.white,
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: '#F0F9FF',
  },
  resendText: {
    fontSize: 14,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    textAlign: 'center',
    marginTop: 20,
  },
  resendLink: {
    color: colors.primary,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  successBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#E6FAF0',
    borderRadius: 12,
    alignItems: 'center',
  },
  successText: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
  },
});

export default VerifyEmailScreen;
