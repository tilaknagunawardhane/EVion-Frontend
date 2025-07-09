import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const SlotItem = ({
  type = 'inactive', // 'current', 'selectable', or 'disabled'
  time,
  remaining,
  isSelected = false,
  onPress,
}) => {
  if (type === 'current') {
    return (
      <View style={styles.currentSlot}>
        <Text style={styles.currentSlotText}>
          {time} <Text style={styles.remainingTime}>{remaining}</Text>
        </Text>
      </View>
    );
  }

  if (type === 'disabled') {
    return (
      <View style={styles.disabledSlot}>
        <Text style={styles.disabledText}>{time}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.slotOption, isSelected && styles.selectedSlot]}
      onPress={onPress}
    >
      <Text style={[styles.slotText, isSelected && styles.selectedSlotText]}>{time}</Text>
    </TouchableOpacity>
  );
};

export default SlotItem;

const styles = StyleSheet.create({
  currentSlot: {
    borderColor: colors.HighlightText,
    backgroundColor: '#FFF6EB',
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  currentSlotText: {
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 14,
    color: colors.HighlightText,
  },
  remainingTime: {
    fontFamily: fonts.PlusJakartaSans,
    color: colors.HighlightText,
  },
  slotOption: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  selectedSlot: {
    backgroundColor: '#E6F9F4',
    borderColor: colors.primary,
  },
  slotText: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 14,
    color: colors.mainTextColor,
  },
  selectedSlotText: {
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 14,
    color: colors.primary,
  },
  disabledSlot: {
    backgroundColor: colors.stroke,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  disabledText: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 14,
    color: colors.secondaryText,
  },
});
