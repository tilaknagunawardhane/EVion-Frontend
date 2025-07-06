import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../constants/color';
import fonts  from '../constants/fonts';

import LocationStartIcon from '../assets/from.png';
import LocationEndIcon   from '../assets/to.png';
import PassengerIcon     from '../assets/members.png';
import BatteryIcon       from '../assets/battery.png';
import BookmarkIcon      from '../assets/bookmark.png';

const SavedTripCard = ({ trip }) => {
  const isDefaultLogo = !trip.image;   // true when BYD fallback is used

  return (
    <View style={styles.card}>
      <View style={styles.routeRow}>
        <View style={styles.routeLeft}>
          <View style={styles.dottedLine} />

          <View style={styles.routeItem}>
            <Image source={LocationStartIcon} style={styles.iconSmallBlack} />
            <Text style={styles.routeText}>{trip.from}</Text>
          </View>

          <View style={styles.routeItem}>
            <Image source={LocationEndIcon} style={styles.iconSmallBlack} />
            <Text style={styles.routeText}>{trip.to}</Text>
          </View>
        </View>

        <View style={styles.bookmarkIconWrapper}>
          <Image source={BookmarkIcon} style={styles.bookmarkIcon} />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        {/* vehicle avatar */}
        <View style={styles.vehicleWrapper}>
          <Image
            source={
              isDefaultLogo
                ? require('../assets/byd.png')
                : trip.image
            }
            style={isDefaultLogo ? styles.vehicleIcon : styles.vehicleImage}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.vehicleName}>{trip.vehicle}</Text>
        </View>

        <View style={styles.infoIconGroup}>

          <Image source={PassengerIcon} style={styles.iconSmallPassenger} />

          <Text style={styles.infoText}>0{trip.passengers}</Text>
        </View>

        <View style={styles.infoIconGroup}>

          <Image source={BatteryIcon} style={styles.iconSmallBattery} />

          <Text style={styles.infoText}>{trip.battery}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  routeLeft: { flex: 1, position: 'relative', paddingLeft: 0 },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 6,
  },
  dottedLine: {
    position: 'absolute',
    left: 10,
    top: 24,
    bottom: 24,
    borderLeftWidth: 2,
    borderLeftColor: colors.mainTextColor,
    borderStyle: 'dashed',
  },
  iconSmallPassenger: {
    width: 24,
    height: 24,
    marginTop: 8,
    resizeMode: 'contain',
  },
  iconSmallBattery: {

    width: 24,
    height: 24,
    marginTop: 2,
    resizeMode: 'contain',
  },
  iconSmallBlack: {
    width: 24,
    height: 24,
    marginTop: 2,
    resizeMode: 'contain',
    tintColor: colors.mainTextColor,
  },
  routeText: {
    fontSize: 14,
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSansMedium,
    flexShrink: 1,
  },
  bookmarkIconWrapper: {
    backgroundColor: '#DDF6EE',
    borderRadius: 999,
    padding: 8,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  divider: {
    height: 1,
    backgroundColor: colors.stroke,
    marginVertical: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  vehicleWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E9F4EE', // soft green tint; tweak as needed
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',         // clips full‑size photos to the circle
    borderWidth: 1,         
    borderColor: colors.primary, 
  },
  vehicleIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  vehicleImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
  cardFooter: { flexDirection: 'row', alignItems: 'center' },
  vehicleName: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
  },
  infoIconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,

    marginLeft: 5,

  },
});

export default SavedTripCard;
