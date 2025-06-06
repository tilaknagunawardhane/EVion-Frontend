import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DividerWithText = ({ text = 'or' }) => (
  <View style={styles.divider}>
    <View style={styles.line} />
    <Text style={styles.text}>{text}</Text>
    <View style={styles.line} />
  </View>
);

export default DividerWithText;

const styles = StyleSheet.create({
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  text: {
    marginHorizontal: 10,
    color: '#6B7280',
    fontSize: 13,
  },
});
