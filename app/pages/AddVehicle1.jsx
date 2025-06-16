import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppBar from '../../components/AppBar';
import CustomButton from '../../components/CustomButton';
import DropdownField from '../../components/DropdownField';
import InputField from '../../components/InputField';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import { router } from 'expo-router';

const AddVehicleScreen = () => {
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [manufactureYear, setManufactureYear] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  const navigation = useNavigation();

  const handleNext = () => {
    // Add form validation & submission logic here
    router.push('/pages/AddVehicle2'); // Update with your next screen path
  };

  return (
    <View style={styles.container}>
      <AppBar/>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.mainContent}>
          <Text style={styles.title}>Add Your EV</Text>
          <Text style={styles.subtitle}>Please enter the vehicle details.</Text>

          <View style={styles.progressBar}>
            <View style={styles.activeDot} />
            <View style={styles.inactiveDot} />
            <View style={styles.inactiveDot} />
            <View style={styles.inactiveDot} />
          </View>

          <Text style={styles.sectionTitle}>Vehicle Information</Text>

          <DropdownField
            label="Vehicle Make*"
            selectedValue={vehicleMake}
            onValueChange={setVehicleMake}
            placeholder="Select the make"
            options={['Audi', 'BMW', 'BYD', 'Hyundai', 'Kia', 'MG(Morris Garages)']} 
          />

          <DropdownField
            label="Vehicle Model*"
            selectedValue={vehicleModel}
            onValueChange={setVehicleModel}
            placeholder="Select the model"
            options={['Model 3', 'Model Y', 'Leaf', 'i3', 'Other']} 
          />

          <DropdownField
            label="Year of Manufacture*"
            selectedValue={manufactureYear}
            onValueChange={setManufactureYear}
            placeholder="Select the year"
            options={['2025', '2024', '2023', '2022', '2021', 'Other']}
          />

          <InputField
            label="Vehicle Type"
            value={vehicleType}
            onChangeText={setVehicleType}
            placeholder="Sedan, SUV, Hatchback etc."
          />

          <TouchableOpacity>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>

          <CustomButton title="Next" onPress={handleNext} type="primary" />
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
    paddingHorizontal: 24,
    paddingTop: 24,
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
  activeDot: {
    width: 34,
    height: 6,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  inactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 2,
    backgroundColor: colors.stroke,
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 12,
  },
  skipText: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 14,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    marginBottom: 5,
  },
});

export default AddVehicleScreen;
