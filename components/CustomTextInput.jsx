import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
} from "react-native";
import colors from "../constants/color";
import fonts from "../constants/fonts";

const CustomTextInput = ({ 
  placeholder, 
  value, 
  onChangeText, 
  multiline = false, 
  style,
  inputStyle,
  minHeight = 40,
  withBorder = false
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      <TextInput
        style={[
          styles.input,
          withBorder && styles.inputWithBorder,
          inputStyle,
          { minHeight }
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.secondaryText}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 20,
  },
  input: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  inputWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
    paddingBottom: 12,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
});

export default CustomTextInput;
