import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import colors from '../constants/color';

const Checkbox = ({ selected, onPress }) => (
  <TouchableOpacity style={[styles.checkbox, selected && styles.checkboxSelected]} onPress={onPress}>
    {selected && <Text style={styles.tick}>✓</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.secondaryText,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tick: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
  },
});

export default Checkbox;
