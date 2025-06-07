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
import { View, Text, StyleSheet, Image, Platform, StatusBar, TouchableOpacity } from 'react-native';

// InputField import is already present below as:
// import InputField from '../components/InputField';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import colors from '../../constants/color.js';
import fonts from '../../constants/fonts.js';


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

  // Removed useEffect for header customization.
  // Header and navigation options should be set in your navigator (e.g., in your stack navigator file).
 
  // Connect InputField and CustomButton from their respective files
  // (Already imported above as InputField and CustomButton)
  // Font loading logic removed. 
  // Make sure to load fonts in your app entry point (e.g., App.js) using Font.loadAsync or useFonts from expo-font.

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText } ]}>Please enter your details.</Text>

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
          <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password</Text>
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

        {/* Sign Up Link moved higher */}
        <View style={[styles.signupContainer, { marginTop: 200, marginBottom: 0 }]}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background ,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.PlusJakartaSansBold, // Use font from fonts.js
    marginBottom: 4,
    color: colors.mainTextColor ,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans, // Use font from fonts.js
    marginBottom: 32,
    color: colors.secondaryText,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -12,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: colors.primary ,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans, // Use font from fonts.js
  },
  orSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.secondaryText ,
  },
  orText: {
    marginHorizontal: 10,
    color: colors.mainTextColor ,
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans, // Use font from fonts.js
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 8,
    paddingHorizontal: 24,
  },
  signupText: {
    color: colors.textPrimary ,
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans, // Use font from fonts.js
  },
  signupLink: {
    color: colors.primary ,
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans, // Use font from fonts.js
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