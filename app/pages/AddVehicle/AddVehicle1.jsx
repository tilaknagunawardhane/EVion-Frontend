import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppBar from '../../../components/AppBar';
import CustomButton from '../../../components/CustomButton';
import DropdownField from '../../../components/DropdownField';
import InputField from '../../../components/InputField';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import { router } from 'expo-router';
import { API_BASE_URL } from '@env';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

const AddVehicleScreen = () => {
  const [selectedMake, setSelectedMake] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [manufactureYear, setManufactureYear] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  const [dropdownData, setDropdownData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/vehicles/dropdowndata`);
        const data = await response.json();
        if (data.success) {
          setDropdownData(data.data);
        } else {
          console.error('Error fetching dropdown data');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleNext = () => {
    if (!selectedMake || !selectedModel || !manufactureYear) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Required Fields',
        textBody: 'Please fill all required fields',
      });
      return;
    }
    const yearValue = typeof manufactureYear === 'object'
      ? manufactureYear.value
      : manufactureYear;

    const vehicleData = {
      vehicleMakeId: selectedMake?._id,
      vehicleMake: selectedMake?.make,
      vehicleModelId: selectedModel?._id,
      vehicleModel: selectedModel?.model,
      manufactureYear: yearValue,
      colorId: selectedColor?._id,
      color: selectedColor?.color,
      vehicleType
    };

    router.push({
      pathname: '/pages/AddVehicle/AddVehicle2',
      params: vehicleData
    });
  };

  const handleSkip = () => {
    router.push('/(tabs)/map');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar />
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
            selectedValue={selectedMake}
            onValueChange={setSelectedMake}
            placeholder="Select the make"
            options={dropdownData?.vehicleMakes || []}
            displayProperty="make"
          />

          <DropdownField
            label="Vehicle Model*"
            selectedValue={selectedModel}
            onValueChange={setSelectedModel}
            placeholder="Select the model"
            options={dropdownData?.vehicleModels || []}
            displayProperty="model"
          />

          <DropdownField
            label="Year of Manufacture*"
            selectedValue={manufactureYear}
            onValueChange={(item) => setManufactureYear(typeof item === 'object' ? item.value : item)}
            placeholder="Select the year"
            options={['2025', '2024', '2023', '2022', '2021', 'Other'].map(year => ({
              label: year,
              value: year
            }))}
            displayProperty="label"
          />

          <InputField
            label="Vehicle Type"
            value={vehicleType}
            onChangeText={setVehicleType}
            placeholder="Sedan, SUV, Hatchback etc."
          />

          <DropdownField
            label="Color"
            selectedValue={selectedColor}
            onValueChange={setSelectedColor}
            placeholder="Select the EV color"
            options={dropdownData?.vehicleColors || []}
            displayProperty="color"
          />

          <TouchableOpacity onPress={handleSkip}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  skipText: {
    textAlign: 'center',
    marginVertical: 35,
    fontSize: 16,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    marginBottom: 5,
  },
});

export default AddVehicleScreen;