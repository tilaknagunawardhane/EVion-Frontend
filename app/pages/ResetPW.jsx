import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import colors from '../../constants/color.js';
import fonts from '../../constants/fonts';
import AppBar from '../../components/AppBar';

const ResetPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <AppBar />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Create your new password.</Text>

          {/* Input Fields */}
          <InputField
            label="New Password*"
            value={password}
            onChangeText={setPassword}
            placeholder="XXXXXXXX"
            secureTextEntry={!showPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isPassword
          />

          <InputField
            label="Enter new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="XXXXXXXX"
            secureTextEntry={!showConfirmPassword}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
            isPassword
          />

          {/* Done Button */}
          <CustomButton title="Done" onPress={() => { /* Handle password reset */ }} />
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
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 40, // updated from 26 to 16
  },

});

export default ResetPasswordScreen;
