import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { API_BASE_URL } from '@env';
import useUserData from '../../../hooks/useUserData';
import { storeUserData } from '../../../services/authService';
import colors from '../../../constants/color';
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

  const { user, refreshUserData } = useUserData();
  const router = useRouter();

  const handleUpdate = async () => {
    if (!isRecoveryPhoneValid()) return;
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) throw new Error('Not authenticated');

      // Resolve user id: prefer hook, else fall back to SecureStore stored values
      let userId = user && user._id ? user._id : null;
      if (!userId) {
        const storedId = await SecureStore.getItemAsync('userID');
        if (storedId) userId = storedId;
        else {
          const storedUser = await SecureStore.getItemAsync('user');
          if (storedUser) {
            try {
              const parsed = JSON.parse(storedUser);
              if (parsed && parsed._id) {
                userId = parsed._id;
                // persist userID for future quick loads
                await SecureStore.setItemAsync('userID', String(parsed._id));
              }
            } catch (err) {
              // ignore parse error
            }
          }
        }
      }

      if (!userId) throw new Error('User not found');

      const payload = { recovery_phone: recoveryPhone, recoveryPhone };
      // Debug: log userId and payload (do NOT log token)
      console.debug('Recovery phone request:', { userId, payload });

      const response = await fetch(`${API_BASE_URL}/api/evowners/profile/${userId}/recovery-phone`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let result = {};
      try {
        result = text ? JSON.parse(text) : {};
      } catch (err) {
        // Log full text for debugging and show more informative toast
        console.error('Non-JSON response updating recovery phone:', response.status, text);
        const short = text && text.length > 200 ? text.slice(0, 200) + '...' : text;
        Toast.show({ type: ALERT_TYPE.DANGER, title: 'Server Error', textBody: `Server returned unexpected response (status ${response.status}): ${short}` });
        return;
      }

      if (!response.ok) {
        const msg = result && (result.message || result.error) ? (result.message || result.error) : `Failed to update recovery phone (status ${response.status})`;
        console.error('Recovery phone update failed:', response.status, result);
        Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: msg });
        return;
      }

      // Persist if returned - merge with existing user so we don't lose _id or other fields
      try {
        const updated = result.data || result;
        // If backend returned a partial object (e.g., only recovery_phone), merge with current user
        const mergedUser = {
          ...(user || {}),
          ...(updated || {}),
        };
        await storeUserData(mergedUser);
        if (typeof refreshUserData === 'function') await refreshUserData();
      } catch (err) {
        console.warn('Failed to persist user after recovery phone update:', err);
      }

      Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Success', textBody: result.message || 'Recovery phone updated' });
      // Navigate to Profile1 Security tab
      router.push({ pathname: '/pages/Profile/Profile1', params: { activeTab: 'Security' } });
    } catch (error) {
      console.error('Update recovery phone error:', error);
      // If it's a fetch/response error it might include a 'message' or 'stack'
      const msg = error && error.message ? error.message : 'Failed to update recovery phone';
      Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: msg });
    }
  };
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