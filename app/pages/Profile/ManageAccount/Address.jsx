import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  const [district, setDistrict] = useState('');

  const navigation = useNavigation();

  const handleDone = () => {
    // You can pass address data back if needed
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <AppBar />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.mainContent}>
          <Text style={styles.title}>Complete your Address</Text>
          <Text style={styles.subtitle}>Setup your address below.</Text>

          <InputField
            label="Suit/Apartment (Optional)"
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
            selectedValue={district}
            onValueChange={setDistrict}
            placeholder="Colombo"
            options={["Colombo", "Kandy", "Anuradhapura", "Other"]}
          />

          <CustomButton title="Done" onPress={handleDone} type="primary" />
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
  scrollContainer: {
    paddingBottom: 20,
    marginBottom: 70,
  },
  mainContent: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    marginBottom: 20,
  },
  progressBar: {
    flexDirection: 'row',
    marginBottom: 24,
  },
});

export default AddressScreen;
