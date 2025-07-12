import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const { width } = Dimensions.get('window');

const VehicleProfile = ({ image, name }) => {
  return (
    <View style={styles.container}>
      <View style={styles.vehicleCard}>
        <View style={styles.imageContainer}>
          <Image
            source={image}
            style={styles.vehicleImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.vehicleName} numberOfLines={2}>
          {name}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  vehicleCard: {
    alignItems: 'center',
    width: width * 0.23, // 25% of screen width
    maxWidth: 120, // Maximum size for larger screens
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Add background if needed
    marginBottom: 8,
  },
  vehicleImage: {
    width: '70%', // Relative to container
    height: '70%',
    tintColor: colors.primary,
  },
  vehicleName: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 12,
    color: colors.mainTextColor,
    textAlign: 'center',
    lineHeight: 16,
    width: '100%', // Ensure text container takes full width
  },
});

export default VehicleProfile;