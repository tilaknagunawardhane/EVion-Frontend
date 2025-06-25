import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';
import * as ExpoMaps from 'expo-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { useLocalSearchParams, useNavigation } from 'expo-router';

export default function DirectionsScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();

  const [userLocation] = useState({
    latitude: parseFloat(params.userLatitude),
    longitude: parseFloat(params.userLongitude)
  });
  const [destination] = useState({
    latitude: parseFloat(params.destinationLatitude),
    longitude: parseFloat(params.destinationLongitude),
    title: params.destinationTitle || 'Destination'
  });
  const [routePoints, setRoutePoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    console.log('RoutePoints updated:', routePoints.length, 'points');
    if (routePoints.length > 0) {
      console.log('First point:', routePoints[0]);
      console.log('Last point:', routePoints[routePoints.length - 1]);
    }
  }, [routePoints]);

  useEffect(() => {
    if (mapReady && routePoints.length > 0 && mapRef.current?.setCameraPosition) {
      console.log('Setting camera to show route');
      // Center between start and end points to show the route
      const centerLat = (userLocation.latitude + destination.latitude) / 2;
      const centerLng = (userLocation.longitude + destination.longitude) / 2;
      
      mapRef.current.setCameraPosition({
        coordinates: { latitude: centerLat, longitude: centerLng },
        zoom: 12,
        duration: 1000,
      });
    }
  }, [mapReady, routePoints]);

  const fetchRoute = async () => {
    setLoading(true);
    console.log('API Key:', GOOGLE_MAPS_API_KEY); // Add this at the top of your component
    try {
      // Verify coordinates first
      if (!userLocation.latitude || !userLocation.longitude ||
        !destination.latitude || !destination.longitude) {
        throw new Error('Invalid coordinates');
      }
      console.log('Fetching route from', userLocation, 'to', destination);

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?` +
        `origin=${userLocation.latitude},${userLocation.longitude}` +
        `&destination=${destination.latitude},${destination.longitude}` +
        `&key=${GOOGLE_MAPS_API_KEY}` +
        `&mode=driving` // Explicitly set travel mode
      );

      console.log('Directions API Response:', response.data); // Debug log
      // console.log('Full API response:', JSON.stringify(response.data, null, 2));

      if (response.data.status !== 'OK') {
        throw new Error(response.data.error_message || 'Directions request failed');
      }

      if (response.data.routes.length === 0) {
        Alert.alert('No routes found', 'Could not find a path between these locations');
        return;
      }

      const route = response.data.routes[0];
      const points = decodePolyline(route.overview_polyline.points);
      setRoutePoints(points);
      console.log('Decoded points:', points.slice(0, 5), '... total points:', points.length);
      console.log('Route points set:', points.length > 0 ? 'Yes' : 'No');
      console.log('Sample point structure:', points[0]);
      console.log('Polyline structure:', {
        id: 'route',
        coordinates: points.slice(0, 3),
        strokeColor: '#007AFF',
        strokeWidth: 4
      });

      if (route.legs.length > 0) {
        const leg = route.legs[0];
        setDistance(leg.distance.text);
        setDuration(leg.duration.text);
      }

    } catch (error) {
      console.error('Directions error:', error);
      Alert.alert(
        'Route Error',
        error.message || 'Failed to get directions. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const decodePolyline = (encoded) => {
    const points = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({
        latitude: lat * 1e-5,
        longitude: lng * 1e-5
      });
    }

    return points;
  };

  const recenterMap = () => {
    console.log('Recenter button pressed');
    
    if (mapRef.current?.setCameraPosition) {
      if (routePoints.length > 0) {
        // Center between start and end points to show the route
        const centerLat = (userLocation.latitude + destination.latitude) / 2;
        const centerLng = (userLocation.longitude + destination.longitude) / 2;
        
        mapRef.current.setCameraPosition({
          coordinates: userLocation,
          zoom: 12,
          duration: 1000,
        });
      } else {
        // Just center on user location
        mapRef.current.setCameraPosition({
          coordinates: userLocation,
          zoom: 15,
          duration: 1000,
        });
      }
    }
  };

  useEffect(() => {
    fetchRoute();
  }, []);

  const MapNamespace = Platform.OS === 'ios' ? ExpoMaps.AppleMaps : ExpoMaps.GoogleMaps;
  const MapViewComponent = MapNamespace.View;

  return (
    <View style={{ flex: 1 }}>
      {/* Header with back button and destination info */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.destinationTitle} numberOfLines={1}>
            {destination.title}
          </Text>
          {distance && duration && (
            <Text style={styles.distanceDuration}>
              {distance} • {duration}
            </Text>
          )}
        </View>
      </View>

      {loading && <ActivityIndicator size="large" style={styles.loader} />}

      <MapViewComponent
        ref={mapRef}
        style={{ flex: 1 }}
        camera={{
          centerCoordinate: {
            latitude: (userLocation.latitude + destination.latitude) / 2,
            longitude: (userLocation.longitude + destination.longitude) / 2
          },
          zoom: 12,
        }}
        onMapReady={() => {
          console.log('Map is ready');
          console.log('Current routePoints:', routePoints.length);
          // Add a small delay to ensure map is fully ready
          setTimeout(() => {
            setMapReady(true);
          }, 100);
        }}
        markers={[
          {
            id: 'start',
            coordinates: userLocation,
            title: 'Your Location',
            description: 'Current position',
            icon: { uri: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png' }
          },
          {
            id: 'end',
            coordinates: destination,
            title: destination.title,
            description: 'Destination',
            icon: { uri: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png' }
          },
        ]}
        polylines={routePoints.length > 0 ? [
          {
            id: 'route',
            coordinates: routePoints,
            strokeColor: '#007AFF',
            strokeWidth: 4
          }
        ] : []}
      />

      {/* Route details at bottom */}
      {distance && duration && (
        <View style={styles.routeInfo}>
          <View style={styles.routeInfoRow}>
            <MaterialIcons name="directions-car" size={24} color="#007AFF" />
            <Text style={styles.routeInfoText}>{duration} ({distance})</Text>
          </View>
          <Text style={styles.destinationText} numberOfLines={2}>
            To: {destination.title}
          </Text>
        </View>
      )}

      {/* Recenter Button */}
      <TouchableOpacity 
        style={styles.recenterButton} 
        onPress={recenterMap}
        activeOpacity={0.7}
      >
        <MaterialIcons name="my-location" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#007AFF',
    padding: 15,
    paddingTop: 50,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  destinationTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  distanceDuration: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 10,
    transform: [{ translateX: -18 }, { translateY: -18 }],
  },
  routeInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  routeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  routeInfoText: {
    fontSize: 16,
    marginLeft: 10,
  },
  destinationText: {
    fontSize: 14,
    color: '#666',
  },
  recenterButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    zIndex: 20,
  },
});

