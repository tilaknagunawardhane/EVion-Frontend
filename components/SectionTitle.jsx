import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SectionTitle = ({ title }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default SectionTitle;
