import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';

const Profile2 = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.content}>
        <Text style={styles.title}>Profile 2</Text>
        <Text style={styles.subtitle}>This page is under development</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    textAlign: 'center',
  },
});

export default Profile2;