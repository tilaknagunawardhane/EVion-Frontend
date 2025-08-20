import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import AppBar from '../../../../components/AppBar';
import InputField from '../../../../components/InputField';
import CustomButton from '../../../../components/CustomButton';

import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';

const EmailUpdateScreen = () => {
  const { currentEmail } = useLocalSearchParams();

  const [email, setEmail] = useState(currentEmail ? `${currentEmail}@gmail.com` : '');

  const handleUpdate = () => {
    // Navigate to verify email screen
    router.push({
      pathname: '/pages/Profile/ManageAccount/VerifyEmailScreen',
      params: { email }
    });
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
    fontSize: 32,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    marginBottom: 20,
  },
  note: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginTop: 8,
    marginBottom: 20,
  },
});

export default EmailUpdateScreen;
