// components/SelectableInput.js
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const SelectableInput = ({ icon, text, active, onPress, disabled = false }) => {
  
  const isFilled = !!text && !text.toLowerCase().startsWith("select"); // crude check for "Select …" placeholder
  return (
    <TouchableOpacity
      style={[
        styles.container,
        active ? styles.activeBox : styles.inactiveBox,
        isFilled && styles.filledBox,
        disabled && styles.disabledBox, // apply disabled style if true
      ]}
      onPress={onPress}
      disabled={disabled} // prevent press if disabled
    >
      <View style={styles.icon}>{icon}</View>
      <Text
        style={[
          styles.text,
          active ? styles.activeText : styles.inactiveText,
          isFilled && styles.filledText,  // NEW
          disabled && styles.disabledText,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  icon: {
    marginRight: 10,
  },
  activeBox: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.primary,
  },
  inactiveBox: {
    backgroundColor: colors.white,
    borderColor: colors.stroke,
  },
  disabledBox: {
    backgroundColor: colors.lightestGray,
    borderColor: colors.lightestGray,
    opacity: 0.6,
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  activeText: {
    color: colors.primary,
  },
  inactiveText: {
    color: colors.secondaryText,
  },
  disabledText: {
    color: colors.secondaryText,
  },
//   filledBox: {
//   borderColor: colors.primary,
//   backgroundColor: colors.primary + '10', // subtle tint
// },

filledText: {
  color: colors.mainTextColor, // or colors.primary if you want emphasis
},

});

export default SelectableInput;
