import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const FilterAppBar = ({ title = "Filters" }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Image
            source={require('../assets/Closeaffordance.png')}
            style={styles.closeIcon}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 25 : 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    backgroundColor: `${colors.stroke}4D`,
    borderRadius: 20,
    padding: 10,
    zIndex: 2,
  },
  closeIcon: {
    width: 28,
    height: 32,
    tintColor: colors.mainTextColor,
    resizeMode: 'contain',
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
});

export default FilterAppBar;
