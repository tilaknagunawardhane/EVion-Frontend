import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { API_BASE_URL } from '@env';
import useUserData from '../../../../hooks/useUserData';
import { storeUserData } from '../../../../services/authService';
import AppBar from '../../../../components/AppBar';
import CustomButton from '../../../../components/CustomButton';
import DropdownField from '../../../../components/DropdownField';
import InputField from '../../../../components/InputField';
import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';

const AddressScreen = () => {
  const [suite, setSuite] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('Colombo');
  const router = useRouter();
  const { user, refreshUserData } = useUserData();

    const handleDone = async () => {
      // validate required fields
      if (!street.trim() || !city.trim()) {
        Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: 'Please fill required fields' });
        return;
      }

      const payload = {
        apartment: suite,
        street_name: street,
        city: city,
        district: district,
      };

      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) throw new Error('Not authenticated');
        if (!user?._id) throw new Error('User not found');

        const response = await fetch(`${API_BASE_URL}/api/evowners/profile/${user._id}/address`, {
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
          console.warn('Non-JSON response posting address:', response.status, text);
          Toast.show({ type: ALERT_TYPE.ERROR, title: 'Error', textBody: `Server error (status ${response.status})` });
          return;
        }

        if (!response.ok) {
          Toast.show({ type: ALERT_TYPE.ERROR, title: 'Error', textBody: result.message || 'Failed to update address' });
          return;
        }

        // Try to persist returned user info if present
        const updated = result.data || result;
        try {
          await storeUserData(updated);
          if (typeof refreshUserData === 'function') await refreshUserData();
        } catch (err) {
          console.warn('Failed to persist updated user after address update:', err);
        }

        const fullAddress = `${suite}, ${street}, ${city}, ${district}`;
        Toast.show({ type: ALERT_TYPE.SUCCESS, title: 'Success', textBody: result.message || 'Address updated' });
        router.replace({ pathname: '/pages/Profile/Profile1', params: { homeAddress: fullAddress } });
      } catch (error) {
        console.error('Address update error:', error);
        Toast.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: error.message || 'Failed to update address' });
      }
    };

    return (
      <View style={styles.container}>
      <AppBar />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.mainContent}>
        <Text style={styles.title}>Complete your address</Text>
        <Text style={styles.subtitle}>Setup your address below</Text>

        <InputField
          label="Suit/Apartment(Optional)"
          value={suite}
          onChangeText={setSuite}
          placeholder="25"
        />
        <InputField
          label="Street Name*"
          value={street}
          onChangeText={setStreet}
          placeholder="Neelammahara Road"
        />
        <InputField
          label="City*"
          value={city}
          onChangeText={setCity}
          placeholder="Maharagama"
        />
        <DropdownField
          label="District*"
          value={district}
          selectedValue={district} // some implementations expect selectedValue
          // normalize different payload shapes (string, { value }, { label, value })
          onValueChange={(val) => {
          const selected = val && (val.value ?? val.label ?? val);
          setDistrict(selected ?? val);
          }}
          options={[
          'Colombo',
          'Gampaha',
          'Kalutara',
          'Kandy',
          'Matale',
          'Nuwara Eliya',
          'Galle',
          'Matara',
          'Hambantota',
          'Kurunegala',
          'Puttalam',
          ]}
          placeholder="Colombo"
        />
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <CustomButton title="Done" onPress={handleDone} style={styles.doneButton} />
      </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    scrollContainer: {
      flexGrow: 1,
      padding: 24,
    },
    mainContent: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#222',
      marginBottom: 4,
      fontFamily: fonts.bold,
    },
    subtitle: {
      fontSize: 14,
      color: colors.secondaryText,
      marginBottom: 24,
      fontFamily: fonts.medium,
    },
    buttonContainer: {
      padding: 16,
      backgroundColor: '#fff',
    },
    doneButton: {
      width: '100%',
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
    },
  });

  export default AddressScreen;