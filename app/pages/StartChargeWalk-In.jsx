import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import CircularProgress from '../../components/CircularProgress';
import ChargingInfoCard from '../../components/ChargingInfoCard';
import SwipeButton from '../../components/SwipeButton';

const StartChargeWalkInScreen = () => {
  const router = useRouter();
  
  // Battery percentage and charging data
  const batteryPercentage = 17;
  const chargingPower = '0kW';
  const chargingTime = '00:00:00';
  const cost = '00.00';
  
  // Charging info data
  const chargingInfoItems = [
    {
      icon: 'flash',
      label: 'Charging Power',
      value: chargingPower
    },
    {
      icon: 'time',
      label: 'Charging Time',
      value: chargingTime
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kia EV6</Text>
        <TouchableOpacity>
          <Ionicons name="refresh" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
      </View>

      {/* Battery Circle Progress */}
      <View style={styles.batteryContainer}>
        <CircularProgress 
          percentage={batteryPercentage}
          size={200}
          additionalText="0kWh"
        />
      </View>

      {/* Charging Info */}
      <ChargingInfoCard items={chargingInfoItems} />

      {/* Cost */}
      <View style={styles.costContainer}>
        <Text style={styles.costText}>
          <Text style={styles.currencyText}>LKR </Text>
          {cost}
        </Text>
      </View>

      {/* Start Charging Button */}
      <View style={styles.buttonContainer}>
        <SwipeButton 
          text="Swipe to start charging"
          navigateTo="/pages/Charging"
          arrowDirection="right"
          onSwipeComplete={() => {
            console.log('Starting charging...');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  batteryContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  costContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  costText: {
    fontSize: 32,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  currencyText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 60,
  },
});

export default StartChargeWalkInScreen;
