import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import colors from '../../constants/color.js';
import fonts from '../../constants/fonts';
import AppBar from '../../components/AppBar';
import { API_BASE_URL } from '@env';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import useUserData from '../../hooks/useUserData';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const ResetPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user } = useUserData();
  const [error, setError] = useState('');

  const handleResetPassword = async () =>{
    if (currentPassword.trim().length === 0) {
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Please enter your current password' });
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Passwords do not match.',
      });
      return;
    }

    try {
      // get token and user id
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) throw new Error('Not authenticated');
      if (!user || !user._id) throw new Error('User not found');

      const response = await fetch(`${API_BASE_URL}/api/evowners/profile/${user._id}/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword: currentPassword, newPassword: password }),
      });

      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        console.warn('Non-JSON response change-password:', response.status, text);
        Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: `Server error (status ${response.status})` });
        return;
      }

      if (!response.ok) {
        Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: data.message || 'Password change failed' });
        return;
      }

      Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Success', textBody: data.message || 'Password updated successfully!' });
      // After password change, navigate to sign in
      router.replace('/pages/SignInScreen');

    } catch (error) {
      console.error('Reset password error:', error);
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: error.message || 'Something went wrong.' });
    }

  }

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <AppBar />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Create your new password.</Text>
          <InputField
            label="Current Password*"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Current password"
            secureTextEntry={!showPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isPassword
          />

          {/* Input Fields */}
          <InputField
            label="New Password*"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError(''); // Clear error on typing
            }}
            placeholder="XXXXXXXX"
            secureTextEntry={!showPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isPassword
            error={error}

          />

          <InputField
            label="Enter new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="XXXXXXXX"
            secureTextEntry={!showConfirmPassword}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
            isPassword
          />

          {/* Done Button */}
          <CustomButton title="Done" onPress={ handleResetPassword} />
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 40, // updated from 26 to 16
  },

});

export default ResetPasswordScreen;