import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const ConnectorCard = ({
  status,
  connectorType,
  connectorID,
  connectorImage,
  batteryGain,
  estimatedTime,
  powerInfo,
  price,
  isSelected,
  onSelect,
  onDotsPress,
}) => {
  const isAvailable = status.toLowerCase().includes('available');
  const isBusy = status.toLowerCase().includes('busy');

  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.9}
      style={[styles.card, isSelected && styles.selectedCard]}
    >
      {/* Top Row */}
      <View style={styles.rowBetween}>
        <Text style={[styles.badge, { color: isBusy ? colors.warning : colors.success }]}>
          {status}
        </Text>
        <TouchableOpacity onPress={onDotsPress}>
          <Entypo name="dots-three-vertical" size={14} color={colors.secondaryText} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.connectorType}>{connectorType}</Text>
      <Text style={styles.connectorID}>ID: {connectorID}</Text>

      {/* Separator Line */}
      <View style={styles.separator} />

      {/* Bottom Content Row */}
      <View style={styles.bottomRow}>
        {/* Icon Box */}
        <View style={styles.iconBox}>
          <Image source={connectorImage} style={styles.iconImage} />
        </View>

        {/* Battery Info */}
        <View style={styles.middleColumn}>
          <Text style={styles.label}>Battery Gain:</Text>
          <Text style={styles.value}>~{batteryGain} in 30 mins</Text>
          <Text style={styles.label}>Est. Time to 80%:</Text>
          <Text style={styles.value}>{estimatedTime}</Text>
        </View>

        {/* Power & Price */}
        <View style={styles.rightColumn}>
          <View style={styles.powerRow}>
            <FontAwesome name="bolt" size={14} color={colors.secondaryText} />
            <Text style={styles.power}>{powerInfo}</Text>
          </View>
          <Text style={styles.price}>LKR {price}.00 /kW</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor:colors.background,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 24,
    marginBottom: 16,
    elevation: 1,
  },
  selectedCard: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  badge: {
    fontSize: 11,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  connectorType: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 2,
  },
  connectorID: {
    fontSize: 11,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
  separator: {
    height: 1,
    backgroundColor: colors.stroke,
    marginVertical: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    backgroundColor: '#E9F7F4',
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
  },
  iconImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  middleColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
  value: {
    fontSize: 11,
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  rightColumn: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  powerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  power: {
    fontSize: 12,
    marginLeft: 4,
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSans,
  },
  price: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
});

export default ConnectorCard;


