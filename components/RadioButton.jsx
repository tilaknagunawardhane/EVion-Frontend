import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const RadioButton = ({ selected, onPress, label }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.outer, selected && styles.selectedOuter]}>
      {selected && <View style={styles.inner} />}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // horizontal
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 12,
  },
  outer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.secondaryText,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10, // add space from label
  },
  selectedOuter: {
    borderColor: colors.primary,
  },
  inner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  label: {
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    flex: 1,
    fontSize: 14,
  },
});

export default RadioButton;
