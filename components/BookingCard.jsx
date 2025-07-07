import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // 👈 Add this
import colors from '../constants/color.js';
import fonts from '../constants/fonts.js';

const BookingCard = ({
  dateLabel,
  duration,
  startTime,
  endTime,
  stationName,
  address,
  carImage,
  carName,
  connectorType,
  iconColor = colors.primary
}) => {
  const navigation = useNavigation(); // 👈 Use navigation hook

  const handlePress = () => {
    navigation.navigate('BookingDetails', {
      dateLabel,
      duration,
      startTime,
      endTime,
      stationName,
      address,
      carImage,
      carName,
      connectorType,
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
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
          <Text style={styles.stationName}>{stationName}</Text>
          <Text style={styles.address}>{address}</Text>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="navigation" size={28} color={iconColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      <View style={styles.bottomRow}>
        <View style={styles.carContainer}>
          <Image source={carImage} style={styles.carImage} />
          <Text style={styles.carName}>{carName}</Text>
        </View>
        <View style={styles.connectorContainer}>
          <MaterialCommunityIcons name="ev-plug-ccs2" size={24} color={colors.mainTextColor} />
          <Text style={styles.connector}>{connectorType}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BookingCard;


const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background, // Use background color from constants
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
    fontFamily: fonts.PlusJakartaSansMedium, // Use bold font from constants
    fontSize: 16,
    color: colors.mainTextColor, // Use main text color from constants
  },
  duration: {
    borderWidth: 1,
    borderColor: colors.primary, // Use primary color for border
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginHorizontal: 10,
  },
  durationText: {
    color: colors.primary, // Use primary color for text
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans, // Use regular font from constants
  },
  timeText: {
    fontFamily: fonts.PlusJakartaSansBold, // Use bold font from constants
    fontSize: 14,
    color: colors.mainTextColor, // Use main text color from constants
  },
  separator: {
    height: 1,
    backgroundColor: colors.stroke, // Use stroke color from constants
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
    fontFamily: fonts.PlusJakartaSansMedium, // Use bold font from constants
    fontSize: 16,
    color: colors.mainTextColor, // Use main text color from constants
  },
  address: {
    color: colors.secondaryText, // Use secondary text color from constants
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans, // Use regular font from constants
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
    backgroundColor: colors.stroke, // Use stroke color as fallback background
  },
  carName: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans, // Use regular font from constants
    color: colors.mainTextColor, // Use main text color from constants
  },
  connector: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans, // Use regular font from constants
    color: colors.mainTextColor, // Use main text color from constants
  },
});