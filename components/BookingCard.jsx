import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/color.js';
import fonts from '../constants/fonts.js';
import Svg, { Path } from 'react-native-svg';

// SVG Icon Components
function NavigationIcon({ size = 28, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L3 21H21L12 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 6V18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 18L16 14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EvPlugIcon({ size = 24, color = colors.mainTextColor }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22V11"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 8V2C16 1.44772 15.5523 1 15 1H9C8.44772 1 8 1.44772 8 2V8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 8H18V16C18 18.2091 16.2091 20 14 20H10C7.79086 20 6 18.2091 6 16V8Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11 11H13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15V11"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const BookingCard = ({
  dateLabel,
  duration,
  startTime,
  endTime,
  charging_station_id,
  address,
  carImage,
  vehicle,
  connector,
  iconColor = colors.primary
}) => {

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.dateText}>{dateLabel}</Text>
        <View style={styles.duration}>
          <Text style={styles.durationText}>{duration}</Text>
        </View>
        <Text style={styles.timeText}>{startTime}-{endTime}</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.middleRow}>
        <View style={styles.stationContainer}>
          <Text style={styles.stationName}>{charging_station_id.station_name}</Text>
          <Text style={styles.address}>{charging_station_id.address}</Text>
        </View>
        <TouchableOpacity>
          <NavigationIcon size={28} color={iconColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      <View style={styles.bottomRow}>
        <View style={styles.carContainer}>
          <Image source={carImage ? { uri: carImage } : require('../assets/car.png')}
          style={styles.carImage} />
          <Text style={styles.carName}>{vehicle.make.make} {vehicle.model.model}</Text>
        </View>
        <View style={styles.connectorContainer}>
          <EvPlugIcon size={24} color={colors.mainTextColor} />
          <Text style={styles.connector}>{connector.type_name} - {connector.current_type}</Text>
        </View>
      </View>
    </View>
  );
};

export default BookingCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  dateText: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 16,
    color: colors.mainTextColor,
  },
  duration: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginHorizontal: 10,
  },
  durationText: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
  },
  timeText: {
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 14,
    color: colors.mainTextColor,
  },
  separator: {
    height: 1,
    backgroundColor: colors.stroke,
    marginVertical: 8,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  stationContainer: {
    flex: 1,
  },
  stationName: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 16,
    color: colors.mainTextColor,
  },
  address: {
    color: colors.secondaryText,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  carContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connectorContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  carImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: 'cover',
    overflow: 'hidden',
    backgroundColor: colors.stroke,
  },
  carName: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
  },
  connector: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
  },
});