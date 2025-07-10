import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const InputField = React.memo(({
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
  error,
  style,
  inputStyle,
  labelStyle,
  containerStyle,
  multiline = false,
  maxLength,
  editable = true,
  onFocus,
  onBlur,
  error,
  required = false,
  showPasswordToggle = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus && onFocus();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur && onBlur();
  }, [onBlur]);

  const togglePasswordVisibility = useCallback(() => {
    if (setShowPassword) {
      setShowPassword(!showPassword);
    }
  }, [setShowPassword, showPassword]);

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {label && (
        <Text style={[styles.inputLabel, labelStyle]}>
          {label}
          {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <View style={[isPassword || showPasswordToggle ? styles.passwordContainer : null]}>
        <TextInput
          style={[
            styles.input,
            style,
            inputStyle,
            (isPassword || showPasswordToggle) && styles.passwordInput,
            isFocused && styles.inputFocused,
            error && styles.inputError,
            !editable && styles.inputDisabled,
            multiline && styles.inputMultiline,
            { color: value ? colors.mainTextColor : colors.secondaryText },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={isPassword ? !showPassword : (secureTextEntry && showPassword !== undefined ? !showPassword : secureTextEntry)}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          maxLength={maxLength}
          editable={editable}
        />
        {(isPassword || showPasswordToggle) && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            <Image
              source={
                (showPassword !== undefined ? showPassword : false)
                  ? require('../assets/eye-open.png')
                  : require('../assets/eye-closed.png')
              }
              style={styles.eyeIconImage}
            />
          </TouchableOpacity>
        )}

      </View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  required: {
    color: colors.error || '#FF3B30',
  },
  input: {
    minHeight: 48,
    backgroundColor: colors.background,
    borderColor: colors.stroke,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: colors.error || '#FF3B30',
  },
  inputDisabled: {
    backgroundColor: colors.background,
    opacity: 0.6,
  },
  inputMultiline: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 4,
    zIndex: 1,
  },
  eyeIconImage: {
    width: 20,
    height: 20,
    tintColor: colors.secondaryText,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans,
    marginTop: 6,
  }

});

export default InputField;
