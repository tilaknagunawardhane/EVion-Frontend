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
import * as SecureStore from 'expo-secure-store';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { API_BASE_URL } from '@env';
import useUserData from '../../../../hooks/useUserData';
import { storeUserData } from '../../../../services/authService';
import AppBar from '../../../../components/AppBar';
import CustomButton from '../../../../components/CustomButton';
import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';

const VerifyEmailScreen = () => {
  const { email } = useLocalSearchParams();
  const { user, refreshUserData } = useUserData();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleContinue = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Incomplete OTP', 'Please enter all 6 digits.');
      return;
    }

    if (!user?._id) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'User not found' });
      return;
    }

    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/api/evowners/profile/${user._id}/email/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp: otpCode }),
      });

      const text = await response.text();
      let result = {};
      try {
        result = text ? JSON.parse(text) : {};
      } catch (err) {
        console.warn('Non-JSON response verifying email:', response.status, text);
        Toast.show({ type: ALERT_TYPE.ERROR, title: 'Error', textBody: `Server returned non-JSON response (status ${response.status})` });
        return;
      }

      if (!response.ok) {
        Toast.show({ type: ALERT_TYPE.ERROR, title: 'Error', textBody: result.message || 'OTP verification failed' });
        return;
      }

      Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Success', textBody: result.message || 'Email verified' });
      setSuccess(true);
      // Try to extract updated email from response (fall back to the email the user entered)
      const updatedEmail = result?.data?.email || result?.email || email;
      // If backend returned updated user data, persist and refresh
      const updatedUser = result?.data || result;
      try {
        if (updatedUser) {
          await storeUserData(updatedUser);
          if (typeof refreshUserData === 'function') await refreshUserData();
        }
      } catch (err) {
        console.warn('Failed to persist verified email locally:', err);
      }
      // Navigate to Manage Account and pass updatedEmail so the UI refreshes
      setTimeout(() => {
        router.push({ pathname: '/pages/Profile/Profile1', params: { updatedEmail } });
      }, 600);
    } catch (error) {
      console.error('Verify OTP error:', error);
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: error.message || 'OTP verification failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!user?._id) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'User not found' });
      return;
    }

    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/api/evowners/profile/${user._id}/email/send-otp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newEmail: email }),
      });

      const text = await response.text();
      let result = {};
      try {
        result = text ? JSON.parse(text) : {};
      } catch (err) {
        console.warn('Non-JSON response resending OTP:', response.status, text);
        Toast.show({ type: ALERT_TYPE.ERROR, title: 'Error', textBody: `Server returned non-JSON response (status ${response.status})` });
        return;
      }

      if (!response.ok) {
        Toast.show({ type: ALERT_TYPE.ERROR, title: 'Error', textBody: result.message || 'Failed to resend OTP' });
        return;
      }

      Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Success', textBody: result.message || 'OTP resent' });
    } catch (error) {
      console.error('Resend OTP error:', error);
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: error.message || 'Failed to resend OTP' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppBar />

      <View style={styles.content}>
        <Text style={styles.title}>Verify Email</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit OTP to{"\n"}{email}
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
          title={isLoading ? 'Verifying...' : 'Continue'}
          type="primary"
          onPress={handleContinue}
          disabled={isLoading}
        />

        <TouchableOpacity onPress={handleResend} disabled={isLoading}>
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
  fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  subtitle: {
  fontSize: 13,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    marginBottom: 24,
    lineHeight: 22,
  },
  otpLabel: {
  fontSize: 14,
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
  fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: '#F0F9FF',
  },
  resendText: {
    fontSize: 12,
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