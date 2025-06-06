/*import { View, Text } from 'react-native'
import React from 'react'

const sample1 = () => {
  return (
    <View>
      <Text>sample1</Text>
    </View>
  )
}

export default <sample1></sample1>
*/
/*import { View, Text } from 'react-native'
import React from 'react'

const sample1 = () => {
  return (
    <View>
      <Text>sample1</Text>
    </View>
  )
}

export default <sample1></sample1>
*/
// app/pages/SignInScreen.jsx
/*import { View, Text } from 'react-native'
import React from 'react'

const sample1 = () => {
  return (
    <View>
      <Text>sample1</Text>
    </View>
  )
}

export default <sample1></sample1>
*/
// screens/SignInScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

const SignInScreen = () => {
  const [email, setEmail] = useState('johndoe123@gmail.com');
  const [password, setPassword] = useState('xxxxxxxx');
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../../assets/back-icon.png')}
            style={[styles.headerBackIcon, { tintColor: '#000' }]}
          />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#FFFFFF',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerLeftContainerStyle: {
        paddingLeft: 16,
      },
    });
  }, [navigation]);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'PlusJakartaSans-Regular': require('../../assets/fonts/PlusJakartaSans-Regular.ttf'),
          'PlusJakartaSans-Medium': require('../../assets/fonts/PlusJakartaSans-Medium.ttf'),
          'PlusJakartaSans-Bold': require('../../assets/fonts/PlusJakartaSans-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.mainContent}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: '#B2BEC3' }]}>Please enter your details.</Text>

        {/* Email Input */}
        <InputField
          label="Email Address*"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Input */}
        <InputField
          label="Password (At least 8 characters)*"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          
          isPassword={true}
          showPassword={showPassword}
          
          setShowPassword={setShowPassword}

          

          
        />

        <TouchableOpacity style={styles.forgotPassword}>
          
          <Text style={styles.forgotPasswordText}>Forgot Password</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <CustomButton
          title="Sign in"
          onPress={() => {}}
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
          onPress={() => {}}
          type="google"
          icon={require('../../assets/google-icon.png')}
        />
      </View>

      {/* Sign Up */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontFamily: 'PlusJakartaSans-Bold',
    marginBottom: 4,
    color: '#2D3436',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    marginBottom: 32,
    color: '#2D3436',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -12,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#00B894',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  orSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D1D1',
  },
  orText: {
    marginHorizontal: 10,
    color: '#2D3436',
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,  // Adjust this value as needed
    marginTop: 8,     // Add this to control spacing from the sign in button
    paddingHorizontal: 24,
  },
  signupText: {
    color: '#2D3436',
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  signupLink: {
    color: '#00B894',
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Regular',
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