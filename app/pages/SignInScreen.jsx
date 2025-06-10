// screens/SignInScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Platform, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import AppBar from '../../components/AppBar';
import colors from '../../constants/color.js';
import fonts from '../../constants/fonts.js';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { API_BASE_URL } from '@env'; // Ensure you have the correct path to your .env file


const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();



  const handleSignIn = async () => {
    if (!email) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Please enter your email address.',
      });
      return;
    }
    // if (!password || password.length < 8) {
    if (!password) {

      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Please enter a valid password (at least 8 characters).',
      });
      console.log('Password validation failed');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/evowners/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        // Show backend error message
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: data.message || 'Failed to sign in. Please try again.',
        });
        return;
      }

      // Success
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: 'You have signed up successfully!',
      });
      console.log('User signed in successfully:', data);
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1500);

    }
    catch (error) {
       console.error('Network or unexpected error during sign-in:', error);
    Toast.show({
      type: ALERT_TYPE.DANGER,
      title: 'Error',
      textBody: 'A network error occurred. Please try again later.',
    });
    }
    // Add your sign in logic here

  };



  return (


    <View style={styles.container}>
      <AppBar />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.mainContent}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Please enter your details.</Text>

          {/* Email Input */}
          <InputField
            label="Email Address*"
            value={email}
            onChangeText={setEmail}
            placeholder="johndoe123@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password Input */}
          <InputField
            label="Password (At least 8 characters)*"
            value={password}
            onChangeText={setPassword}
            placeholder="xxxxxxxx"
            isPassword={true}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/pages/SignIn2FP')}>
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <CustomButton
            title="Sign in"
            onPress={handleSignIn}
            type="primary"
          />

          {/* OR Separator */}
          <View style={styles.orSeparator}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          {/* Google Sign In */}
          <CustomButton
            title="Sign in with Google"
            onPress={() => { }}
            type="google"
            icon={require('../../assets/google-icon.png')}
          />


          {/* Sign Up Link moved higher */}
          <View style={[styles.signupContainer, { marginTop: 110, marginBottom: 0 }]}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/pages/SignUpScreen')}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 10,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -12,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
  },
  orSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.stroke,
  },
  orText: {
    marginHorizontal: 10,
    color: colors.secondaryText,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  signupText: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    marginBottom: 3,
  },
  signupLink: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSansBold,
    textAlign: 'center',
  },
  headerBackButton: {
    padding: 5,
  },
  headerBackIcon: {
    width: 24,
    height: 24,
  },
});

export default SignInScreen;