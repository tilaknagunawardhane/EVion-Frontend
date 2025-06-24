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

  // Example charging stations (replace with backend later)
  const chargingStations = [
    {
      id: 'station1',
      latitude: 6.9271,
      longitude: 79.8612,
      title: 'Station 1',
      description: 'Charging Station 1',
    },
    {
      id: 'station2',
      latitude: 6.9150,
      longitude: 79.8630,
      title: 'Station 2',
      description: 'Charging Station 2',
    },
    {
      id: 'station3',
      latitude: 6.9300,
      longitude: 79.8700,
      title: 'Station 3',
      description: 'Charging Station 3',
    },
  ];

  useEffect(() => {
    (async () => {
      let servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        setErrorMsg('Enable location services in device settings');
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission denied');
        return;
      }

      try {
        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeout: 15000,
        });
        console.log('Location data:', loc.coords);
        setLocation(loc.coords);
      } catch (err) {
        console.error('Location error:', err);
        setErrorMsg('Failed to get location');
      }
    })();
  }, []);

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
          // User's location marker
          {
            id: 'user-location',
            coordinates: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
            title: 'You are here',
            snippet: 'Current location',
            description: 'Current location',
          },
          // Charging station markers
          ...chargingStations.map((station) => ({
            id: station.id,
            coordinates: {
              latitude: station.latitude,
              longitude: station.longitude,
            },
            title: station.title,
            snippet: station.description,
            description: station.description,
          })),
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
