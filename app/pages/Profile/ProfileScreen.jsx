import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';

const ProfileScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* User Info Card */}
      <TouchableOpacity style={styles.userCard}>
        <View style={styles.avatarWrapper}>
          <Image
            source={require('../../../assets/avatar.png')}
            style={styles.avatar}
          />
        </View>
        <View>
          <Text style={styles.userName}>Vishwani Vilochaṇa</Text>
          <Text style={styles.userEmail}>vishwani2002@gmail.com</Text>
        </View>
        <Text style={styles.arrow}>{'>'}</Text>
      </TouchableOpacity>

      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('pages/Profile/MyEVsScreen')}>
          <Image source={require('../../../assets/byd.png')} style={styles.cardIcon} />
          <Text style={styles.cardLabel}>My EVs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Wallet')}>
          <Image source={require('../../../assets/wallet.png')} style={styles.cardIcon} />
          <Text style={styles.cardLabel}>Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Activity')}>
          <Image source={require('../../../assets/activity.png')} style={styles.cardIcon} />
          <Text style={styles.cardLabel}>Activity</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('pages/Profile/SettingsScreen')}>
        <Image source={require('../../../assets/settings.png')} style={styles.listIcon} />
        <Text style={styles.listLabel}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('pages/Profile/Favourites')}>
        <Image source={require('../../../assets/favourite.png')} style={styles.listIcon} />
        <Text style={styles.listLabel}>Favourites</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('FaultReports')}>
        <Image source={require('../../../assets/fault.png')} style={styles.listIcon} />
        <Text style={styles.listLabel}>Fault Reports</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('pages/Profile/PrivacyPolicy')}>
        <Image source={require('../../../assets/privacy.png')} style={styles.listIcon} />
        <Text style={styles.listLabel}>Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('HelpCenter')}>
        <Image source={require('../../../assets/help.png')} style={styles.listIcon} />
        <Text style={styles.listLabel}>Help Center</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOut}>
        <View style={styles.signOutRow}>
          <Image
            source={require('../../../assets/signout.png')}
            style={styles.signOutIcon}
          />
          <Text style={styles.signOutText}>Sign out</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7F2',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  avatarWrapper: {
    marginRight: 12,
    width: 72,            
    height: 72,
    borderRadius: 25,    
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.primary, 
  },
  
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 20,
  },
  userName: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 16,
    color: colors.mainTextColor,
  },
  userEmail: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 12,
    color: colors.mainTextColor,
  },
  arrow: {
    marginLeft: 'auto',
    fontSize: 18,
    color: colors.secondaryText,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  card: {
    alignItems: 'center',
    width: 105,
    height:96,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,   
    elevation: 1,
  },
  cardIcon: {
    width: 28,
    height: 28,
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  listIcon: {
    width: 24,
    height: 24,
    marginRight: 14,
  },
  listLabel: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 14,
    color: colors.mainTextColor,
  },
  signOut: {
    marginTop: 30,
  },
  signOutRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signOutIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#FF4D4F',
  },
  signOutText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: '#FF4D4F',
  },
});

export default ProfileScreen;
