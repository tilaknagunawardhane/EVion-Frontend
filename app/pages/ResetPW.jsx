import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import colors from '../../constants/color.js';
import fonts from '../../constants/fonts';
import AppBar from '../../components/AppBar';
import { API_BASE_URL } from '@env';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const ResetPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [user, setUser] = useState(null);
    const [error, setError] = useState('');
  

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

  const handleResetPassword = async () =>{
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
    const userEmail = user.email;

      const response = await fetch(`${API_BASE_URL}/api/evowners/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, password: password, confirmPassword: confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: data.message || 'Password reset failed',
        });
        return;
      }

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: 'Password updated successfully!',
      });

      router.replace('/pages/SignInScreen');

    } catch (error) {
      console.error('Reset password error:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: error.message || 'Something went wrong.',
      });
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
