import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import CircularProgress from '../../components/CircularProgress';
import CustomButton from '../../components/CustomButton';

const FullChargedScreen = () => {
  const router = useRouter();
  
  // Battery and charging data
  const batteryPercentage = 100;
  const capacity = '48kWh';
  const chargingPower = '120kW';
  const chargingTime = '00:24:48';
  const cost = '3350.00';

  const handleBackPress = () => {
    router.push('/pages/Charging');
  };

  const handleContinuePress = () => {
    router.push('/pages/ChargingStoped');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Kia EV6</Text>
          <Text style={styles.headerSubtitle}>Fully Charged</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
      </View>

    {/* Battery Circle Progress - 100% */}
    <View style={styles.batteryContainer}>
        <CircularProgress
            percentage={batteryPercentage}
            size={220}
            strokeWidth={12}
            additionalText={capacity}
            progressColor={colors.primary}
        />
    </View>

    {/* Charging Info Cards */}
    <View style={styles.chargingInfoContainer}>
        <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
                <Ionicons name="flash" size={16} color={colors.secondaryText} />
            </View>
            <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Charging Power</Text>
                <Text style={styles.infoValue}>{chargingPower}</Text>
            </View>
        </View>
        <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
                <Ionicons name="time" size={16} color={colors.secondaryText} />
            </View>
            <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Charging Time</Text>
                <Text style={styles.infoValue}>{chargingTime}</Text>
            </View>
        </View>
    </View>
      <View style={styles.costContainer}>
        <Text style={styles.costText}>LKR {cost}</Text>
      </View>

      {/* Continue Button */}
      <View style={styles.bottomSection}>
        <CustomButton 
          title="Continue"
          onPress={handleContinuePress}
          type="primary"
          style={styles.continueButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.primary,
  },
  refreshButton: {
    padding: 5,
  },
  batteryContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  chargingInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 30,
    gap: 10,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,   
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.stroke,
    flex: 1,
  },
  infoIconContainer: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  costContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  costText: {
    fontSize: 32,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  continueButton: {
    paddingVertical: 12,
    borderRadius: 12,
  },
});

export default FullChargedScreen;