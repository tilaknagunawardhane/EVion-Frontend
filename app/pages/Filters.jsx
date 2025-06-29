import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { router } from 'expo-router';

import CustomButton from '../../components/CustomButton';
import FilterAppBar from '../../components/FilterAppBar';
import Checkbox from '../../components/Checkbox';
import RadioButton from '../../components/RadioButton';
import CustomSwitch from '../../components/CustomSwitch';

import colors from '../../constants/color';
import fonts from '../../constants/fonts';

const chargerTypeImages = {
  'Type 1 (SAE J1772) - AC': require('../../assets/type1.png'),
  'Type 2 (Mennekes) - AC': require('../../assets/type2.png'),
  'CCS Combo Type 1 - DC': require('../../assets/ccs1.png'),
  'CCS Combo Type 2 - DC': require('../../assets/ccs2.png'),
  'CHAdeMO': require('../../assets/chademo.png'),
  'Tesla': require('../../assets/tesla.png'),
};

const allowedChargingValues = [2, 7, 22, 50, 100, 150];

const FiltersScreen = () => {
  const [selectedChargerTypes, setSelectedChargerTypes] = useState([]);
  const [chargingPower, setChargingPower] = useState({ from: 22, to: 100 });
  const [priceRange, setPriceRange] = useState({ from: 0, to: 80 });
  const [availabilityOption, setAvailabilityOption] = useState(null);
  const [openHoursOption, setOpenHoursOption] = useState(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const availabilityOptions = [
    { label: 'Show only stations with available connectors', value: 'available' },
    { label: 'Show only bookings available stations', value: 'bookings' },
  ];

  const openHoursOptions = [
    { label: 'Open Now', value: 'openNow' },
    { label: '24/7 stations', value: 'open247' },
  ];

  const toggleChargerType = (type) => {
    if (selectedChargerTypes.includes(type)) {
      setSelectedChargerTypes(selectedChargerTypes.filter((t) => t !== type));
    } else {
      setSelectedChargerTypes([...selectedChargerTypes, type]);
    }
  };

  const handleApplyFilters = () => {
    router.push('/pages/No');
    console.log({
      selectedChargerTypes,
      chargingPower,
      priceRange,
      availabilityOption,
      openHoursOption,
      useCurrentLocation,
    });
  };

  const handleClearFilters = () => {
    setSelectedChargerTypes([]);
    setChargingPower({ from: 22, to: 100 });
    setPriceRange({ from: 0, to: 80 });
    setAvailabilityOption(null);
    setOpenHoursOption(null);
    setUseCurrentLocation(false);
  };

  const getChargingIndex = (val) => allowedChargingValues.indexOf(val);

  return (
    <View style={styles.container}>
      <FilterAppBar />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContent}>
          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <CustomSwitch
              value={useCurrentLocation}
              onValueChange={setUseCurrentLocation}
              label="Use my current location"
            />
          </View>

          {/* Charger Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Charger Type</Text>
            {Object.keys(chargerTypeImages).map((type) => (
              <View key={type} style={styles.chargerTypeContainer}>
                <Image source={chargerTypeImages[type]} style={styles.chargerTypeImage} resizeMode="contain" />
                <Text style={styles.chargerTypeText}>{type}</Text>
                <Checkbox
                  selected={selectedChargerTypes.includes(type)}
                  onPress={() => toggleChargerType(type)}
                />
              </View>
            ))}
          </View>

          {/* Charging Power */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Charging Power: {chargingPower.from} kW - {chargingPower.to} kW
            </Text>
            <MultiSlider
              values={[getChargingIndex(chargingPower.from), getChargingIndex(chargingPower.to)]}
              sliderLength={330}
              onValuesChange={(indices) => {
                setChargingPower({
                  from: allowedChargingValues[indices[0]],
                  to: allowedChargingValues[indices[1]],
                });
              }}
              min={0}
              max={allowedChargingValues.length - 1}
              step={1}
              snapped
              selectedStyle={{ backgroundColor: colors.primary }}
              unselectedStyle={{ backgroundColor: colors.stroke }}
              markerStyle={{ backgroundColor: colors.primary }}
            />
            <View style={styles.scaleRow}>
              {allowedChargingValues.map((val, index) => (
                <Text key={index} style={styles.scaleLabel}>
                  {val === 150 ? '150+' : val}
                </Text>
              ))}
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price per KW (LKR)</Text>
            <MultiSlider
              values={[priceRange.from, priceRange.to]}
              sliderLength={330}
              onValuesChange={(values) =>
                setPriceRange({ from: values[0], to: values[1] })
              }
              min={0}
              max={160}
              step={1}
              selectedStyle={{ backgroundColor: colors.primary }}
              unselectedStyle={{ backgroundColor: colors.stroke }}
              markerStyle={{ backgroundColor: colors.primary }}
            />
            <View style={styles.priceInputsRow}>
              <View style={styles.priceBox}>
                <Text style={styles.priceLabel}>From</Text>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.currency}>LKR</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={priceRange.from.toFixed(2)}
                    keyboardType="numeric"
                    onChangeText={(val) => {
                      let num = parseFloat(val);
                      if (!isNaN(num)) {
                        if (num < 0) num = 0;
                        if (num > priceRange.to) num = priceRange.to;
                        setPriceRange((prev) => ({ ...prev, from: num }));
                      }
                    }}
                  />
                </View>
              </View>

              <View style={styles.priceBox}>
                <Text style={styles.priceLabel}>To</Text>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.currency}>LKR</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={priceRange.to.toFixed(2)}
                    keyboardType="numeric"
                    onChangeText={(val) => {
                      let num = parseFloat(val);
                      if (!isNaN(num)) {
                        if (num > 160) num = 160;
                        if (num < priceRange.from) num = priceRange.from;
                        setPriceRange((prev) => ({ ...prev, to: num }));
                      }
                    }}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Availability */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            {availabilityOptions.map((option) => (
              <RadioButton
                key={option.value}
                selected={availabilityOption === option.value}
                onPress={() => setAvailabilityOption(option.value)}
                label={option.label}
              />
            ))}
          </View>

          {/* Open Hours */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Open Hours</Text>
            {openHoursOptions.map((option) => (
              <RadioButton
                key={option.value}
                selected={openHoursOption === option.value}
                onPress={() => setOpenHoursOption(option.value)}
                label={option.label}
              />
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Clear Filters"
              onPress={handleClearFilters}
              type="secondary"
              style={styles.clearButton}
              textStyle={{ color: colors.primary }}
            />
            <CustomButton
              title="Apply Filters"
              onPress={handleApplyFilters}
              type="primary"
              style={styles.applyButton}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContainer: { paddingBottom: 32 },
  mainContent: { paddingHorizontal: 24 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 12,
  },
  chargerTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  chargerTypeImage: { width: 40, height: 40, marginRight: 12 },
  chargerTypeText: {
    flex: 1,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    fontSize: 14,
  },
  priceInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  priceBox: {
    width: '48%',
  },
  priceLabel: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 13,
    color: colors.mainTextColor,
    marginBottom: 6,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  currency: {
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginRight: 8,
    fontSize: 14,
  },
  priceInput: {
    flex: 1,
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 14,
    color: colors.mainTextColor,
    padding: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    flex: 1,
    marginRight: 18,
    marginTop: 18,
    marginLeft: 18,
  },
  applyButton: {
    flex: 1,
    marginLeft: 10,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 8,
  },
  scaleLabel: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    textAlign: 'center',
    width: 40,
  },
});

export default FiltersScreen;
