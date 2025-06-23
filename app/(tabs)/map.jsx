import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import * as ExpoMaps from 'expo-maps';
import { MaterialIcons } from '@expo/vector-icons';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

   useEffect(() => {
    (async () => {
      // 1. Check if services are enabled
      let servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setErrorMsg('Enable location services in device settings');
        return;
      }

      // 2. Request permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission denied');
        return;
      }

      // 3. Get location with high accuracy
      try {
        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeout: 15000, // 15 seconds timeout
        });
        console.log('Location data:', loc.coords);
        setLocation(loc.coords);
      } catch (err) {
        console.error('Location error:', err);
        setErrorMsg('Failed to get location');
      }
    })();
  }, []);

  // Auto-center map when location updates
  useEffect(() => {
    if (location && mapRef.current?.setCameraPosition) {
      mapRef.current.setCameraPosition({
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        zoom: 15,
        duration: 1000,
      });
    }
  }, [location]);

  // Re-center button functionality
  const reCenter = () => {
    if (mapRef.current?.setCameraPosition && location) {
      mapRef.current.setCameraPosition({
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        zoom: 15,
        duration: 1000,
      });
    }
  };

  // Error and loading states
  if (errorMsg) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>❌ {errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Fetching your location...</Text>
      </View>
    );
  }

  // Select correct map component
  const MapNamespace = Platform.OS === 'ios' ? ExpoMaps.AppleMaps : ExpoMaps.GoogleMaps;
  const MapViewComponent = MapNamespace.View;

  return (
    <View style={styles.container}>
      <MapViewComponent
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        userLocationPriority="high"
        userLocationUpdateInterval={5000}
        camera={{
          centerCoordinate: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          zoom: 15,
        }}
        markers={[
          {
            id: 'user-location', // ✅ Unique ID is required
            coordinate: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
            title: 'You are here',
            description: 'Current location',
          },
        ]}
      />
      <TouchableOpacity style={styles.fab} onPress={reCenter}>
        <MaterialIcons name="my-location" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
