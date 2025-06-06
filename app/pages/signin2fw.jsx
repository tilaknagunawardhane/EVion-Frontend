import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleOTPRequest = () => {
    // Add OTP request logic here
    console.log('Requesting OTP for:', phoneNumber);
  };

  return (
    
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
     /* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Heading */}
     /* <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your phone number to verify.</Text>

      {/* Phone Number Input */}
     /* <Text style={styles.label}>Phone Number*</Text>
      <TextInput
        style={styles.input}
        placeholder="07X XXX XXXX"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      {/* Request OTP Button */}
      /*<TouchableOpacity style={styles.otpButton} onPress={handleOTPRequest}>
        <Text style={styles.otpButtonText}>Request OTP</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      /*<View style={styles.footer}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  otpButton: {
    backgroundColor: '#00C291',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  otpButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  signUpText: {
    color: '#00C291',
    fontWeight: '600',
  },
});

