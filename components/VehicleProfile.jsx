import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const VehicleProfile = ({ image, name }) => {
  return (
    <View style={styles.vehicleSection}>
      <View style={styles.vehicleIconCircle}>
        <Image
          source={image}
          style={styles.vehicleIcon}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.vehicleName}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  vehicleSection: {
    alignItems: 'flex-start',
    marginBottom: 3,
    marginLeft: 0,
  },
  vehicleIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  vehicleIcon: {
    height: 28,
    tintColor: colors.primary,
  },
  vehicleName: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 12,
    color: colors.mainTextColor,
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default VehicleProfile;
