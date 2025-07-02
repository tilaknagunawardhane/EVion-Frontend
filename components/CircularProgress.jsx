import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const CircularProgress = ({ 
  percentage, 
  size = 200, 
  strokeWidth = 8, 
  progressColor = colors.primary,
  backgroundColor = colors.stroke,
  showPercentage = true,
  additionalText = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;

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
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
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
            <Text style={styles.percentageText}>{percentage}</Text>
            <Text style={styles.percentageSymbol}>%</Text>
          </View>
          {additionalText && (
            <Text style={styles.additionalText}>{additionalText}</Text>
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
    zIndex: 1,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  percentageText: {
    fontSize: 48,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    lineHeight: 48,
  },
  percentageSymbol: {
    fontSize: 24,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginTop: 5,
    marginLeft: 2,
  },
  additionalText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginTop: 8,
  },
});

export default CircularProgress;
