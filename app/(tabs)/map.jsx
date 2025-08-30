import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../../constants/color';

// Import your API key from environment variables
import { OPEN_CHARGE_MAP_API_KEY } from '@env';

// Components
import SearchContainer from '../../components/maps/SearchContainer';
import StationDetailsModal from '../../components/maps/StationDetailsModal';
import LoadingOverlay from '../../components/maps/LoadingOverlay';
import UserLocationMarker from '../../components/maps/UserLocationMarker';
import ChargingStationMarker from '../../components/maps/ChargingStationMarker';

// Utils
import { getDistanceFromLatLonInKm } from '../../utils/mapUtils';

const OPEN_CHARGE_MAP_API_URL = 'https://api.openchargemap.io/v3/poi';

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef(null);
  
  // State management
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [chargingStations, setChargingStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [stationsLoaded, setStationsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get user location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Load charging stations when location is available
  useEffect(() => {
    if (location && !stationsLoaded) {
      loadChargingStations();
    }
  }, [location, stationsLoaded]);

  // Center map on user location when map is ready
  useEffect(() => {
    if (location && mapRef.current && mapLoaded) {
      centerMapOnUserLocation();
    }
  }, [location, mapLoaded]);

  const getUserLocation = async () => {
    try {
      console.log('Requesting location permissions...');
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('Location permission denied');
        Alert.alert('Permission Required', 'Location permission is required to show your location on the map.');
        // Fallback to Colombo, Sri Lanka
        setLocation({
          latitude: 6.9271,
          longitude: 79.8612,
        });
        return;
      }

      console.log('Getting current position...');
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 30000,
        maximumAge: 10000,
      });
      
      console.log('Location received:', loc.coords);
      console.log('Accuracy:', loc.coords.accuracy);
      
      // Check if this looks like a simulator location (California coordinates)
      const isSimulatorLocation = (
        Math.abs(loc.coords.latitude - 37.4219983) < 0.001 &&
        Math.abs(loc.coords.longitude - (-122.084)) < 0.001
      );
      
      if (isSimulatorLocation) {
        console.log('Detected simulator location, using Sri Lanka coordinates for better testing');
        Alert.alert(
          'Simulator Location Detected', 
          'Using Sri Lanka coordinates for better charging station data. In a real device, your actual location will be used.',
          [{ text: 'OK' }]
        );
        setLocation({
          latitude: 6.9271, // Colombo
          longitude: 79.8612,
          accuracy: loc.coords.accuracy,
        });
      } else {
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          accuracy: loc.coords.accuracy,
        });
      }
      
      setErrorMsg(null);
      
    } catch (err) {
      console.error('Location error:', err);
      setErrorMsg('Failed to get location');
      Alert.alert('Location Error', 'Unable to get your location. Using Colombo, Sri Lanka as default.');
      
      // Fallback to Colombo, Sri Lanka
      setLocation({
        latitude: 6.9271,
        longitude: 79.8612,
      });
    }
  };
  
  const loadChargingStations = async () => {
    try {
      console.log('Loading charging stations...');
      
      const response = await axios.get(OPEN_CHARGE_MAP_API_URL, {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          distance: 50, // 50km radius
          maxresults: 100,
          compact: true,
          verbose: false,
          countrycode: 'LK' // Sri Lanka
        },
        headers: {
          'X-API-Key': OPEN_CHARGE_MAP_API_KEY
        }
      });

      const stations = response.data.map(station => ({
        id: station.ID,
        title: station.AddressInfo?.Title || 'Charging Station',
        description: station.AddressInfo?.AddressLine1 || 'No description available',
        latitude: station.AddressInfo?.Latitude,
        longitude: station.AddressInfo?.Longitude,
        address: `${station.AddressInfo?.AddressLine1 || ''}, ${station.AddressInfo?.Town || ''}, ${station.AddressInfo?.StateOrProvince || ''}`.trim().replace(/^,|,$/g, ''),
        town: station.AddressInfo?.Town,
        postcode: station.AddressInfo?.Postcode,
        country: station.AddressInfo?.Country?.Title,
        operatorInfo: station.OperatorInfo,
        connections: station.Connections,
        usageType: station.UsageType,
        statusType: station.StatusType,
        numberOfPoints: station.NumberOfPoints,
        phone: station.AddressInfo?.ContactTelephone1,
        website: station.AddressInfo?.RelatedURL
      })).filter(station => station.latitude && station.longitude);

      console.log(`Loaded ${stations.length} charging stations`);
      setChargingStations(stations);
      setStationsLoaded(true);
      
    } catch (error) {
      console.error('Error loading charging stations:', error);
      Alert.alert('Error', 'Failed to load charging stations');
      setStationsLoaded(true);
    }
  };

  const centerMapOnUserLocation = () => {
    if (!location || !mapRef.current) return;
    
    mapRef.current.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }, 1000);
  };

  const handleMarkerPress = (station) => {
    console.log('Marker pressed:', station.title);
    setSelectedStation(station);
    
    // Center map on selected station
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: station.latitude,
        longitude: station.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    try {
      // First, check if query matches any charging station
      const matchingStation = chargingStations.find(station =>
        station.title.toLowerCase().includes(query.toLowerCase()) ||
        station.town?.toLowerCase().includes(query.toLowerCase())
      );

      if (matchingStation) {
        handleMarkerPress(matchingStation);
        return;
      }

      // If no station found, geocode the location
      const geocoded = await Location.geocodeAsync(query);
      if (geocoded.length === 0) {
        Alert.alert('No results found', 'Please try a different search term');
        return;
      }

      const coords = geocoded[0];
      mapRef.current?.animateToRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);

      // Find nearby stations to the searched location
      const nearbyStations = chargingStations.filter(station =>
        getDistanceFromLatLonInKm(
          coords.latitude,
          coords.longitude,
          station.latitude,
          station.longitude
        ) <= 5 // 5km radius
      );

      if (nearbyStations.length > 0) {
        // Show the closest station
        const closestStation = nearbyStations.reduce((prev, current) =>
          getDistanceFromLatLonInKm(coords.latitude, coords.longitude, prev.latitude, prev.longitude) <
          getDistanceFromLatLonInKm(coords.latitude, coords.longitude, current.latitude, current.longitude)
            ? prev : current
        );
        setSelectedStation(closestStation);
      }

    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search location');
    }
  };

  const handleReCenter = () => {
    centerMapOnUserLocation();
    setSelectedStation(null);
    setSearchQuery('');
  };

  const handleTripPlan = () => {
    // Navigate to trip plan page (placeholder)
    router.push('/pages/TripPlanner1');
  };

  const handleCloseModal = () => {
    setSelectedStation(null);
  };

  // Show loading screen while getting location
  if (!location) {
    return <LoadingOverlay message="Getting your location..." />;
  }

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={false}
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
        }}
        mapType="standard"
      >
        {/* User Location Marker */}
        <UserLocationMarker location={location} />

        {/* Charging Station Markers */}
        {chargingStations.map(station => (
          <ChargingStationMarker
            key={station.id}
            station={station}
            onPress={() => handleMarkerPress(station)}
            isSelected={selectedStation?.id === station.id}
          />
        ))}
      </MapView>

      {/* Map Loading Overlay */}
      {!mapLoaded && (
        <LoadingOverlay message="Loading map..." />
      )}

      {/* Search Container */}
      <SearchContainer
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        chargingStations={chargingStations}
        onStationSelect={handleMarkerPress}
      />

      {/* Station Details Modal */}
      {selectedStation && (
        <StationDetailsModal
          station={selectedStation}
          userLocation={location}
          onClose={handleCloseModal}
          isVisible={!!selectedStation}
        />
      )}

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        {/* Re-center Button */}
        <TouchableOpacity
          style={[styles.fab, styles.recenterFab]}
          onPress={handleReCenter}
        >
          <MaterialIcons name="my-location" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Trip Plan Button */}
        <TouchableOpacity
          style={[styles.fab, styles.tripPlanFab]}
          onPress={handleTripPlan}
        >
          <MaterialIcons name="route" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stations Loading Indicator */}
      {!stationsLoaded && (
        <View style={styles.stationsLoadingIndicator}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 100,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    marginBottom: 16,
  },
  recenterFab: {
    // Additional styles for recenter button if needed
  },
  tripPlanFab: {
    backgroundColor: colors.secondary || colors.primary,
  },
  stationsLoadingIndicator: {
    position: 'absolute',
    top: 100,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});