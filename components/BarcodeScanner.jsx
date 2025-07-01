import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import colors from '../constants/color'; // Adjust the path as necessary
import InputField from './InputField';
const BarcodeScanner = ({ onScanned, style }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      if (onScanned) onScanned(data);
      // Optionally reset scanned after a delay if you want to scan again
      setTimeout(() => setScanned(false), 2000);
    }
  };
  if (permission === null) {
    return (
      <View style={[styles.scannerContainer, styles.center]}>
        <ActivityIndicator size="large" color="#00C897" />
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={[styles.scannerContainer, styles.center]}>
        <Text style={styles.permissionText}>No access to camera</Text>
      </View>
    );
  }

  return (
    <CameraView
      onBarcodeScanned={handleBarCodeScanned}
      barcodeScannerSettings={{
        barcodeTypes: [
          'qr',
          'ean13',
          'code128',
          'code39',
          'code93',
          'pdf417',
          'upc_a',
          'upc_e',
          'aztec',
          'datamatrix',
          'itf14',
        ],
      }}
      style={[styles.scannerContainer, style]}
    />
  );
};


const styles = StyleSheet.create({
  scannerContainer: {
    width: 220,
    height: 220,
    overflow: 'hidden',
    borderRadius: 16,
  },
  permissionText: {
    color:colors.MainTextColor,
    fontSize: 14,
    textAlign: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default BarcodeScanner;
