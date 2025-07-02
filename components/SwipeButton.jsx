import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const SwipeButton = ({ 
  text = "Swipe to start charging", 
  onSwipeComplete,
  navigateTo = '/pages/Charging',
  arrowDirection = 'right' // 'right' for StartChargeWalk-In, 'left' for Charging
}) => {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (onSwipeComplete) {
      onSwipeComplete();
    }
    // Add a small delay for visual feedback
    setTimeout(() => {
      router.push(navigateTo);
    }, 150);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleValue }] }]}>
        <TouchableOpacity
          style={[styles.button, isPressed && styles.buttonPressed]}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <Ionicons 
              name={arrowDirection === 'right' ? "arrow-forward" : "arrow-back"} 
              size={24} 
              color="white" 
            />
          </View>
          <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: colors.stroke, // Light gray background like in the image
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 50,
    elevation: 2,
    shadowColor: colors.stroke,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonPressed: {
    backgroundColor:colors.stroke,
  },
  text: {
    color: colors.mainTextColor,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    flex: 1,
    textAlign: 'center',
    marginLeft: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SwipeButton;


