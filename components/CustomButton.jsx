import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';

const CustomButton = ({
  title,
  onPress,
  type = 'primary',
  icon,
  style,
  textStyle,
}) => {
  const buttonStyles = {
    primary: styles.primaryButton,
    secondary: styles.secondaryButton,
    google: styles.googleButton,
  };

  const textStyles = {
    primary: styles.primaryButtonText,
    secondary: styles.secondaryButtonText,
    google: styles.googleButtonText,
  };

  return (
    <TouchableOpacity
      style={[buttonStyles[type], style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && <Image source={icon} style={styles.buttonIcon} />}
      <Text style={[textStyles[type], textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
  

};

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: '#00B894',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#D1D1D1',
    borderWidth: 1,
  },
  secondaryButtonText: {
    color: '#2D3436',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 8,
    borderColor: '#D1D1D1',
    borderWidth: 1,
    marginBottom: 32,
  },
  googleButtonText: {
    color: '#2D3436',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
});

export default CustomButton;