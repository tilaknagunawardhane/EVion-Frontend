import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import CircularProgress from '../../components/CircularProgress';
import ChargingInfoCard from '../../components/ChargingInfoCard';
import CostDisplay from '../../components/CostDisplay';
import SwipeButton from '../../components/SwipeButton';

const ChargingScreen = () => {
  const router = useRouter();
  
  // Charging data
  const batteryPercentage = 65;
  const capacity = '24kWh';
  const chargingPower = '120kW';
  const chargingTime = '00:12:34';
  const cost = '1650.00';

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

  const handleStopCharging = () => {
    console.log('Stopping charging...');
    // Navigate back to StartChargeWalk-In or show confirmation
    router.push('/pages/StartChargeWalk-In');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/pages/StartChargeWalk-In')}>
          <Ionicons name="chevron-back" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Kia EV6</Text>
          <Text style={styles.headerSubtitle}>Charging</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="refresh" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
      </View>

      {/* Battery Circle Progress */}
      <View style={styles.batteryContainer}>
        <CircularProgress 
          percentage={batteryPercentage}
          size={220}
          strokeWidth={12}
          additionalText={capacity}
          progressColor={colors.primary}
        />
      </View>

      {/* Charging Info */}
      <ChargingInfoCard items={chargingInfoItems} />

      {/* Cost Display */}
      <View style={styles.costContainer}>
        <CostDisplay 
          amount={cost}
          currency="LKR"
          size="large"
          showLabel={false}
        />
      </View>

      {/* Stop Charging Button */}
      <View style={styles.bottomSection}>
        <View style={styles.stopButtonContainer}>
          <SwipeButton 
            text="Swipe to stop charging"
            navigateTo="/pages/StartChargeWalk-In"
            arrowDirection="left"
            onSwipeComplete={handleStopCharging}
          />
        </View>
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
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.HighlightText,
    marginTop: 2,
  },
  batteryContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  costContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 60,
    paddingHorizontal: 24,
  },
  stopButtonContainer: {
    width: '100%',
  },
});

export default ChargingScreen;
