import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/color';

const PopupAppBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
        <Image
          source={require('../assets/back.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.secondaryText, 
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 10,
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: colors.mainTextColor,
    resizeMode: 'contain',
  },
});

export default PopupAppBar;
