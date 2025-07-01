import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const InputWithIcon = ({
  icon,
  placeholder,
  value,
  onChangeText,
  placeholderTextColor = colors.secondaryText,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <View
        style={[
          styles.container,
          isFocused && { borderColor: colors.primary },
        ]}
      >
        <Image
          source={icon}
          style={[
            styles.icon,
            {
              tintColor: value ? colors.mainTextColor : colors.secondaryText,
            },
          ]}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 10,
    width: 332,
    height: 55,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.stroke,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
  },
});

export default InputWithIcon;
