import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import fonts from '../constants/fonts'
import colors from '../constants/color'

export default function CustomButton({ title, onPress, disabled = false, loading = false, style = {}, textStyle = {} }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, style, disabled && styles.disabledButton]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.white} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.green,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: colors.disableButtonColor,
  },
  buttonText: {
    color: colors.white,
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 16,
  },
})