import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
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

    const handleDone = () => {
      const fullAddress = `${suite}, ${street}, ${city}, ${district}`;
      router.replace({
        pathname: '/pages/Profile/Profile1',
        params: { homeAddress: fullAddress }
      });
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
              onValueChange={setDistrict}
              options={["Colombo", "Gampaha", "Kandy", "Galle", "Matara"]}
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
