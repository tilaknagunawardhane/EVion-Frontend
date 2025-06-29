import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const AppBar = ({ title = 'Plan Your Route' }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
          <Image
            source={require('../assets/back.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('pages/SavedTripsScreen')}
        >
          <Image
            source={require('../assets/clock-icon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 34) + 10 : 40,
    paddingBottom: 8, // Reduced from 36
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7, // Optional slight spacing
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.background,
    flex: 1,
    textAlign: 'center',
  },
  iconContainer: {
    padding: 10,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: colors.background,
    resizeMode: 'contain',
  },
});

export default AppBar;
