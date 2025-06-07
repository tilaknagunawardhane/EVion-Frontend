import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Platform, StatusBar, TouchableOpacity } from 'react-native';

// InputField import is already present below as:
// import InputField from '../components/InputField';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
// Make sure that '../components/CustomButton' exists and exports a valid component
import colors from '../../constants/color.js';
import fonts from '../../constants/fonts.js';


const ForgotPasswordScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const navigation = useNavigation();

  const handleRequestOTP = () => {
console.log('Requesting OTP for:', phoneNumber);
  };

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
        {/* Title */}
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your phone number to verify.</Text>

  {/* Phone Input */}
      <InputField
        label="Phone Number*"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="07X XXX XXXX"
        keyboardType="phone-pad"
        autoCapitalize="none"
      /> 
      {/* Request OTP Button */}
      <CustomButton title="Request OTP" onPress={handleRequestOTP} />
     

        
        {/* Sign Up Link moved higher */}
        <View style={[styles.signupContainer, { marginTop: 460, marginBottom: 0 }]}>
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

export default ForgotPasswordScreen;