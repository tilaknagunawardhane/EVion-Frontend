import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import AppBar from '../../../components/AppBar';
import CustomButton from '../../../components/CustomButton';
import DropdownField from '../../../components/DropdownField';
import InputField from '../../../components/InputField';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

const AddEVScreen = () => {
  const params = useLocalSearchParams();
  const [batteryCapacity, setBatteryCapacity] = useState('');
  const [batteryHealth, setBatteryHealth] = useState('');
  const [chargingPowerAC, setChargingPowerAC] = useState('');
  const [chargingPowerDC, setChargingPowerDC] = useState('');
  // const [passengers, setPassengers] = useState('');
  
  // Error states
  const [errors, setErrors] = useState({
    batteryCapacity: '',
    chargingPowerAC: '',
    chargingPowerDC: '',
    batteryHealth: ''
  });

  const selectedPlugIds = params.selectedPlugIds
    ? JSON.parse(params.selectedPlugIds)
    : [];

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

  const validateInputs = () => {
    const newErrors = {
      batteryCapacity: '',
      chargingPowerAC: '',
      chargingPowerDC: '',
      batteryHealth: ''
    };
    let isValid = true;

    // Battery Capacity validation
    if (!batteryCapacity) {
      newErrors.batteryCapacity = 'Battery capacity is required';
      isValid = false;
    } else if (isNaN(batteryCapacity)) {
      newErrors.batteryCapacity = 'Must be a number';
      isValid = false;
    } else if (parseFloat(batteryCapacity) <= 0) {
      newErrors.batteryCapacity = 'Must be greater than 0';
      isValid = false;
    }

    // AC Charging validation
    if (!chargingPowerAC) {
      newErrors.chargingPowerAC = 'AC charging power is required';
      isValid = false;
    } else if (isNaN(chargingPowerAC)) {
      newErrors.chargingPowerAC = 'Must be a number';
      isValid = false;
    } else {
      const acValue = parseFloat(chargingPowerAC);
      if (acValue < 7 || acValue > 11) {
        newErrors.chargingPowerAC = 'Must be between 7-11 kW';
        isValid = false;
      }
    }

    // DC Charging validation
    if (!chargingPowerDC) {
      newErrors.chargingPowerDC = 'DC charging power is required';
      isValid = false;
    } else if (isNaN(chargingPowerDC)) {
      newErrors.chargingPowerDC = 'Must be a number';
      isValid = false;
    } else {
      const dcValue = parseFloat(chargingPowerDC);
      if (dcValue < 50 || dcValue > 350) {
        newErrors.chargingPowerDC = 'Must be between 50-350 kW';
        isValid = false;
      }
    }

    // Battery Health validation (optional)
    if (batteryHealth && !isNaN(batteryHealth)) {
      const healthValue = parseFloat(batteryHealth);
      if (healthValue < 1 || healthValue > 100) {
        newErrors.batteryHealth = 'Must be between 1-100%';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateInputs()) {
      router.push({
        pathname: '/pages/AddVehicle/addedvprofile',
        params: {
          // Previous params
          ...params,
          selectedPlugIds: JSON.stringify(selectedPlugIds),
          
          // New params
          batteryCapacity,
          batteryHealth: batteryHealth || '0',
          chargingPowerAC,
          chargingPowerDC,
          // passengers: passengers || '0'
        }
      });
    } else {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Validation Error',
        textBody: 'Please fix the errors before proceeding',
      });
    }
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

          <InputField
            label="Battery Capacity (kWh)*"
            value={batteryCapacity}
            onChangeText={setBatteryCapacity}
            placeholder="100"
            keyboardType="numeric"
            error={errors.batteryCapacity}
          />
          
          <InputField
            label="Max AC Charging Power (kW)*"
            value={chargingPowerAC}
            onChangeText={setChargingPowerAC}
            placeholder="7"
            keyboardType="numeric"
            error={errors.chargingPowerAC}
          />
          
          <InputField
            label="Max DC Charging Power (kW)*"
            value={chargingPowerDC}
            onChangeText={setChargingPowerDC}
            placeholder="150"
            keyboardType="numeric"
            error={errors.chargingPowerDC}
          />
          
          <InputField
            label="Current Battery Health %"
            value={batteryHealth}
            onChangeText={setBatteryHealth}
            placeholder="80"
            keyboardType="numeric"
            error={errors.batteryHealth}
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