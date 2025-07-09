import React from 'react';
import { View, Text, Image, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const ConnectorCard = ({ status, connectorID, connectorImage, connectorType, batteryGain, estimatedTime, powerInfo, price, onPress, index }) => {
  return (
     <View style={styles.wrapper}>
      {/* 👇 Index label above the card */}
      <Text style={styles.indexTitle}>Charger {index}</Text>
    <View style={styles.connectorCard}>
      <TouchableOpacity
        onPress={onPress}
      >
        <View style={styles.connectorHeader}>
          <Text style={[status === 'Available' ? styles.availableText : styles.busyText]}>
            {status === 'Available' ? 'Available' : 'Charger Busy'}
          </Text>
          <Text style={styles.connectorID}>ID: {connectorID}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          {/* ✅ Correct image rendering for local image */}
          <Image source={connectorImage} style={[styles.chargerIcon, { tintColor: colors.primary, marginRight: 8 }]} />
          <Text style={styles.connectorType}>{connectorType}</Text>
        </View>

        <View style={{ height: 1, backgroundColor: colors.stroke, marginVertical: 8 }} />

        <View style={styles.batteryInfo}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.batteryText}>Battery Gain:</Text>
            <Text style={[styles.batteryText, { color: colors.mainTextColor, textAlign: 'right' }]}>{batteryGain}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.batteryText}>Est. Time to 80%:</Text>
            <Text style={[styles.batteryText, { color: colors.mainTextColor, textAlign: 'right' }]}>{estimatedTime}</Text>
          </View>
        </View>

        <View style={[styles.powerRow, { gap: 4 }]}>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>⚡ {powerInfo}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>LKR {price} /kW</Text>
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
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.stroke,
    shadowColor: colors.stroke,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2
  },
  wrapper: {
  marginBottom: 6,
},
indexTitle: {
  fontSize: 16,
  fontFamily: fonts.PlusJakartaSansBold,
  color: colors.mainTextColor,
  marginLeft: 24,
  marginBottom: 8,
},
  connectorHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  availableText: { color: colors.primary, fontFamily: fonts.PlusJakartaSansBold, fontSize: 14 },
  busyText: { color: colors.danger, fontFamily: fonts.PlusJakartaSansBold, fontSize: 14 },
  connectorID: { fontSize: 12, fontFamily: fonts.PlusJakartaSans, color: colors.secondaryText },
  connectorType: { fontSize: 14, fontFamily: fonts.PlusJakartaSansBold, color: colors.mainTextColor, marginBottom: 12 },
  batteryInfo: { marginBottom: 12 },
  batteryText: { fontSize: 12, fontFamily: fonts.PlusJakartaSans, color: colors.secondaryText, marginBottom: 4 },
  powerRow: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
  infoBox: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.stroke,
    minWidth: 32
  },
  infoText: { color: colors.mainTextColor, fontSize: 12, fontFamily: fonts.PlusJakartaSansBold, fontWeight: 'bold' },
  chargerIcon: { width: 24, height: 24 },
  
});

export default ConnectorCard;