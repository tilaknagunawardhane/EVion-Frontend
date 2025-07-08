import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const VehicleCard = ({ vehicle, selected }) => {
  return (
    <View style={[styles.card, selected && styles.selectedCard]}>
      <View style={styles.topRow}>
        <Image source={vehicle.image} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{vehicle.name}</Text>
          <Text style={styles.year}>{vehicle.year}</Text>
          <Text style={styles.details}>Battery Capacity: {vehicle.battery}</Text>
          <Text style={styles.details}>Charging Power DC: {vehicle.max_power_DC}</Text>
          <Text style={styles.details}>Charging Power AC: {vehicle.max_power_AC}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.portRow}>
        {vehicle.ports.map((port, index) => (
          <View key={index} style={styles.portItem}>
            <MaterialCommunityIcons name={port.icon} size={20} color={colors.black} />
            <Text style={styles.portLabel}>{port.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default VehicleCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSansSemiBold,
    color: colors.mainTextColor,
  },
  year: {
    fontSize: 13,
    color: colors.secondaryText,
  },
  details: {
    fontSize: 13,
    color: colors.secondaryText,
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightestGray,
    marginVertical: 10,
  },
  portRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  portItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  portLabel: {
    marginLeft: 4,
    fontSize: 12,
    color: colors.mainTextColor,
    alignItems: 'center',
  },
});
