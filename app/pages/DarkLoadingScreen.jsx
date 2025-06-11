import React from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import colors from '../../constants/color';

const DarkLoadingScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Image
        source={require('../../assets/Logo4.png')}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});

export default DarkLoadingScreen;