import React from 'react';
import { View, StyleSheet } from 'react-native';

const BottomStroke = () => {
  return <View style={styles.stroke} />;
};

export default BottomStroke;

const styles = StyleSheet.create({
  stroke: {
    marginTop: 24,
    height: 3.5,
    backgroundColor: '#000000',
    width: '40%',
    alignSelf: 'center',
    borderRadius: 1,
  },
});
