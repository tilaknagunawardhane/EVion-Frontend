import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';

const VehicleInfo = ({ duration, distance, vehicleModel, batteryLevel, startAddress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{duration}</Text>
      </View>
      
      <View style={styles.detailsRow}>
        <Text style={styles.distanceText}>{distance}</Text>
        <View style={styles.vehicleTag}>
          <Text style={styles.vehicleText}>{vehicleModel}</Text>
        </View>
        <View style={styles.batteryTag}>
          <Text style={styles.batteryText}>{batteryLevel}</Text>
        </View>
      </View>
      
      <View style={styles.addressRow}>
        <MaterialIcons name="location-on" size={16} color={colors.primary} />
        <Text style={styles.addressText} numberOfLines={1}>{startAddress}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  timeContainer: {
    marginBottom: 5,
  },
  timeText: {
    fontSize: 24,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  distanceText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginRight: 10,
  },
  vehicleTag: {
    backgroundColor: '#E3F2FD',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  vehicleText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: '#0D47A1',
  },
  batteryTag: {
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  batteryText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: '#2E7D32',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 10,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    marginLeft: 8,
  },
});

export default VehicleInfo;