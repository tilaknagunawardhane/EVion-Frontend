import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Text
} from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../../constants/color';
import MapViewDirections from 'react-native-maps-directions';

// Import your API key from environment variables
import { OPEN_CHARGE_MAP_API_KEY } from '@env';
import { API_BASE_URL } from '@env';
import { GOOGLE_MAPS_API_KEY } from '@env';

// Components
import SearchContainer from '../../components/maps/SearchContainer';
import StationDetailsModal from '../../components/maps/StationDetailsModal';
import LoadingOverlay from '../../components/maps/LoadingOverlay';
import UserLocationMarker from '../../components/maps/UserLocationMarker';
import ChargingStationMarker from '../../components/maps/ChargingStationMarker';

// Utils
import { getDistanceFromLatLonInKm } from '../../utils/mapUtils';
// import polyline from '@mapbox/polyline';
import { useLocalSearchParams } from 'expo-router';

const OPEN_CHARGE_MAP_API_URL = 'https://api.openchargemap.io/v3/poi';

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef(null);
  const params = useLocalSearchParams();
  
  // State management
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [chargingStations, setChargingStations] = useState([]);
  const [partneredChargingStations, setPartneredChargingStations] = useState([]);
  const [filteredChargingStations, setFilteredChargingStations] = useState([]); 
  const [selectedStation, setSelectedStation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [stationsLoaded, setStationsLoaded] = useState(false);
  const [partneredStationsLoaded, setPartneredStationsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null); //for tripPlanner
  const [routePolyline, setRoutePolyline] = useState(null);

  // const [selectedVehicle, setSelectedVehicle] = useState('');
  // const [batteryLevel, setBatteryLevel] = useState('');
  // const [passengers, setPassengers] = useState('');

  useEffect(() => {
    console.log('location: ', location);
    console.log('startLocation: ', startLocation);
    console.log('selectedLocation: ', selectedLocation);
    console.log('destinationLocation: ', destinationLocation);
  }, [location, startLocation, selectedLocation, destinationLocation]);

  useEffect(() => {
    // chargingStations.forEach(station => console.log(station.address));
    console.log('Charging Stations: ', chargingStations.length);
  }, [chargingStations]);

  // Get user location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Load charging stations when location is available
  useEffect(() => {
    if (location && !stationsLoaded) {
      loadChargingStations();
      loadPartneredStations();
    }
  }, [location]);

  // Center map on user location when map is ready
  useEffect(() => {
    if (location && mapRef.current && mapLoaded) {
      centerMapOnUserLocation();
    }
  }, [location, mapLoaded]);

  //getting parameters from trip planner page
  useEffect(() => {
    if (params.tripData && params.fromTripPlanner === 'true') {
      try {
        const tripData = JSON.parse(params.tripData);
        console.log('Received trip data:', tripData);
        
        // Process the starting location and destination
        handleTripPlanSearch(tripData.startingLocation, tripData.destination);
        
        // Store trip data if you need other info
        // setTripPlanData(tripData);
        
      } catch (error) {
        console.error('Error parsing trip data:', error);
      }
    }
  }, [params.tripData, params.fromTripPlanner]);


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
        // setStartLocation({
        //   latitude: 6.9271,
        //   longitude: 79.8612,
        // }); // setting user location as the starting location
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
        // setStartLocation({
        //   latitude: 6.9271, // Colombo
        //   longitude: 79.8612,
        //   accuracy: loc.coords.accuracy,
        // }); // setting user location as the starting location
      } else {
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          accuracy: loc.coords.accuracy,
        });
        // setStartLocation({
        //   latitude: loc.coords.latitude,
        //   longitude: loc.coords.longitude,
        //   accuracy: loc.coords.accuracy,
        // }); // setting user location as the starting location
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
      setFilteredChargingStations([]);
      
    } catch (error) {
      console.error('Error loading charging stations:', error);
      Alert.alert('Error', 'Failed to load charging stations');
      setStationsLoaded(true);
    }
  };

  const loadPartneredStations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/stations/map/stations`);
    // console.log('response: ', response.data.data);
    const stations = response.data.data.map(station => ({
        id: station._id,
        title: station.station_name || 'Charging Station',
        description: 'No description available',
        latitude: station.location.latitude,
        longitude: station.location.longitude,
        address: station.address,
        town: station.city,
        // postcode: station.AddressInfo?.Postcode,
        // country: station.AddressInfo?.Country?.Title,
        // operatorInfo: station.OperatorInfo,
        // connections: station.Connections,
        // usageType: station.UsageType,
        // statusType: station.StatusType,
        // numberOfPoints: station.NumberOfPoints,
        // phone: station.AddressInfo?.ContactTelephone1,
        // website: station.AddressInfo?.RelatedURL
      })).filter(station => station.latitude && station.longitude);

    console.log(`Loaded ${stations.length} partnered charging stations`);
    setPartneredChargingStations(stations);
    setPartneredStationsLoaded(true);
    setFilteredChargingStations([]);

  } catch (error) {
    console.error('Error loading partnered stations:', error);
    // Alert.alert('Error', 'Failed to load charging stations');
    setPartneredStationsLoaded(true);
  }
};

  const handleGetRoute = async (source, destination) => {
  if (!source || !destination) {
    Alert.alert('Error', 'Both source and destination are required');
    return;
  }

  let filteredStations = [];

  try {
    setStationsLoaded(false);

    // Route polyline from Google Directions API
    const googleDirectionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${source.latitude},${source.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}`;
    const directionsResponse = await axios.get(googleDirectionsUrl);
    
    if (
      !directionsResponse.data.routes ||
      directionsResponse.data.routes.length === 0
    ) {
      Alert.alert('Error', 'No route found');
      setStationsLoaded(true);
      return;
    }

    // Encoded polyline
    const encodedPolyline = directionsResponse.data.routes[0].overview_polyline.points;
    console.log('encodedPolyline: ', encodedPolyline);

    const response = await axios.post(`${API_BASE_URL}/api/common/filteredChargingStations`, {
      source: source,
      destination: destination,
      startLat: source.latitude,
      startLng: source.longitude,
      endLat: destination.latitude,
      endLng: destination.longitude,
      polyline: encodedPolyline,
    });

    filteredStations = response.data;
    console.log('Filtered charging stations:', filteredStations.length);

  } catch (error) {
    console.error('Failed to fetch filtered stations:', error);
    Alert.alert('Error', 'Failed to get route with charging stations');
  } finally {
    console.log('finally');
    setFilteredChargingStations(filteredStations);
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

  const handleMarkerPress = (station, isPartneredStation=false) => {
    console.log('Marker pressed:', station.title);
    setSelectedStation({ ...station, isPartneredStation });
    // console.log('selectedStation set with:', { ...station, isPartneredStation });
    
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
    console.log('query: ', query);
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
      console.log('geocoded: ', geocoded);
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

      // Select this location on the map
      setSelectedStation(null); // clear any station selection
      setSelectedLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        name: query, //display name
      });

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
        // setSelectedStation(closestStation);
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


  //for tripPlanner
  const handleTripPlanSearch = async (startQuery, destQuery) => {
    try {
      setSelectedLocation(null);

      // Geocode starting location
      if (startQuery) {
        const startGeocoded = await Location.geocodeAsync(startQuery);
        if (startGeocoded.length > 0) {
          const startCoords = startGeocoded[0];
          setStartLocation({
            latitude: startCoords.latitude,
            longitude: startCoords.longitude,
            name: startQuery,
          });
          console.log('Starting location set:', startQuery);
        }
      }

      // Geocode destination
      if (destQuery) {
        const destGeocoded = await Location.geocodeAsync(destQuery);
        if (destGeocoded.length > 0) {
          const destCoords = destGeocoded[0];
          setDestinationLocation({
            latitude: destCoords.latitude,
            longitude: destCoords.longitude,
            name: destQuery,
          });
          setSelectedLocation(destCoords); // Set as selected for marker display
          console.log('Destination set:', destQuery);
          
          // Center map to show both locations
          if (mapRef.current && startLocation) {
            // Calculate region that shows both points
            const minLat = Math.min(startLocation.latitude, destCoords.latitude);
            const maxLat = Math.max(startLocation.latitude, destCoords.latitude);
            const minLng = Math.min(startLocation.longitude, destCoords.longitude);
            const maxLng = Math.max(startLocation.longitude, destCoords.longitude);
            
            const midLat = (minLat + maxLat) / 2;
            const midLng = (minLng + maxLng) / 2;
            const latDelta = (maxLat - minLat) * 1.5; // Add padding
            const lngDelta = (maxLng - minLng) * 1.5;
            
            mapRef.current.animateToRegion({
              latitude: midLat,
              longitude: midLng,
              latitudeDelta: Math.max(latDelta, 0.05),
              longitudeDelta: Math.max(lngDelta, 0.05),
            }, 1000);
          }
        }
      }
    } catch (error) {
      console.error('Trip plan search error:', error);
      Alert.alert('Error', 'Failed to process trip locations');
    }
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
        {filteredChargingStations.length === 0 && chargingStations.map(station => (
          <ChargingStationMarker
            key={station.id}
            station={station}
            onPress={() => handleMarkerPress(station)}
            isSelected={selectedStation?.id === station.id}
          />
        ))}

        {/* Partnered Charging Station Markers */}
        {filteredChargingStations.length === 0 && partneredChargingStations?.map(station => (
          <ChargingStationMarker
            key={station.id}
            station={station}
            onPress={() => handleMarkerPress(station, true)}
            isSelected={selectedStation?.id === station.id}
          />
        ))}

        {/* filteredChargingStations markers */}
        {filteredChargingStations?.map(station => (
          <ChargingStationMarker
            key={station.id}
            station={station}
            onPress={() => handleMarkerPress(station, true)}
            isSelected={selectedStation?.id === station.id}
          />
        ))}

        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            pinColor="blue"
            title={selectedLocation.name || "Selected Location"}
          />
        )}

        {/* Show trip planner route if both start and destination are set */}
        {startLocation && destinationLocation ? (
          <MapViewDirections
            origin={startLocation}
            destination={destinationLocation}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor="blue"
            onReady={result => {
              console.log(`Trip Route - Distance: ${result.distance} km`);
              console.log(`Trip Route - Duration: ${result.duration} min`);
            }}
            onError={errorMessage => {
              console.error('Trip route error:', errorMessage);
            }}
          />
        ) : location && selectedLocation ? (
          /* Show route from start location to manually selected location */
          <MapViewDirections
            origin={location}
            destination={selectedLocation}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor="blue"
            onReady={result => {
              console.log(`Manual Route - Distance: ${result.distance} km`);
              console.log(`Manual Route - Duration: ${result.duration} min`);
            }}
            onError={errorMessage => {
              console.error('Manual route error:', errorMessage);
            }}
          />
        ) : null}

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
          isPartneredStation={selectedStation.isPartneredStation}
          router={router}
        />
      )}

      {/* get-route button */}
      {((startLocation && destinationLocation) || (location && selectedLocation && !selectedStation)) && (
        <View style={styles.routeButtonContainer}>
          <TouchableOpacity
            style={styles.routeButton}
            onPress={() => {
              const source = startLocation || location;
              const destination = destinationLocation || selectedLocation;
              handleGetRoute(source, destination);
            }}
          >
            <MaterialIcons name="alt-route" size={22} color="#fff" />
            <Text style={styles.routeButtonText}>Get Route with Charging Stations</Text>
          </TouchableOpacity>
        </View>
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

routeButtonContainer: {
  position: 'absolute',
  bottom: 30,
  left: 20,
  right: 20,
  alignItems: 'center',
},

routeButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.primary,
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderRadius: 30,
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
},

routeButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
  marginLeft: 8,
},

});