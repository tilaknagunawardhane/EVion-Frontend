import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import inputfields from '../../components/InputField'; // Adjust the path as necessary
import BarcodeScanner from '../../components/BarcodeScanner'; // Assuming you want to use this component


const WaitingConnectionScreen = () => {
  const router = useRouter();

  // Optional auto-navigate after timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/pages/ChargeConnected'); // Navigate to ChargeConnected page
    }, 4000);
    return () => clearTimeout(timeout);
  }, []);

return (
    <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/pages/StartCharging')}>
                <Ionicons name="chevron-back" size={24} color={colors.mainTextColor} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Waiting for Connection</Text>
            <View style={{ width: 24 }} /> {/* For spacing balance */}
        </View>

        {/* Subtitle */}
        <Text style={styles.subText}>Please connect your vehicle to{'\n'}the charger</Text>

        {/* Main content area with centered EV Image */}
        <View style={styles.mainContent}>
            <Image
                source={require('../../assets/EVChargingV.png')} // Replace with your actual image path
                style={styles.evImage}
            />
        </View>

        {/* Spinner + Label at bottom */}
        <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#FF4444" />
            <Text style={styles.loadingText}>Standing by..</Text>
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
    width: '100%',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  subText: {
    fontSize: 14,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 24,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  evImage: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
  },
  loaderContainer: {
    alignItems: 'center',
    paddingBottom: 80,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
});

export default WaitingConnectionScreen;
