import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';

import CustomInput from '../../components/CustomInput';
import PasswordInput from '../../components/PasswordInput';
import DividerWithText from '../../components/DividerWithText';
import BottomStroke from '../../components/BottomStroke';
import CustomButton from '../../components/CustomButton';

import colors from '../../constants/colors';
import fonts from '../../constants/fonts';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handlePress = () => {
    console.log('Sign Up Pressed');
    console.log(`Name: ${name}, Email: ${email}, Password: ${password}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <Text style={styles.heading}>Let’s Get Started</Text>
      <Text style={styles.subheading}>Welcome! Please enter your details.</Text>

      <CustomInput
        label="Name"
        placeholder="John Doe"
        value={name}
        onChangeText={setName}
      />

      <CustomInput
        label="Email Address*"
        placeholder="johndoe123@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <PasswordInput
        label="Password (At least 8 characters)*"
        value={password}
        onChangeText={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <CustomButton title="Sign up" onPress={handlePress} />

      <DividerWithText />

      <TouchableOpacity style={styles.googleButton} onPress={handlePress}>
        <Image
          source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }}
          style={styles.googleLogo}
        />
        <Text style={styles.googleText}>Sign up with Google</Text>
      </TouchableOpacity>

      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => console.log('Navigate to SignIn')}>
          <Text style={styles.signInLink}>Sign in</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>By signing up, you agree to our</Text>
      <TouchableOpacity onPress={() => console.log('Navigate to Terms')}>
        <Text style={styles.termsLink}>Terms & Privacy Policy</Text>
      </TouchableOpacity>

      <BottomStroke />
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 6,
    fontFamily: fonts.PlusJakartaSans,
  },
  subheading: {
    fontSize: 14,
    color: colors.textColor,
    marginBottom: 24,
    fontFamily: fonts.PlusJakartaSans,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.darkGray,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    fontFamily: fonts.PlusJakartaSans,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signInText: {
    fontSize: 13,
    color: colors.textColor,
    fontFamily: fonts.PlusJakartaSans,
  },
  signInLink: {
    fontSize: 13,
    color: colors.green,
    fontWeight: '600',
    fontFamily: fonts.PlusJakartaSans,
  },
  footerText: {
    fontSize: 12,
    color: colors.darkGray,
    textAlign: 'center',
    marginTop: 30,
    fontFamily: fonts.PlusJakartaSans,
  },
  termsLink: {
    fontSize: 12,
    color: colors.green,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
    fontFamily: fonts.PlusJakartaSans,
  },
});
