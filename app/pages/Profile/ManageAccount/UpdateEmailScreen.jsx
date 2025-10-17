import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { API_BASE_URL } from '@env';
import useUserData from '../../../../hooks/useUserData';

import AppBar from '../../../../components/AppBar';
import InputField from '../../../../components/InputField';
import CustomButton from '../../../../components/CustomButton';

import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';

const EmailUpdateScreen = () => {
  const { currentEmail } = useLocalSearchParams();
  const { user } = useUserData();

  const [email, setEmail] = useState(currentEmail ? `${currentEmail}@gmail.com` : '');

  const handleUpdate = async () => {
    if (!user?._id) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'User not found' });
      return;
    }

    try {
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

      const result = await response.json();

      if (!response.ok) {
        Toast.show({ type: ALERT_TYPE.ERROR, title: 'Error', textBody: result.message || 'Failed to send OTP' });
        return;
      }

      Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Success', textBody: result.message || 'OTP sent' });
      router.push({ pathname: '/pages/Profile/ManageAccount/VerifyEmailScreen', params: { email } });
    } catch (error) {
      console.error('Send OTP error:', error);
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: error.message || 'Failed to send OTP' });
    }
  };

  return (
    <View style={styles.container}>
      <AppBar />

      <View style={styles.content}>
        <Text style={styles.title}>Email</Text>
        <Text style={styles.subtitle}>
          You’ll use this email to get sign in and get notifications
        </Text>

        <InputField
          label="Email Address*"
          value={email}
          onChangeText={setEmail}
          placeholder="example@gmail.com"
          keyboardType="email-address"
        />

        <Text style={styles.note}>
          A verification code will be sent to this email
        </Text>

        <CustomButton title="Update" onPress={handleUpdate} type="primary" />
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
    marginBottom: 20,
  },
  note: {
  fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginTop: 8,
    marginBottom: 20,
  },
});

export default EmailUpdateScreen;
