import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const PlugBox = ({ plug, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.plugBox, isSelected && styles.selectedPlugBox]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={plug.image} style={styles.plugImage} />
      <Text style={[styles.plugLabel, isSelected && styles.selectedPlugLabel]}>
        {plug.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  plugBox: {
    width: 106,         // Fixed width
    height: 100,   
    borderWidth: 1,   
    borderColor: colors.stroke,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  
  selectedPlugBox: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  plugImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  plugLabel: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
  selectedPlugLabel: {
    color: colors.primary,
    fontFamily: fonts.PlusJakartaSansBold,
  },
});

export default PlugBox;
