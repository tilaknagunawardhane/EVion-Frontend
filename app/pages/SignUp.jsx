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
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
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
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signInText: {
    fontSize: 13,
    color: '#6B7280',
  },
  signInLink: {
    fontSize: 13,
    color: '#00B894',
    fontWeight: '600',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 30,
  },
  termsLink: {
    fontSize: 12,
    color: '#00B894',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
});
