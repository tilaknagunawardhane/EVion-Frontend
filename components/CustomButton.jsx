import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet, View } from "react-native";
import colors from "../constants/color";
import fonts from "../constants/fonts";

const CustomButton = ({
  title,
  onPress,
  type = "primary",
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
      <View style={styles.buttonContent}>
        {icon && <Image source={icon} style={styles.buttonIcon} />}
        <Text style={[textStyles[type], textStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.primary, // Use imported color
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
    marginTop: 10,
    justifyContent: "center",
  },
  primaryButtonText: {
    color: colors.background, // Use imported color
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
    paddingVertical: 2,
    borderRadius: 8,
    alignItems: "center",
    borderColor: colors.secondaryText, // Use imported color if available
    borderWidth: 0,
    textAlign: "center",
  },
  secondaryButtonText: {
    color: colors.secondaryText, // Use imported color if available
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background, // Use imported color
    paddingVertical: 14,
    borderRadius: 8,
    borderColor: colors.stroke, // Use imported color if available
    borderWidth: 1,
    marginBottom: 32,
  },
  googleButtonText: {
    color: colors.mainTextColor, // Use imported color if available
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  buttonIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
    tintColor: colors.background, // Use imported color
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomButton;
