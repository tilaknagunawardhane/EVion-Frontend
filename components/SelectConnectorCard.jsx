import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const SelectConnectorCard = ({ connector, selected = false }) => {
  return (
    <View style={[styles.card, selected && styles.selectedCard]}>
      {/* ---------- HEADER ---------- */}
      <View style={styles.headerRow}>
        {/* Icon */}
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="ev-plug-type2"
            size={28}
            color={colors.primary}
          />
        </View>

        {/* Status + Type */}
        <View style={styles.headerTextWrapper}>
          <Text style={styles.statusText}>{connector.status}</Text>
          <Text style={styles.typeText} numberOfLines={2}>
            {connector.label || connector.type}
          </Text>
        </View>

        {/* ID */}
        <Text style={styles.idText}>ID: {connector.id}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* ---------- DETAILS ---------- */}
      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Battery Gain:</Text>
        <Text style={styles.detailValue}>{connector.batteryGain}</Text>
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Est. Time to 80%:</Text>
        <Text style={styles.detailValue}>
          {connector.estTime ?? connector.estimatedTime}
        </Text>
      </View>

      {/* ---------- FOOTER ---------- */}
      <View style={styles.footerRow}>
        <View style={styles.priceBadge}>
          <MaterialCommunityIcons name="flash" size={16} color={colors.black} />
          <Text style={styles.powerText}>{connector.power}</Text>
        </View>
        <View style={styles.priceBadge}>
        <Image
          source={require('../assets/price.png')} 
          style={styles.currencyIcon}
        />
          <Text style={styles.priceText}>{connector.price}</Text>
        </View>
      </View>
    </View>
  );
};

export default SelectConnectorCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    backgroundColor: colors.lightGreen,
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
  },
  headerTextWrapper: {
    flex: 1,
    paddingRight: 10,
  },
  statusText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: fonts.PlusJakartaSansSemiBold,
  },
  typeText: {
    fontSize: 15,
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSansMedium,
    marginTop: 2,
    flexWrap: 'wrap',
  },
  idText: {
    fontSize: 13,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSansMedium,
    marginLeft: 'auto',
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightestGray,
    marginVertical: 14,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  detailValue: {
    fontSize: 13,
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  powerText: {
    fontSize: 14,
    marginLeft: 4,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightestGray,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  currencyIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },  
  priceText: {
    fontSize: 14,
    marginLeft: 4,
    fontFamily: fonts.PlusJakartaSansSemiBold,
    color: colors.mainTextColor,
  },
});
