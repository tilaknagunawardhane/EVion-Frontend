import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppBar from '../../../../components/AppBar';
import CustomButton from '../../../../components/CustomButton';
import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';

const VerifyEmailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};
  const [otp, setOtp] = useState('');
  const [success, setSuccess] = useState(false);

  const handleContinue = () => {
    if (otp.length === 6) {
      // Replace this logic with actual OTP validation API call
      if (otp === '352935') {
        setSuccess(true);
        setTimeout(() => navigation.goBack(), 1500);
      } else {
        Alert.alert('Invalid OTP', 'Please check your code and try again.');
      }
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
          We’ve sent a 6-digit OTP to {email}
        </Text>

        <OTPInputView
          style={styles.otpInput}
          pinCount={6}
          code={otp}
          onCodeChanged={setOtp}
          autoFocusOnLoad
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
        />

        <CustomButton
          title="Continue"
          type="primary"
          onPress={handleContinue}
        />

        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resendText}>
            Don’t you receive any code?{' '}
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
  },
  otpInput: {
    width: '100%',
    height: 80,
    marginBottom: 24,
  },
  underlineStyleBase: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    color: colors.mainTextColor,
    fontSize: 20,
    borderColor: '#ccc',
  },
  underlineStyleHighLighted: {
    borderColor: colors.primary,
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
    fontWeight: 'bold',
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
