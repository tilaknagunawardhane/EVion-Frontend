import React, { useCallback } from 'react';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import useUserData from '../../hooks/useUserData';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProfileScreen1 = () => {
  const removeUser = () => {
    router.push('/pages/SignInScreen');
  };

  const cardMargin = 12;
  const cardSize = SCREEN_WIDTH < 375 ? 90 : 110;
  const isSmallScreen = SCREEN_WIDTH < 375;
  const avatarSize = SCREEN_WIDTH < 375 ? 60 : 80;

  const { user, isLoading, refreshUserData } = useUserData();

  // When this tab gains focus, refresh cached user data so the card shows
  // the most recent name/email after changes on the profile screen.
  useFocusEffect(
    useCallback(() => {
      if (typeof refreshUserData === 'function') refreshUserData();
    }, [refreshUserData])
  );

  const userData = {
    name: user?.name || 'Guest User',
    email: user?.email || 'Please sign in',
    profileImage: null,
    vehicles: user?.vehicles || [ { id: 1, name: 'BYD', image: require('../../assets/byd.png') } ],
    walletBalance: 2500,
    recentActivity: 12,
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Info Card */}
        <TouchableOpacity style={styles.userCard} onPress={() => router.push('/pages/Profile/Profile1')}>
          <View style={[styles.avatarWrapper, { width: avatarSize, height: avatarSize }]}> 
            {userData.profileImage ? (
              <Image source={require('../../assets/avatar.png')} style={styles.avatar} />
            ) : (
              <FontAwesome size={isSmallScreen ? 24 : 28} name="user-o" color={colors.primary} />
            )}
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">{userData.name}</Text>
            <TouchableOpacity onPress={() => router.push('/pages/Profile/Profile1')} activeOpacity={0.7}>
              <Text style={[styles.userEmail, { color: colors.primary, textDecorationLine: 'underline' }]} numberOfLines={1} ellipsizeMode="tail">{userData.email}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.userBalance}>
            <FontAwesome size={isSmallScreen ? 24 : 28} name="angle-right" color={colors.secondaryText} />
          </View>
        </TouchableOpacity>

        {/* Quick Access Cards */}
        <View style={styles.cardRow}>
          <TouchableOpacity style={[styles.card, { width: cardSize, marginRight: cardMargin, height: cardSize * 0.9 }]} onPress={() => router.push('/pages/Profile/MyEVsScreen')}>
            <Image source={require('../../assets/byd.png')} style={styles.cardIcon} resizeMode="contain" />
            <Text style={styles.cardLabel}>My EVs</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { width: cardSize, marginRight: cardMargin, height: cardSize * 0.9 }]} onPress={() => router.push('/pages/Profile/Wallet/walletScreen')}>
            <Image source={require('../../assets/wallet.png')} style={styles.cardIcon} resizeMode="contain" />
            <Text style={styles.cardLabel}>Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { width: cardSize, height: cardSize * 0.9 }]} onPress={() => router.push('/pages/Profile/Activity')}>
            <Image source={require('../../assets/activity.png')} style={styles.cardIcon} resizeMode="contain" />
            <Text style={styles.cardLabel}>Activity</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.listItem} onPress={() => router.push('/pages/Profile/SettingsScreen')}>
            <Image source={require('../../assets/settings.png')} style={styles.listIcon} resizeMode="contain" />
            <Text style={styles.listLabel}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem} onPress={() => router.push('/pages/Profile/Favourites')}>
            <Image source={require('../../assets/favourite.png')} style={styles.listIcon} resizeMode="contain" />
            <Text style={styles.listLabel}>Favourites</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem} onPress={() => router.push('/pages/FaultReport')}>
            <Image source={require('../../assets/fault.png')} style={styles.listIcon} resizeMode="contain" />
            <Text style={styles.listLabel}>Fault Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem} onPress={() => router.push('/pages/Profile/PrivacyPolicy')}>
            <Image source={require('../../assets/privacy.png')} style={styles.listIcon} resizeMode="contain" />
            <Text style={styles.listLabel}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem} onPress={() => router.push({ pathname: '/pages/StationProfile', params: { stationID: '687d2ec70e0c0b8ef0b4186c' } })}>
            <Image source={require('../../assets/help.png')} style={styles.listIcon} resizeMode="contain" />
            <Text style={styles.listLabel}>Help Center</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.listItem} onPress={() => router.push({ pathname: '/pages/bookings/ReportIssue', params: { bookingId: '68a6c105b056f6456292bdd7' } })}>
          <Image source={require('../../assets/privacy.png')} style={styles.listIcon} resizeMode="contain" />
          <Text style={styles.listLabel}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={() => router.push({ pathname: '/pages/StationProfile', params: { stationID: '687d2ec70e0c0b8ef0b4186c' } })}>
          <Image source={require('../../assets/help.png')} style={styles.listIcon} resizeMode="contain" />
          <Text style={styles.listLabel}>Help Center</Text>
        </TouchableOpacity>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOut} onPress={removeUser}>
          <View style={styles.signOutRow}>
            <Image source={require('../../assets/signout.png')} style={styles.signOutIcon} resizeMode="contain" />
            <Text style={styles.signOutText}>Sign out</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: SCREEN_WIDTH < 375 ? 15 : 20,
    paddingTop: SCREEN_HEIGHT * 0.07,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  title: {
    fontSize: SCREEN_WIDTH < 375 ? 22 : 24,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7F2',
    padding: SCREEN_WIDTH < 375 ? 12 : 16,
    borderRadius: 12,
    marginVertical: SCREEN_HEIGHT * 0.02,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,

  },
  avatarWrapper: {
    marginRight: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    marginRight: 10,
  },
  userName: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: SCREEN_WIDTH < 375 ? 14 : 16,
    color: colors.mainTextColor,
    maxWidth: SCREEN_WIDTH * 0.5,
  },
  userEmail: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: SCREEN_WIDTH < 375 ? 11 : 12,
    color: colors.mainTextColor,
    maxWidth: SCREEN_WIDTH * 0.5,
  },
  userBalance:{
    paddingEnd: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SCREEN_HEIGHT * 0.02,
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 1,
    position: 'relative',
  },
  cardIcon: {
    width: SCREEN_WIDTH < 375 ? 28 : 30,
    height: SCREEN_WIDTH < 375 ? 28 : 30,
    marginBottom: 6,
    // backgroundColor: colors.primary,
    color: colors.primary,
  },
  cardLabel: {
    fontSize: SCREEN_WIDTH < 375 ? 14 : 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: SCREEN_WIDTH < 375 ? 10 : 12,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.primary,
    marginTop: 4,
  },
  cardBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.primary,
    color: 'white',
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 20,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  menuContainer: {
    marginTop: SCREEN_HEIGHT * 0.01,
    
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SCREEN_HEIGHT * 0.018,
    justifyContent: 'space-between',
  },
  listIcon: {
    width: SCREEN_WIDTH < 375 ? 20 : 24,
    height: SCREEN_WIDTH < 375 ? 20 : 24,
    marginRight: SCREEN_WIDTH < 375 ? 10 : 14,
  },
  listLabel: {
    flex: 1,
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: SCREEN_WIDTH < 375 ? 14 : 15,
    color: colors.mainTextColor,
  },
  signOut: {
    marginTop: SCREEN_HEIGHT * 0.06,
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  signOutRow: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  signOutIcon: {
    width: SCREEN_WIDTH < 375 ? 18 : 20,
    height: SCREEN_WIDTH < 375 ? 18 : 20,
    marginRight: 10,
  },
  signOutText: {
    fontSize: SCREEN_WIDTH < 375 ? 14 : 15,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.danger,
  },
});

export default ProfileScreen1;