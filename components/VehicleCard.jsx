import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const VehicleCard = ({
  image,
  name,
  year,
  batteryCapacity,
  batteryHealth,
  connector1_image,
  connector1_name,
  connector2_image,
  connector2_name
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInnerIconCircle}>
          <Image
            source={image}
            style={styles.cardIcon}
            resizeMode="contain"
          />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{name}</Text>
          <Text style={styles.cardYear}>{year}</Text>
          <Text style={styles.cardSpec}>Battery Capacity: {batteryCapacity}</Text>
          <Text style={styles.cardSpec}>Battery Health: {batteryHealth}</Text>
        </View>
      </View>

      <View style={styles.separator} />

      <View style={styles.chargerRow}>
        <View style={styles.chargerItem}>
          <Image
            source={connector1_image}
            style={styles.chargerIcon}
            resizeMode="contain"
          />
          <Text style={styles.chargerText}>{connector1_name}</Text>
        </View>
        <View style={styles.chargerItem}>
          <Image
            source={connector2_image}
            style={styles.chargerIcon}
            resizeMode="contain"
          />
          <Text style={styles.chargerText}>{connector2_name}</Text>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20, // reduced bottom gap
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  cardInnerIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardIcon: {
    width: 30,
    height: 30,
    tintColor: colors.primary,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 16,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  cardYear: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  cardSpec: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 14,
    color: colors.mainTextColor,
    marginBottom: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#DADADA',
    marginVertical: 16,
  },
  chargerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chargerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chargerIcon: {
    width: 24,
    height: 24,
    marginRight: 6,
  },
  chargerText: {
    fontSize: 13,
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSans,
  },
});

export default VehicleCard;
