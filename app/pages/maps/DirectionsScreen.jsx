import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Image,
  StatusBar
} from 'react-native';
import axios from 'axios';
import * as ExpoMaps from 'expo-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import AppBar from '../../../components/AppBar';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import SearchContainer from '../../../components/maps/SearchContainer';

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
  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState('');
  const [fromCoords, setFromCoords] = useState({
    latitude: parseFloat(params.userLatitude),
    longitude: parseFloat(params.userLongitude)
  });
  const [toCoords, setToCoords] = useState({
    latitude: parseFloat(params.destinationLatitude),
    longitude: parseFloat(params.destinationLongitude)
  });

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

  useEffect(() => {
    setFromText('Your Location');
    setToText(params.destinationTitle || 'Destination');
  }, []);

  useEffect(() => {
    if (fromCoords && toCoords) {
      fetchRoute(fromCoords, toCoords);
    }
  }, [fromCoords, toCoords]);

  const fetchRoute = async (start = fromCoords, end = toCoords) => {
    setLoading(true);
    try {
      if (!start.latitude || !start.longitude || !end.latitude || !end.longitude) {
        throw new Error('Invalid coordinates');
      }
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?` +
        `origin=${start.latitude},${start.longitude}` +
        `&destination=${end.latitude},${end.longitude}` +
        `&key=${GOOGLE_MAPS_API_KEY}` +
        `&mode=driving`
      );
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

  const geocodeAddress = async (address, setCoords, setText) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      if (response.data.status === 'OK') {
        const loc = response.data.results[0].geometry.location;
        setCoords({ latitude: loc.lat, longitude: loc.lng });
        setText(response.data.results[0].formatted_address);
      } else {
        Alert.alert('Location not found', 'Please enter a valid location.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to search location.');
    }
  };

  const MapNamespace = Platform.OS === 'ios' ? ExpoMaps.AppleMaps : ExpoMaps.GoogleMaps;
  const MapViewComponent = MapNamespace.View;

  return (
    <View style={ styles.container }>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image
            source={require('../../../assets/back-icon.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

      {/* Input fields for From and To */}
      <View style={styles.inputContainer}>
       
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={fromText}
            onChangeText={setFromText}
            placeholder="From"
            onSubmitEditing={() => {
              Keyboard.dismiss();
              geocodeAddress(fromText, setFromCoords, setFromText);
            }}
            returnKeyType="search"
            placeholderTextColor={colors.secondaryText}
          />
          {fromText.length > 0 && (
            <TouchableOpacity
              style={styles.clearIcon}
              onPress={() => setFromText('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="close" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={toText}
            onChangeText={setToText}
            placeholder="To"
            onSubmitEditing={() => {
              Keyboard.dismiss();
              geocodeAddress(toText, setToCoords, setToText);
            }}
            returnKeyType="search"
            placeholderTextColor={colors.secondaryText}
          />
          {toText.length > 0 && (
            <TouchableOpacity
              style={styles.clearIcon}
              onPress={() => setToText('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="close" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* Header with back button and destination info */}
      {/* <View style={styles.header}>
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
      </View> */}

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
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 50,
    left: 16,
    zIndex: 20,
    backgroundColor: `${colors.stroke}6D`,
    borderRadius: 20,
    padding: 10,
  },
  backIcon: {
    width: 18,
    height: 18,
    tintColor: colors.mainTextColor,
    resizeMode: 'contain',
  },
  searchContainer: {
    position: 'relative',
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  searchInput: { 
    flex: 1, 
    paddingVertical: 8, 
    fontFamily: fonts.PlusJakartaSans, 
    color: colors.mainTextColor 
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
  inputContainer: {
    position: 'absolute',
    gap: 10,
    marginTop: 100,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    paddingRight: 35, // space for clear icon
  },
  clearIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    marginTop: -12,
    zIndex: 2,
  },
});

