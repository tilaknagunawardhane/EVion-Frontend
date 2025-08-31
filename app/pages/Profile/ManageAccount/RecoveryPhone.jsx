import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import colors from '../../../../constants/color';
import { useRouter } from 'expo-router';

const RecoveryPhoneScreen = () => {
  const [recoveryPhone, setRecoveryPhone] = useState('+94');

  const isRecoveryPhoneValid = () => {
    const cleanPhone = recoveryPhone.replace(/\s/g, '');
    return cleanPhone.length >= 12 && cleanPhone.startsWith('+94');
  };

  const handlePhoneChange = (text) => {
    if (text === '' || text === '+') {
      setRecoveryPhone(text);
      return;
    }
    let formatted = text;
    if (text.startsWith('+')) {
      formatted = '+' + text.slice(1).replace(/[^0-9]/g, '');
    } else {
      formatted = text.replace(/[^0-9]/g, '');
    }
    setRecoveryPhone(formatted);
  };

  const handleUpdate = () => {
    Alert.alert('Success', 'Recovery phone number updated successfully');
  };

  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Recovery Phone</Text>
      <Text style={styles.subtitle}>You'll use this number to recover your account</Text>
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Phone Number*</Text>
        <View style={[styles.inputFieldWrapper, { borderColor: isRecoveryPhoneValid() ? colors.primary : colors.secondaryText }]}>
          <TextInput
            value={recoveryPhone}
            onChangeText={handlePhoneChange}
            placeholder="+94"
            keyboardType="phone-pad"
            style={styles.inputField}
            maxLength={15}
            placeholderTextColor={colors.secondaryText}
          />
        </View>
      </View>
      <Text style={styles.note}>A verification code will be sent to this email</Text>
      <TouchableOpacity
        style={[styles.updateButton, { backgroundColor: isRecoveryPhoneValid() ? colors.primary : '#E0E0E0' }]}
        onPress={isRecoveryPhoneValid() ? handleUpdate : null}
        disabled={!isRecoveryPhoneValid()}
      >
        <Text style={[styles.updateButtonText, { color: isRecoveryPhoneValid() ? colors.background : colors.secondaryText }]}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 56,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.mainTextColor,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.mainTextColor,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    marginBottom: 32,
    alignSelf: 'flex-start',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 15,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  inputFieldWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
  },
  inputField: {
    fontSize: 17,
    color: colors.mainTextColor,
    minWidth: 220,
    fontWeight: '500',
  },
  note: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 28,
    alignSelf: 'flex-start',
  },
  updateButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RecoveryPhoneScreen;
