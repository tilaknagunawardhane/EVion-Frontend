import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Alert
} from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import * as ExpoMaps from 'expo-maps';
import { MaterialIcons } from '@expo/vector-icons';
import stationIcon from '../../assets/map/station-icon.png';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import SearchContainer from '../../components/maps/SearchContainer';

const GOOGLE_API_KEY = GOOGLE_MAPS_API_KEY; // Fixed this line (removed curly braces)

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [nearbyStations, setNearbyStations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef(null);
  const navigation = useNavigation();

  const chargingStations = [
    { id: 'station1', latitude: 6.9271, longitude: 79.8612, title: 'Station 1', description: 'Charging Station 1' },
    { id: 'station2', latitude: 6.9150, longitude: 79.8630, title: 'Station 2', description: 'Charging Station 2' },
    { id: 'station3', latitude: 6.9300, longitude: 79.8700, title: 'Station 3', description: 'Charging Station 3' },
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
        coordinates: { latitude: location.latitude, longitude: location.longitude },
        zoom: 13,
        duration: 1000,
      });
    }
  }, [location]);

  // Show nearby stations when location is available
  useEffect(() => {
    if (location) {
      const nearby = chargingStations.filter((station) => {
        const distance = getDistanceFromLatLonInKm(location.latitude, location.longitude, station.latitude, station.longitude);
        return distance <= 10; // Show stations within 10km
      });
      setNearbyStations(nearby);
      // setShowDropdown(nearby.length > 0);
    }
  }, [location]);

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  };

  const fetchSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_API_KEY}`
      );

      if (response.data.status === 'OK') {
        setSuggestions(response.data.predictions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Places API error:', error);
    }
  };

  const handleSearch = async (placeId = null, description = null) => {
    if (!searchQuery.trim() && !description) return;

    try {
      let geocodedLocations;

      if (placeId) {
        // Get coordinates from place ID
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
        );

        const { lat, lng } = response.data.result.geometry.location;
        geocodedLocations = [{ latitude: lat, longitude: lng }];
        setSearchQuery(description);
      } else {
        geocodedLocations = await Location.geocodeAsync(searchQuery);
      }

      if (geocodedLocations.length === 0) {
        Alert.alert('No results found for this location.');
        setShowDropdown(false);
        return;
      }

      const { latitude, longitude } = geocodedLocations[0];

      mapRef.current?.setCameraPosition({
        coordinates: { latitude, longitude },
        zoom: 14,
        duration: 1000,
      });

      const nearby = chargingStations.filter((station) => {
        const distance = getDistanceFromLatLonInKm(latitude, longitude, station.latitude, station.longitude);
        return distance <= 3;
      });

      setNearbyStations(nearby);
      setShowDropdown(nearby.length > 0);
      setSuggestions([]);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error searching for location.');
      setShowDropdown(false);
    }
  };

  const reCenter = () => {
    if (mapRef.current?.setCameraPosition && location) {
      mapRef.current.setCameraPosition({
        coordinates: { latitude: location.latitude, longitude: location.longitude },
        zoom: 15,
        duration: 1000,
      });
    }
    setNearbyStations([]);
    setSearchQuery('');
    setShowDropdown(false);
    setSuggestions([]);
  };

  const showAllStations = () => {
    setNearbyStations(chargingStations);
    setShowDropdown(true);
  };

  const navigateToDirections = (destinationLat, destinationLng, destinationTitle) => {
    if (!location) return;
    
    router.push({
      pathname: '/pages/maps/DirectionsScreen',
      params: {
        userLatitude: location.latitude,
        userLongitude: location.longitude,
        destinationLatitude: destinationLat,
        destinationLongitude: destinationLng,
        destinationTitle: destinationTitle || 'Destination'
      }
    });
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
          centerCoordinate: { latitude: location.latitude, longitude: location.longitude },
          zoom: 15,
        }}
        markers={[
          { id: 'user-location', coordinates: { latitude: location.latitude, longitude: location.longitude }, title: 'You are here', snippet: 'Current location', description: 'Current location' },
          ...chargingStations.map((station) => ({
            id: station.id,
            coordinates: { latitude: station.latitude, longitude: station.longitude },
            title: station.title,
            snippet: station.description,
            description: station.description,
            icon: { uri: Image.resolveAssetSource(stationIcon).uri, width: 40, height: 40 }
          })),
        ]}
      />

      {/* Search Bar */}
      <SearchContainer
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        fetchSuggestions={fetchSuggestions}
        handleSearch={handleSearch}
      />

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={async () => {
                  try {
                    const response = await axios.get(
                      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=${GOOGLE_API_KEY}`
                    );

                    const { lat, lng } = response.data.result.geometry.location;
                    navigateToDirections(lat, lng, item.description);
                  } catch (error) {
                    console.error('Error fetching place details:', error);
                    Alert.alert('Error fetching location details.');
                  }
                }}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Show Nearby Stations Dropdown */}
      {showDropdown && nearbyStations.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={nearbyStations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => navigateToDirections(item.latitude, item.longitude, item.title)}
              >
                <Text>{item.title}</Text>
                <Text style={styles.distanceText}>
                  {getDistanceFromLatLonInKm(location.latitude, location.longitude, item.latitude, item.longitude).toFixed(2)} km away
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Recenter Button */}
      <TouchableOpacity style={styles.fab} onPress={reCenter}>
        <MaterialIcons name="my-location" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Show All Stations Button */}
      <TouchableOpacity style={[styles.fab, styles.stationsFab]} onPress={showAllStations}>
        <MaterialIcons name="local-gas-station" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  resultsContainer: {
    position: 'absolute',
    top: 110,
    left: 20,
    right: 20,
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    zIndex: 10,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
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
  stationsFab: {
    bottom: 90,
    right: 20,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});