import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
// Only import the correct scanner component
import BarcodeScanner from '../../components/BarcodeScanner';

const StartChargingScreen = () => {
  const navigation = useNavigation();

// Removed BarcodeScannerComponent as it's not needed and image is missing


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Start Charging</Text>
        <View style={{ width: 24 }} /> {/* Placeholder for alignment */}
      </View>

      {/* Instruction */}
      <Text style={styles.subtitle}>
        Scan the QR code on the charger{'\n'}to start charging
      </Text>

      {/* QR Scan Box */}
      <View style={styles.qrBox}>
        <BarcodeScanner
          onScanned={(data) => {
            console.log('Scanned:', data);
          }}
        />
      </View>

      {/* Footer text */}
      <Text style={styles.footerText}>Point camera to QR</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.secondaryText,
    marginTop: 24,
    fontFamily: fonts.PlusJakartaSans,
  },
  qrBox: {
    marginTop: 48,
    width: 240,
    height: 240,
    borderRadius: 16,
    backgroundColor: '#E9F7F4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  footerText: {
    marginTop: 24,
    fontSize: 14,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
});

export default StartChargingScreen;
