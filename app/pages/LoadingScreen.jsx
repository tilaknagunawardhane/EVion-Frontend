import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
      <Text style={styles.message}>
        Hang tight! We’re mapping{'\n'}the smartest way...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  spinner: {
    marginBottom: 20,
  },
  message: {
    textAlign: 'center',
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    lineHeight: 24,
  },
});

export default LoadingScreen;
