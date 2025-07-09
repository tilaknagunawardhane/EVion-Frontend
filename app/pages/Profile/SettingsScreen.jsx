import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import CustomSwitch from '../../../components/CustomSwitch';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
        <View style={styles.switchWrapper}>
          <CustomSwitch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Notifications</Text>
        <View style={styles.switchWrapper}>
          <CustomSwitch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>
      </View>

      {/* Location Permission */}
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate('pages/Profile/LocationPermissionScreen')}
      >
        <View>
          <Text style={styles.label}>Location Permission</Text>
          <Text style={styles.subLabel}>While Using the App</Text>
        </View>
        <Text style={styles.arrow}>{'>'}</Text>
      </TouchableOpacity>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOut}>
        <View style={styles.signOutRow}>
          <Image
            source={require('../../../assets/signout.png')}
            style={styles.signOutIcon}
          />
          <Text style={styles.signOutText}>Sign out</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 20,
    alignSelf: 'center',
    marginBottom: 30,
    color: colors.mainTextColor,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.stroke,
  },
  label: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 15,
    color: colors.mainTextColor,
  },
  subLabel: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
  },
  arrow: {
    fontSize: 18,
    color: colors.secondaryText,
  },
  switchWrapper: {
    width: 50,
    alignItems: 'flex-end',
  },
  signOut: {
    marginTop: 40,
  },
  signOutRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signOutIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#FF4D4F',
  },
  signOutText: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 14,
    color: '#FF4D4F',
  },
});

export default SettingsScreen;
