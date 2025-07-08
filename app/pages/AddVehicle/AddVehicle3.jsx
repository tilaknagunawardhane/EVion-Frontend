import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AppBar from '../../../components/AppBar';
import CustomButton from '../../../components/CustomButton';
import DropdownField from '../../../components/DropdownField';
import InputField from '../../../components/InputField';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

const AddEVScreen = () => {
  const params = useLocalSearchParams();
  const [batteryCapacity, setBatteryCapacity] = useState('');
  const [batteryHealth, setBatteryHealth] = useState('');
  const [chargingPower, setChargingPower] = useState('');
  const [passengers, setPassengers] = useState('');

   const selectedPlugIds = params.selectedPlugIds 
    ? JSON.parse(params.selectedPlugIds) 
    : [];

  // Access all parameters
  const {
    vehicleMakeId,
    vehicleMake,
    vehicleModelId,
    vehicleModel,
    manufactureYear,
    colorId,
    color,
    vehicleType
  } = params;

  // console.log('All received params:', {
  //   vehicleMakeId,
  //   vehicleMake,
  //   vehicleModelId,
  //   vehicleModel,
  //   manufactureYear,
  //   colorId,
  //   color,
  //   vehicleType,
  //   selectedPlugIds
  // });

  const handleNext = () => {
    router.push('/pages/AddVehicle/addedvprofile');
  };

  return (
    <View style={styles.container}>
      <AppBar />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
      >
        <View style={styles.mainContent}>
          <Text style={styles.title}>Add Your EV</Text>
          <Text style={styles.subtitle}>Please enter the vehicle details.</Text>

          <View style={styles.progressBar}>
            <View style={styles.inactiveDot} />
            <View style={styles.inactiveDot} />
            <View style={styles.activeDot} />
            <View style={styles.inactiveDot} />
          </View>

          <Text style={styles.sectionTitle}>Battery & Performance</Text>

          <DropdownField
            label="Battery Capacity(kWh)*"
            selectedValue={batteryCapacity}
            onValueChange={setBatteryCapacity}
            placeholder="Select the battery capacity"
            options={['61.4 kWh', '82.5 kWh']}
          />

          <InputField
            label="Current Battery Health %"
            value={batteryHealth}
            onChangeText={setBatteryHealth}
            placeholder="99"
            keyboardType="numeric"
          />

          <InputField
            label="Max Charging Power (kW)"
            value={chargingPower}
            onChangeText={setChargingPower}
            placeholder="170"
            keyboardType="numeric"
          />

          <InputField
            label="Usual Passengers"
            value={passengers}
            onChangeText={setPassengers}
            placeholder="4"
            keyboardType="numeric"
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <CustomButton title="Next" onPress={handleNext} type="primary" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingBottom: 34,
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
  activeDot: {
    width: 34,
    height: 6,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  inactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 8,
    backgroundColor: colors.stroke,
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 12,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: colors.background,
  },
});

export default AddEVScreen;
