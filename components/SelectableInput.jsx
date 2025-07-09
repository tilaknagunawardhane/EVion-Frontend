// components/SelectableInput.js
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const SelectableInput = ({ icon, text, active, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        active ? styles.activeBox : styles.inactiveBox,
      ]}
      onPress={onPress}
    >
      <View style={styles.icon}>{icon}</View>
      <Text style={[styles.text, active ? styles.activeText : styles.inactiveText]}>
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
});

export default SelectableInput;
