import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  placeholderTextColor = '#B2BEC3',
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  showPassword,
  setShowPassword,
  isPassword = false,
}) => {
   useEffect(() => {
        navigation.setOptions({
          headerShown: true,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerBackButton}
              onPress={() => navigation.goBack()}
            >
              <Image
                source={require('../../assets/back-icon.png')}
                style={[styles.headerBackIcon, { tintColor: '#000' }]}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: '#FFFFFF',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerLeftContainerStyle: {
            paddingLeft: 16,
          },
        });
       }, [navigation]);

  return (

    
      
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={isPassword ? styles.passwordContainer : null}>
        <TextInput
          style={[styles.input, isPassword ? styles.passwordInput : null]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={isPassword ? !showPassword : false}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
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
                  ? require('../../assets/eye-open.png')
                  : require('../../assets/eye-icon.png')
              }
              style={styles.eyeIconImage}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  
)};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#2D3436',
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D1D1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#636e72',
    fontFamily: 'PlusJakartaSans-Regular',
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
    tintColor: '#B2BEC3',
  },
});

export default InputField;