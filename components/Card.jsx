import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const VehicleCard = ({ name, type, image, selected, onPress, isBYD }) => {
  return (
    <TouchableOpacity
      style={[styles.vehicleCard, selected && styles.selectedCard]}
      onPress={onPress}
    >
      {isBYD ? (
        <View style={styles.iconWrapper}>
          <Image source={image} style={styles.bydIcon} />
        </View>
      ) : (
        <Image source={image} style={styles.vehicleImage} />
      )}
      <Text style={styles.vehicleText}>{name} {type ? `(${type})` : ''}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  vehicleCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.stroke,
    alignItems: 'center',
    backgroundColor: colors.background,
    marginRight: 12,
    width: 118,
    height: 134,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  vehicleImage: {
    width: 76,
    height: 76,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  iconWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E6F7F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  bydIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  vehicleText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansMedium,
    textAlign: 'center',
  },
});

export default VehicleCard;
