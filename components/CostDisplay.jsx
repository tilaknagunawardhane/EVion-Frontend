import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const CostDisplay = ({ 
  amount, 
  currency = "LKR", 
  size = "large",
  showLabel = true,
  label = "Total Cost"
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          amount: { fontSize: 18 },
          currency: { fontSize: 12 }
        };
      case "medium":
        return {
          amount: { fontSize: 24 },
          currency: { fontSize: 14 }
        };
      case "large":
      default:
        return {
          amount: { fontSize: 32 },
          currency: { fontSize: 16 }
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={styles.label}>{label}</Text>
      )}
      <Text style={[styles.costText, sizeStyles.amount]}>
        <Text style={[styles.currencyText, sizeStyles.currency]}>
          {currency}{' '}
        </Text>
        {amount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 8,
  },
  costText: {
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  currencyText: {
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
});

export default CostDisplay;
