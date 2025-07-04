import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  placeholderTextColor = colors.secondaryText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  showPassword,
  setShowPassword,
  isPassword = false,
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={isPassword ? styles.passwordContainer : null}>
        <TextInput
          style={[
            styles.input,
            style,
            isPassword && styles.passwordInput,
            isFocused && { borderColor: colors.primary },
            { color: value ? 'black' : colors.mainTextColor }, //  change text color based on value
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={isPassword ? !showPassword : false}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <Image
              source={
                showPassword
                  ? require('../assets/eye-open.png')
                  : require('../assets/eye-closed.png')
              }
              style={styles.eyeIconImage}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: colors.background,
    borderColor: colors.stroke,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
  },
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 14,
    zIndex: 1,
  },
  eyeIconImage: {
    width: 22,
    height: 22,
    tintColor: colors.secondaryText,
  },
});

export default InputField;
