import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import BarcodeScanner from '../../components/BarcodeScanner';
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const StartChargingScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [chargerId, setChargerId] = useState('');

  const handleBarCodeScanned = (data) => {
    setIsCameraActive(false);
    alert(`QR Code Scanned: ${data}`);
    router.push('/pages/WaitingConnection');
  };

  const handleManualSubmit = () => {
    if (!chargerId.trim()) {
      alert('Please enter a charger ID');
      return;
    }
    alert(`Charger ID Entered: ${chargerId}`);
    router.push('/pages/WaitingConnection');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerGroup}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color={colors.mainTextColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Start Charging</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.subtitle}>
          Scan the QR code on the charger{'\n'}to start charging
        </Text>
      </View>

      {/* QR Scanner Section */}
      <View style={styles.qrContainer}>
        <TouchableOpacity
          style={styles.qrBox}
          activeOpacity={0.7}
          onPress={() => setIsCameraActive(true)}
          disabled={isCameraActive}
        >
          {isCameraActive ? (
            <BarcodeScanner
              style={StyleSheet.absoluteFill}
              onScanned={handleBarCodeScanned}
            />
          ) : (
            <>
              <Text style={styles.tapText}>Tap to open camera</Text>
            </>
          )}

          {/* Corners */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </TouchableOpacity>

        {/* OR separator */}
        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        {/* Manual Input */}
        <View style={styles.manualInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Charger ID"
            placeholderTextColor={colors.secondaryText}
            value={chargerId}
            onChangeText={setChargerId}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleManualSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>Point camera to QR</Text>
    </View>
  );
};

const cornerSize = SCREEN_WIDTH * 0.090;
const cornerThickness = 2;
const inset = 26;
const qrBoxSize = SCREEN_WIDTH * 0.75;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  headerGroup: {
    paddingTop: 60,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrBox: {
    width: qrBoxSize,
    height: qrBoxSize,
    borderRadius: 16,
    backgroundColor: '#E9F7F4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    overflow: 'hidden',
    position: 'relative',
  },
  tapText: {
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 14,
    color: colors.secondaryText,
    marginHorizontal: 10,
  },
  manualInputContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  submitText: {
    color: '#fff',
    fontFamily: fonts.PlusJakartaSansBold,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    marginBottom: 40,
  },
  corner: {
    position: 'absolute',
    width: cornerSize,
    height: cornerSize,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  topLeft: {
    top: inset,
    left: inset,
    borderTopWidth: cornerThickness,
    borderLeftWidth: cornerThickness,
  },
  topRight: {
    top: inset,
    right: inset,
    borderTopWidth: cornerThickness,
    borderRightWidth: cornerThickness,
  },
  bottomLeft: {
    bottom: inset,
    left: inset,
    borderBottomWidth: cornerThickness,
    borderLeftWidth: cornerThickness,
  },
  bottomRight: {
    bottom: inset,
    right: inset,
    borderBottomWidth: cornerThickness,
    borderRightWidth: cornerThickness,
  },
});

export default StartChargingScreen;
