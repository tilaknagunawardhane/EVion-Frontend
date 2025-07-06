import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';
import CircularProgress from './CircularProgress';

const BatteryDisplay = ({ 
  percentage, 
  capacity = "0kWh", 
  size = 200, 
  showDetails = true 
}) => {
  return (
    <View style={styles.container}>
      <CircularProgress 
        percentage={percentage}
        size={size}
        additionalText={capacity}
      />
      
      {showDetails && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>
            Battery Level: {percentage}%
          </Text>
          <Text style={styles.detailText}>
            Capacity: {capacity}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  detailsContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginVertical: 2,
  },
});

export default BatteryDisplay;
