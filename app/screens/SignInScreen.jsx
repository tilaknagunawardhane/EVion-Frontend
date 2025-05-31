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

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const SignInScreen = () => {
  const [email, setEmail] = useState('johndoe123@gmail.com');
  const [password, setPassword] = useState('xxxxxxxx');

return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Please enter your details.</Text>
        <TextInput
            style={styles.input}
            placeholder="Email Address*"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
        />
        <TextInput
            style={styles.input}
            placeholder="Password (At least 8 characters)*"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#A0A0A0"
        />
        <TouchableOpacity style={styles.signInButton}>
            <Text style={styles.signInButtonText}>Sign in</Text>
        </TouchableOpacity>
        <View style={styles.orSeparator}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
        </View>
        <TouchableOpacity style={styles.googleButton}>
            <Image
                source={require('../../assets/google-icon.png')}
                style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity>
            <Text style={styles.signupText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
    </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 5,
  },
  backArrow: {
    fontSize: 18,
    color: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666666',
  },
  input: {
    height: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  signInButton: {
    backgroundColor: '#00C4B4',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  orSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  orText: {
    marginHorizontal: 10,
    color: '#666666',
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 8,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    marginBottom: 15,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
  signupText: {
    color: '#00C4B4',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default SignInScreen;