import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const CustomSwitch = ({ value, onValueChange, label }) => {
  const [switchAnim] = useState(new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(switchAnim, {
      toValue: value ? 1 : 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = switchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // move knob from left to right
  });

  const backgroundColor = switchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.stroke, colors.primary],
  });

  const toggleSwitch = () => {
    onValueChange(!value);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={toggleSwitch} activeOpacity={0.8}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={[styles.switchTrack, { backgroundColor }]}>
        <Animated.View style={[styles.switchKnob, { transform: [{ translateX }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 14,
    marginRight: 12,
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  switchKnob: {
    width: 20,
    height: 20,
    backgroundColor: colors.background,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
});

export default CustomSwitch;
