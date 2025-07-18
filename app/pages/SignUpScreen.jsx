import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import AppBar from '../../components/AppBar';
import colors from '../../constants/color.js';
import fonts from '../../constants/fonts.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { API_BASE_URL } from '@env'; // Ensure you have the correct path to your .env file
import { useAuth } from '../../context/AuthContext'

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const { register } = useAuth();

  const handleSignUp = async () => {
    if (!name) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Please enter your name.',
      });
      return;
    } else if (!email) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Please enter your email address.',
      });
      return;
    } else if (!password || password.length < 8) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Please enter a valid password (at least 8 characters).',
      });
      console.log('Password validation failed');
      return;
    }
    setIsLoading(true);

    try {
      const result = await register(name, email, password, 'evOwner')

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: 'You have signed up successfully!',
      });

      console.log('User signed up successfully:', result.user);

      // await SecureStore.setItemAsync('isSignupFlow', 'true');
await AsyncStorage.setItem('isSignupFlow', 'true');
      setTimeout(() => {
        router.replace('/pages/AddVehicle/AddVehicle1');
      }, 1500);
    } catch (error) {
      console.error('Error during sign-up:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An unexpected error occurred. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <AppBar buttonVisibility={false} />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.mainContent}>
          <Text style={styles.title}>Let's Get Started</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Welcome! Please enter your details.</Text>

          <InputField
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="John Doe"
          />

          <InputField
            label="Email Address*"
            value={email}
            onChangeText={setEmail}
            placeholder="johndoe123@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            label="Password (At least 8 characters)*"
            value={password}
            onChangeText={setPassword}
            placeholder="xxxxxxxx"
            isPassword={true}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          <CustomButton
            title={isLoading ? "Creating account..." : "Sign up"}
            onPress={handleSignUp}
            type="primary"
            style={styles.signUpButton}
            disabled={isLoading}
          />

          <View style={styles.orSeparator}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          <CustomButton
            title="Sign up with Google"
            onPress={() => { }}
            type="google"
            icon={require('../../assets/google-icon.png')}
          />

          <View style={styles.signinContainer}>
            <Text style={styles.signinText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/pages/SignInScreen')}>
              <Text style={styles.signinLink}>Sign in</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>By signing up, you agree to our</Text>

            <TouchableOpacity onPress={() => router.push('/pages/Profile/PrivacyPolicy')}>
              <Text style={styles.linkText}>Terms & Privacy Policy</Text>
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
    paddingBottom: 20,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.PlusJakartaSansBold,
    marginBottom: 4,
    color: colors.mainTextColor,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSans,
    marginBottom: 32,
    color: colors.secondaryText,
  },
  signUpButton: {
    marginTop: 3,
    marginBottom: 3,
  },
  orSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
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
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
    marginBottom: 50,
  },
  signinText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
  },
  signinLink: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  termsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 3,
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    textAlign: 'center',
  },
});

export default SignUpScreen;