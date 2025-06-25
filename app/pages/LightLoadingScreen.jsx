import React from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import colors from '../../constants/color.js';

const LightLoadingScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Image
        source={require('../../assets/Logo3.png')} 
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default LightLoadingScreen;
