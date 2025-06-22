import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { AppleMaps, GoogleMaps } from 'expo-maps';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.centered}>
        <Text>❌ {errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Getting your location...</Text>
      </View>
    );
  }

  const { latitude, longitude } = location;

  // Render only after location is ready
  const mapProps = {
    style: styles.map,
    initialCamera: {
      centerCoordinate: { latitude, longitude },
      zoom: 15,
    },
    showsUserLocation: true,
  };

  if (Platform.OS === 'ios') {
    return <AppleMaps.View {...mapProps} />;
  }

  if (Platform.OS === 'android') {
    return <GoogleMaps.View {...mapProps} />;
  }

  return (
    <View style={styles.centered}>
      <Text>Maps only supported on Android and iOS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
