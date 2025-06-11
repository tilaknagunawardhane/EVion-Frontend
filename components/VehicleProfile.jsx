import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const VehicleProfile = () => {
  return (
    <View style={styles.vehicleSection}>
      <View style={styles.vehicleIconCircle}>
        <Image
          source={require('../assets/car.png')}
          style={styles.vehicleIcon}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.vehicleName}>BYD Atto 3{'\n'}(SUV)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  vehicleSection: {
    alignItems: 'flex-start', // Aligns the whole block to the left
    marginBottom:3, // Reduced gap from next section
    marginLeft:-4, // Same left margin as your page padding
  },
  vehicleIconCircle: {
    width: 60, // Smaller circle
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:6, // Small gap between image and text
  },
  vehicleIcon: {
     // Reduced car icon size
        height: 28,
        tintColor: colors.primary,
      },
      vehicleName: {
        fontFamily: fonts.PlusJakartaSans,
        fontSize: 12,
        color: colors.mainTextColor,
        lineHeight: 20,
        textAlign: 'center', // Center text under image
  },
});

export default VehicleProfile;

