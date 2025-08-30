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
import { useAuth } from '../../context/AuthContext'


const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const {login} = useAuth() // Remove backend login



  const handleSignIn = () => {
    setIsLoading(true);
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Signed In',
      textBody: 'You have signed in (no backend check).',
    });
    setTimeout(() => {
      router.replace('/(tabs)/map');
      setIsLoading(false);
    }, 1000);
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
            title={isLoading ? "Signing in..." : "Sign in"}
            onPress={handleSignIn}
            type="primary"
            disabled={isLoading}
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
    fontSize: 12,
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
    fontSize: 14,
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