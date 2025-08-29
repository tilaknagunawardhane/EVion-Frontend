import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  TouchableWithoutFeedback
} from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import stationIcon from '../../assets/map/station-icon.png';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { router } from 'expo-router';
import colors from '../../constants/color';
import SearchContainer from '../../components/maps/SearchContainer';
import StationInfoCard from '../../components/maps/StationInfoCard';
import SuggestionsDropdown from '../../components/maps/SuggestionsDropdown';
import chargingStations from '../../utils/ChargingStations';
import { useRouter } from 'expo-router';

const GOOGLE_API_KEY = GOOGLE_MAPS_API_KEY;

export default function MapScreen() {
  const router = useRouter();
  
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [nearbyStations, setNearbyStations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);

  // Get user location
  useEffect(() => {
    console.log('Requesting location permissions...');
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log('Location permission status:', status);
        if (status !== 'granted') {
          setErrorMsg('Permission denied');
          return;
        }

        console.log('Getting current position...');
        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeout: 15000,
        });
        console.log('Location received:', loc.coords);
        setLocation(loc.coords);
      } catch (err) {
        console.error('Location error:', err);
        setErrorMsg('Failed to get location');
        
        // Fallback to Colombo if location fails
        setLocation({
          latitude: 6.9271,
          longitude: 79.8612,
        });
      }
    })();
  }, []);

  // Center map on user location when map is loaded
  useEffect(() => {
    if (location && mapRef.current && mapLoaded) {
      console.log('Animating to location:', location);
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  }, [location, mapLoaded]);

  // Find nearby stations
  useEffect(() => {
    if (location) {
      const nearby = chargingStations.filter((station) => {
        const distance = getDistanceFromLatLonInKm(
          location.latitude,
          location.longitude,
          station.latitude,
          station.longitude
        );
        return distance <= 10;
      });
      console.log('Found nearby stations:', nearby.length);
      setNearbyStations(nearby);
    }
  }, [location]);

  // Calculate distance between coordinates
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
    return R * c;
  };

  // Fetch place suggestions
  const fetchSuggestions = React.useCallback(async (input) => {
    if (!input || input.trim() === '') {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_API_KEY}&components=country:lk`
      );
      setSuggestions(response.data.status === 'OK' ? response.data.predictions : []);
    } catch (error) {
      console.error('Places API error:', error);
      setSuggestions([]);
    }
  }, []);

  // Handle search
  const handleSearch = async (placeId = null, description = null) => {
    if (!searchQuery.trim() && !description) return;

    try {
      let coords;
      if (placeId) {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
        );
        const { lat, lng } = response.data.result.geometry.location;
        coords = { latitude: lat, longitude: lng };
        setSearchQuery(description);
      } else {
        const geocoded = await Location.geocodeAsync(searchQuery);
        if (geocoded.length === 0) {
          Alert.alert('No results found');
          return;
        }
        coords = geocoded[0];
      }

      mapRef.current?.animateToRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);

      const nearby = chargingStations.filter(station =>
        getDistanceFromLatLonInKm(
          coords.latitude,
          coords.longitude,
          station.latitude,
          station.longitude
        ) <= 3
      );

      setNearbyStations(nearby);
      setShowDropdown(nearby.length > 0);
      setSuggestions([]);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error searching for location');
    }
  };

  // Recenter map
  const reCenter = () => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
    setSearchQuery('');
    setShowDropdown(false);
    setSuggestions([]);
    setSelectedStation(null);
  };

  // Navigate to directions
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

  // Handle marker press
  const handleMarkerPress = (station) => {
    console.log('Marker pressed:', station.title);
    setSelectedStation(station);
    // Center map on selected station
    mapRef.current?.animateToRegion({
      latitude: station.latitude,
      longitude: station.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 300);
  };

  // Combine suggestions
  const combinedSuggestions = [
    ...chargingStations
      .filter(station =>
        station.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        searchQuery.trim() !== ''
      )
      .map(station => ({
        id: station.id,
        description: station.title,
        isLocal: true,
        latitude: station.latitude,
        longitude: station.longitude,
        address: station.address,
      })),
    ...suggestions
  ];

  // Loading states
  if (errorMsg && !location) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>❌ {errorMsg}</Text>
        <Text style={{ marginTop: 10 }}>Using default location</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10 }}>Fetching your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={false}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onMapReady={() => {
          console.log('Map is ready');
          setMapLoaded(true);
        }}
        onPress={() => {
          setSelectedStation(null);
          setSuggestions([]);
        }}
        mapType="standard"
      >
        {/* User Location Marker (optional) */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Your Location"
          description="You are here"
        >
          <View style={styles.userLocationMarker}>
            <MaterialIcons name="person-pin-circle" size={40} color={colors.primary} />
          </View>
        </Marker>

        {/* Charging Station Markers */}
        {chargingStations.map(station => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
            title={station.title}
            description={station.description}
            onPress={() => handleMarkerPress(station)}
          >
            <Image 
              source={stationIcon} 
              style={{ width: 48, height: 48 }} 
              resizeMode="contain"
            />
          </Marker>
        ))}
      </MapView>

      {/* Map loading indicator overlay */}
      {!mapLoaded && (
        <View style={styles.mapLoadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.mapLoadingText}>Loading map...</Text>
        </View>
      )}

      {/* Transparent overlay for suggestions */}
      {suggestions.length > 0 && (
        <TouchableWithoutFeedback onPress={() => {
          setSuggestions([]);
          setSelectedStation(null);
        }}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Search Bar */}
      <SearchContainer
        searchQuery={searchQuery}
        setSearchQuery={(text) => {
          setSearchQuery(text);
          fetchSuggestions && fetchSuggestions(text);
        }}
        handleSearch={() => handleSearch()}
        onFilterPress={() => router.push('/pages/Filters')}
        fetchSuggestions={fetchSuggestions}
        onFocus={() => fetchSuggestions && searchQuery && fetchSuggestions(searchQuery)}
      />

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <SuggestionsDropdown
          suggestions={combinedSuggestions}
          getDetails={async (placeId, isLocal, lat, lng) => {
            if (isLocal) return { lat, lng };
            try {
              const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
              );
              const { lat: gLat, lng: gLng } = response.data.result.geometry.location;
              return { lat: gLat, lng: gLng };
            } catch (error) {
              console.error('Details fetch error:', error);
              return null;
            }
          }}
          onSelect={(details, description, isLocal) => {
            setSearchQuery(description);
            setSuggestions([]);
            details && navigateToDirections(details.lat, details.lng, description);
          }}
        />
      )}

      {/* Nearby Stations List */}
      {showDropdown && nearbyStations.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={nearbyStations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => navigateToDirections(
                  item.latitude,
                  item.longitude,
                  item.title
                )}
              >
                <Text>{item.title}</Text>
                <Text style={styles.distanceText}>
                  {getDistanceFromLatLonInKm(
                    location.latitude,
                    location.longitude,
                    item.latitude,
                    item.longitude
                  ).toFixed(2)} km away
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Station Info Card */}
      {selectedStation && (
        <StationInfoCard
          station={selectedStation}
          onClose={() => {
            console.log('Closing station info card');
            setSelectedStation(null);
            reCenter();
          }}
          onNavigate={(station) => {
            navigateToDirections(
              station.latitude,
              station.longitude,
              station.title
            );
            setSelectedStation(null);
          }}
        />
      )}

      {/* Recenter Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          { bottom: selectedStation ? 180 : 100 }
        ]}
        onPress={reCenter}
      >
        <MaterialIcons name="my-location" size={24} color="#fff" />
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
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 5,
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 10,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nearbyMenu: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    maxHeight: 200,
  },
  nearbyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.black,
  },
  nearbyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  nearbyItemText: {
    marginLeft: 12,
    flex: 1,
  },
  nearbyItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },
  nearbyItemDistance: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
  mapLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  mapLoadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.gray,
  },
  userLocationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});