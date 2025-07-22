import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CircularProgress = ({ 
  capacity,
  percentage, 
  size = SCREEN_WIDTH * 0.5, // Default to 50% of screen width
  strokeWidth = 12, 
  progressColor = colors.primary,
  backgroundColor = colors.stroke,
  showPercentage = true,
  additionalText = '',
  activeColor = colors.primary
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (capacity / 100) * circumference;

  // Responsive font sizes
  const percentageFontSize = size * 0.24;
  const symbolFontSize = size * 0.12;
  const additionalTextFontSize = size * 0.07;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.2}
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={activeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      {showPercentage && (
        <View style={styles.textContainer}>
          <View style={styles.percentageContainer}>
            <Text style={[
              styles.percentageText,
              { fontSize: percentageFontSize, lineHeight: percentageFontSize }
            ]}>
              {Math.floor(capacity)}
            </Text>
            <Text style={[
              styles.percentageSymbol,
              { fontSize: symbolFontSize, marginTop: percentageFontSize * 0.1 }
            ]}>
              kwh
            </Text>
          </View>
          {additionalText && (
            <Text style={[
              styles.additionalText,
              { fontSize: additionalTextFontSize }
            ]}>
              {/* {additionalText} */}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  percentageText: {
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    fontWeight: '700',
  },
  percentageSymbol: {
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginLeft: 2,
  },
  additionalText: {
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginTop: 8,
  },
});

export default CircularProgress;