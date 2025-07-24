import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import RadioButton from '../../../components/RadioButton';
import CustomButton from '../../../components/CustomButton';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';


const LocationPermissionScreen = () => {
  const [selectedOption, setSelectedOption] = useState('whileUsing');

  const handleSave = () => {
    console.log('Selected:', selectedOption);
    
  };

  return (
    <View style={styles.container}>
      <View style={styles.indicator} />

      <Text style={styles.header}>Enable Your Location</Text>
      <Text style={styles.description}>
        Evion needs location access to recommend nearby charging stations and
        plan the best routes for your trip.
      </Text>

      <Image
        source={require('../../../assets/location.png')} // Update path if needed
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.radioGroup}>
        <RadioButton
          label="Allow only while using the app"
          selected={selectedOption === 'whileUsing'}
          onPress={() => setSelectedOption('whileUsing')}
        />
        <RadioButton
          label="Ask every time"
          selected={selectedOption === 'askEveryTime'}
          onPress={() => setSelectedOption('askEveryTime')}
        />
        <RadioButton
          label="Deny"
          selected={selectedOption === 'deny'}
          onPress={() => setSelectedOption('deny')}
        />
      </View>

      <CustomButton
        title="Save"
        onPress={handleSave}
        type="primary"
        style={styles.saveButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    height: 608,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: colors.mainTextColor,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginTop: 200,
  },
  indicator: {
    width: 48,
    height: 4,
    backgroundColor: colors.stroke,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 20,
    color: colors.mainTextColor,
    textAlign: 'center',
    marginBottom: 32,
  },
  description: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 14,
    color: colors.mainTextColor,
    textAlign: 'center',
    marginBottom: 32,
  },
  image: {
    width: '100%',
    height: 160,
    marginBottom: 32,
  },
  radioGroup: {
    marginBottom: 30,
    gap: 16, 
  },
  saveButton: {
    marginTop: 10,
    borderRadius: 14,
    width: '100%',
    alignSelf: 'center',
  },
});

export default LocationPermissionScreen;
