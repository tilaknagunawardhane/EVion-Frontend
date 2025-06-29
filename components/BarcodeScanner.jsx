import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';

const BarcodeScannerComponent = ({ onScanned }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  useEffect(() => {
    
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
 

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    if (onScanned) {
      onScanned(data); // Pass scanned data to parent
    } else {
      Alert.alert('QR Code Scanned', `Type: ${type}\nData: ${data}`);
    }
  };

  if (hasPermission === null) {
    return <ActivityIndicator size="large" color="#00C897" />;
  }

  if (hasPermission === false) {
    return <Text style={styles.permissionText}>No access to camera</Text>;
  }
  return (
    <View style={styles.scannerContainer}>
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeScannerSettings={{
          barCodeTypes: ['qr', 'ean13', 'code128', 'code39', 'code93', 'pdf417', 'upc_a', 'upc_e', 'aztec', 'datamatrix', 'itf14'],
        }}
      />
    </View>
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
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default BarcodeScannerComponent;
