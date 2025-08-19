import React from 'react';
import { View, Text, Image, StyleSheet, Touchable, TouchableOpacity, Dimensions } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ConnectorCard = ({ status, connectorID, connectorImage, connectorType, batteryGain, estimatedTime, powerInfo, price, onPress, index }) => {
  return (
    <View style={styles.wrapper}>
      {/* 👇 Index label above the card */}
      {/* <Text style={styles.indexTitle}>Charger {index}</Text> */}
      <View style={styles.connectorCard}>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.connectorHeader}>
            <Text style={[status === 'Available' ? styles.availableText : styles.busyText]}>
              {status === 'Available' ? 'Available' : 'Charger Busy'}
            </Text>
            <Text style={styles.connectorID}>ID: {connectorID}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SCREEN_HEIGHT * 0.01 }}>
            <Image source={connectorImage} style={[styles.chargerIcon, { tintColor: colors.primary, marginRight: SCREEN_WIDTH * 0.02 }]} />
            <Text style={styles.connectorType}>{connectorType}</Text>
          </View>

          <View style={[styles.powerRow, { gap: SCREEN_WIDTH * 0.01 }]}> 
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>⚡ {powerInfo}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>{price} /kW</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  connectorCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_HEIGHT * 0.02,
    marginHorizontal: 0,
    borderWidth: 1,
    borderColor: colors.stroke,
    shadowColor: colors.stroke,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2
  },
  wrapper: {
    marginBottom: SCREEN_HEIGHT * 0.008,
  },
  indexTitle: {
    fontSize: SCREEN_WIDTH * 0.04,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginLeft: SCREEN_WIDTH * 0.06,
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  connectorHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SCREEN_HEIGHT * 0.005 },
  availableText: { color: colors.primary, fontFamily: fonts.PlusJakartaSansBold, fontSize: SCREEN_WIDTH * 0.035 },
  busyText: { color: colors.danger, fontFamily: fonts.PlusJakartaSansBold, fontSize: SCREEN_WIDTH * 0.035 },
  connectorID: { fontSize: SCREEN_WIDTH * 0.03, fontFamily: fonts.PlusJakartaSans, color: colors.secondaryText },
  connectorType: { fontSize: SCREEN_WIDTH * 0.035, fontFamily: fonts.PlusJakartaSansBold, color: colors.mainTextColor, marginBottom: SCREEN_HEIGHT * 0.015 },
  batteryInfo: { marginBottom: SCREEN_HEIGHT * 0.015 },
  batteryText: { fontSize:SCREEN_WIDTH < 375 ? 14 : 16, fontFamily: fonts.PlusJakartaSans, color: colors.secondaryText, marginBottom: SCREEN_HEIGHT * 0.005 },
  powerRow: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
  infoBox: {
    borderRadius: 4,
    paddingHorizontal: SCREEN_WIDTH * 0.02,
    paddingVertical: SCREEN_HEIGHT * 0.003,
    marginHorizontal: SCREEN_WIDTH * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.stroke,
    minWidth: SCREEN_WIDTH * 0.08
  },
  infoText: { color: colors.mainTextColor, fontSize: SCREEN_WIDTH * 0.03, fontFamily: fonts.PlusJakartaSansBold, fontWeight: 'bold' },
  chargerIcon: { width: SCREEN_WIDTH * 0.06, height: SCREEN_WIDTH * 0.06 },
});

export default ConnectorCard;