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

    // Fetch user location on mount
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
        })();
    }, []);

    // Fetch user location on mount
useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  })();
}, []);

// Auto-center the map once location state is set
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


    // Function to re-center map on user's location
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

    // Show error if permission is denied
    if (errorMsg) {
        return (
            <View style={styles.centered}>
                <Text style={{ color: 'red' }}>❌ {errorMsg}</Text>
            </View>
        );
    }

    // Show loading indicator while location is loading
    if (!location) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text>Fetching your location...</Text>
            </View>
        );
    }

    // Get correct map namespace based on platform
    const MapNamespace = Platform.OS === 'ios' ? ExpoMaps.AppleMaps : ExpoMaps.GoogleMaps;
    const MapViewComponent = MapNamespace.View;

    // Render map only when location is available
    return (
        <View style={{ flex: 1 }}>
            <MapViewComponent
                ref={mapRef}
                style={styles.map}
                showsUserLocation={true}
                camera={{
                    centerCoordinate: {
                        latitude: location.latitude,
                        longitude: location.longitude,
                    },
                    zoom: 15,
                }}
            />
            <TouchableOpacity style={styles.fab} onPress={reCenter}>
                <MaterialIcons name="my-location" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
