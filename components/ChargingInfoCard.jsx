import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const ChargingInfoCard = ({ items }) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoRow}>
        {items.map((item, index) => (
          <View key={index} style={styles.infoItem}>
            <View style={styles.iconRow}>
              <Ionicons 
                name={item.icon} 
                size={16} 
                color={colors.secondaryText} 
              />
              <Text style={styles.infoLabel}>{item.label}</Text>
            </View>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    marginVertical: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  infoItem: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 6,
    padding: 8,
    paddingLeft: 18,
    shadowColor:colors.stroke,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 10,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginLeft: 3,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
});

export default ChargingInfoCard;
