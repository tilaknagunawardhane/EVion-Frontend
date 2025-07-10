import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const OTPInput = React.memo(({ 
  length = 6, 
  value = [], 
  onChange, 
  focusedIndex,
  onFocus,
  onBlur,
  editable = true 
}) => {
  const inputRefs = useRef([]);

  const handleChange = useCallback((text, index) => {
    const newValue = [...value];
    newValue[index] = text;
    onChange(newValue);

    // Auto focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [value, onChange, length]);

  const handleKeyPress = useCallback((e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [value]);

  const handleFocus = useCallback((index) => {
    onFocus && onFocus(index);
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    onBlur && onBlur();
  }, [onBlur]);

  return (
    <View style={styles.container}>
      {Array.from({ length }, (_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          style={[
            styles.input,
            value[index] && styles.inputFilled,
            focusedIndex === index && styles.inputFocused
          ]}
          value={value[index] || ''}
          onChangeText={(text) => handleChange(text, index)}
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          onKeyPress={(e) => handleKeyPress(e, index)}
          maxLength={1}
          keyboardType="numeric"
          textAlign="center"
          selectTextOnFocus
          editable={editable}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  input: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    backgroundColor: colors.background,
  },
  inputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.bgGreen,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
});

export default OTPInput;
