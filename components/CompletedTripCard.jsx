import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../constants/color';
import fonts  from '../constants/fonts';

import LocationStartIcon from '../assets/from.png';
import LocationEndIcon   from '../assets/to.png';
import ChargingIcon      from '../assets/charging.png';
import PassengerIcon     from '../assets/members.png';
import StopIcon          from '../assets/stop.png';

const CompletedTripCard = ({ trip, onOptionsPress }) => {
  const isDefaultLogo = !trip.image;   // true when BYD fallback is used

  return (
    <View style={styles.card}>
      {/* ── Top row (date + menu) ───────────────────────────────────── */}
      <View style={styles.completedRow}>
        <View style={styles.completedRowLeft}>
          <Text style={styles.completedDate}>{trip.date}</Text>
          <Text style={styles.completedTag}>COMPLETED</Text>
        </View>

        <TouchableOpacity
          onPress={() => onOptionsPress?.(trip)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.6}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color={colors.secondaryText}
          />
        </TouchableOpacity>
      </View>

      {/* ── Route section ───────────────────────────────────────────── */}
      <View style={styles.routeLeft}>
        <View style={styles.dottedLine} />

        <View style={styles.routeItem}>
          <Image source={LocationStartIcon} style={styles.iconSmallBlack} />
          <Text style={styles.routeText}>{trip.from}</Text>
        </View>

        {trip.stops.map((stop, idx) => (
          <View key={idx} style={styles.routeItem}>
            <Image source={ChargingIcon} style={styles.iconSmall} />
            <View>
              <Text style={styles.routeText}>{stop.name}</Text>
              <Text style={styles.routeSubText}>{stop.address}</Text>
            </View>
          </View>
        ))}

        <View style={styles.routeItem}>
          <Image source={LocationEndIcon} style={styles.iconSmallBlack} />
          <Text style={styles.routeText}>{trip.to}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* ── Footer (vehicle + stats) ────────────────────────────────── */}
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

          <Image source={StopIcon} style={styles.iconSmallStation} />

          <Text style={styles.infoText}>
            0{trip.stopsCount} stop{trip.stopsCount > 1 ? 's' : ''}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  /* ── Card container ─────────────────────────────────────────────── */
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

  /* ── Completed header row ───────────────────────────────────────── */
  completedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completedRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  completedDate: {
    fontSize: 14,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  completedTag: {
    fontSize: 14,
    color: colors.HighlightText,
    fontFamily: fonts.PlusJakartaSansMedium,
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
  iconSmallStation: {
    width: 24,
    height: 24,
    marginTop: 2,
    resizeMode: 'contain',
  },

  iconSmall: {
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
  routeSubText: {
    fontSize: 13,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSansMedium,
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
    backgroundColor: '#E9F4EE', // soft green tint; adjust if desired
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',         // keeps full‑size photos bounded
    borderWidth: 1,          // border thickness
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
  },
});

export default CompletedTripCard;
