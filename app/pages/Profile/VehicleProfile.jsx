import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const VehicleProfileScreen = () => {
  const router = useRouter();

  const vehicle = {
    brand: 'BYD',
    model: 'Atto 3 (SUV)',
    year: '2025',
    batteryCapacity: '61.4',
    batteryHealth: '97',
    acConnector: {
      type: 'Type 2 (Mennekes)',
      power: '88',
    },
    dcConnector: {
      type: 'CCS Combo Type 2',
      power: '7',
    },
    image: require('../../../assets/BYDred.png'),
  };

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.title}>{vehicle.brand}</Text>
        <TouchableOpacity onPress={() => router.push('pages/Profile/UpdateVehicle1')}>
          <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        {vehicle.model}  |  {vehicle.year}
      </Text>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.imageAndStatsRow}>
          <Image source={vehicle.image} style={styles.image} />

          <View style={styles.rightStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{vehicle.batteryCapacity} kWh</Text>
              <Text style={styles.statLabel}>Battery Capacity</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{vehicle.batteryHealth} %</Text>
              <Text style={styles.statLabel}>Battery Health</Text>
            </View>
          </View>
        </View>

        <View style={styles.connectorSection}>
          <View style={styles.connectorWrapper}>
            <Text style={styles.connectorLabel}>AC Connectors</Text>
            <View style={styles.connectorCard}>
              <Image source={require('../../../assets/type2.png')} style={styles.connectorIcon} />
              <Text style={styles.connectorType}>{vehicle.acConnector.type}</Text>
              <Text style={styles.connectorPower}>{vehicle.acConnector.power} kW</Text>
            </View>
          </View>

          <View style={styles.connectorWrapper}>
            <Text style={styles.connectorLabel}>DC Connectors</Text>
            <View style={styles.connectorCard}>
              <Image source={require('../../../assets/ccs2.png')} style={styles.connectorIcon} />
              <Text style={styles.connectorType}>{vehicle.dcConnector.type}</Text>
              <Text style={styles.connectorPower}>{vehicle.dcConnector.power} kW</Text>
            </View>
          </View>
        </View>


        <TouchableOpacity style={styles.chargeNowButton}>
          <Text style={styles.chargeNowText} onPress={() => router.push('pages/StartChargingModal')}>Charge Now</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.removeVehicleText}>Remove Vehicle</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default VehicleProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  appBar: {
    paddingTop: 60,
    paddingBottom: 4,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  edit: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageAndStatsRow: {
    flexDirection: 'row',
    alignItems: 'center', // This centers items vertically
    justifyContent: 'space-between',
  },
  image: {
    width: 180,
    height: 301,
    resizeMode: 'contain',
  },
  rightStats: {
    flex: 1,
    marginLeft: 20, // Increased margin for better spacing
    justifyContent: 'center', // Centers content vertically within the container
  },
  statItem: {
    marginBottom: 18,
    // Removed alignItems: 'flex-start' to allow natural centering
  },
  statValue: {
    fontSize: 24,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
  },
  connectorSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 74,
  },
  connectorWrapper: {
    wflex: 1,
  },
  connectorCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    marginTop: 8,
    marginRight: 30, // ensure no unintentional gap
    width: '100%',  // fill the wrapper properly
  },
  connectorIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  connectorType: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    textAlign: 'center',
  },
  connectorPower: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.HighlightText,
    marginVertical: 4,
  },
  connectorLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
  },
  chargeNowButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  chargeNowText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  removeVehicleText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: '#E53935',
    textAlign: 'center',
    marginTop: 8,
  },
});
