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
import Svg, { Path, Circle } from 'react-native-svg';
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
import useUserData from '../../hooks/useUserData';

const OPEN_CHARGE_MAP_API_URL = 'https://api.openchargemap.io/v3/poi';

// Custom Icon Components
function MyLocationIcon({ size = 24, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM20.94 11C20.48 6.83 17.17 3.52 13 3.06V1H11V3.06C6.83 3.52 3.52 6.83 3.06 11H1V13H3.06C3.52 17.17 6.83 20.48 11 20.94V23H13V20.94C17.17 20.48 20.48 17.17 20.94 13H23V11H20.94ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z"
        fill={color}
      />
    </Svg>
  );
}

function RouteIcon({ size = 24, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 15.18V7C19 5.9 18.1 5 17 5H13V2.59C13 2.26 12.74 2 12.41 2C12.26 2 12.12 2.05 12.01 2.15L8.15 5.85C7.93 6.06 7.93 6.4 8.15 6.61L12.01 10.31C12.22 10.52 12.56 10.52 12.77 10.31C12.87 10.21 12.92 10.07 12.92 9.92V7.5H16.5V15.18C15.91 15.6 15.5 16.26 15.5 17C15.5 18.1 16.4 19 17.5 19C18.6 19 19.5 18.1 19.5 17C19.5 16.26 19.09 15.6 19 15.18ZM6.5 17C6.5 15.9 5.6 15 4.5 15C3.4 15 2.5 15.9 2.5 17C2.5 18.1 3.4 19 4.5 19C5.6 19 6.5 18.1 6.5 17ZM7 8.82V17C7 18.1 7.9 19 9 19H11V21.41C11 21.74 11.26 22 11.59 22C11.74 22 11.88 21.95 11.99 21.85L15.85 18.15C16.07 17.94 16.07 17.6 15.85 17.39L11.99 13.69C11.78 13.48 11.44 13.48 11.23 13.69C11.13 13.79 11.08 13.93 11.08 14.08V16.5H9.5V8.82C10.09 8.4 10.5 7.74 10.5 7C10.5 5.9 9.6 5 8.5 5C7.4 5 6.5 5.9 6.5 7C6.5 7.74 6.91 8.4 7 8.82Z"
        fill={color}
      />
    </Svg>
  );
}

function AltRouteIcon({ size = 22, color = '#fff' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.78 11.16L10.05 11.43L10.32 11.16C10.71 10.77 11.34 10.77 11.73 11.16L12 11.43L12.27 11.16C12.66 10.77 13.29 10.77 13.68 11.16C14.07 11.55 14.07 12.18 13.68 12.57L12.71 13.54C12.32 13.93 11.69 13.93 11.3 13.54L10.32 12.57C9.93 12.18 9.93 11.55 10.32 11.16C10.51 10.97 10.77 10.88 11.05 10.88C11.32 10.88 11.59 10.97 11.78 11.16M9.41 4.41L8.71 5.11L7 6.82C5.9 7.92 5.9 9.68 7 10.78L7.71 11.49C8.17 11.95 8.9 11.95 9.37 11.49C9.83 11.03 9.83 10.3 9.37 9.83L8.66 9.12C8.27 8.73 8.27 8.1 8.66 7.71L10.37 6L11.07 5.3L11.78 6L13.49 7.71C13.88 8.1 13.88 8.73 13.49 9.12L12.78 9.83C12.32 10.3 12.32 11.03 12.78 11.49C13.25 11.95 13.98 11.95 14.44 11.49L15.15 10.78C16.25 9.68 16.25 7.92 15.15 6.82L13.44 5.11L12.73 4.41C12.36 4.03 11.75 4.03 11.37 4.41L10.66 5.11L10 5.77L9.34 5.11L8.64 4.41C8.27 4.03 7.65 4.03 7.28 4.41M14.59 19.59L15.3 18.88L17 17.17C18.1 16.07 18.1 14.31 17 13.21L16.29 12.5C15.83 12.04 15.1 12.04 14.63 12.5C14.17 12.97 14.17 13.7 14.63 14.16L15.34 14.87C15.73 15.26 15.73 15.89 15.34 16.28L13.63 17.99L12.93 18.7L12.22 17.99L10.51 16.28C10.12 15.89 10.12 15.26 10.51 14.87L11.22 14.16C11.68 13.7 11.68 12.97 11.22 12.5C10.76 12.04 10.03 12.04 9.56 12.5L8.85 13.21C7.75 14.31 7.75 16.07 8.85 17.17L10.56 18.88L11.27 19.59C11.64 19.96 12.25 19.96 12.63 19.59L13.34 18.88L14 18.22L14.66 18.88L15.37 19.59C15.74 19.96 16.36 19.96 16.73 19.59C17.1 19.22 17.1 18.6 16.73 18.23L16.02 17.52L14.59 19.59Z"
        fill={color}
      />
    </Svg>
  );
}

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef(null);
  const params = useLocalSearchParams();
  const { user } = useUserData();
  
  
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
  const [tripPlanData, setTripPlanData] = useState(null);
  const [routeDistanceInKm, setRouteDistanceInKm] = useState(0);


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
        
        setTripPlanData(tripData);
        
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
      ...(tripPlanData && { tripData: tripPlanData }), // Only include if exists
      user: user,
      routeDistanceInKm: routeDistanceInKm,
    });
    const { stations, meta } = response.data;

    if (meta.needsCharging === false) {
      Alert.alert(
          'Good News! 🎉', 
          `${meta.message} You have ${meta.surplusRange} km of extra range.`,
          [{ text: 'OK' }]
      );
    }

    filteredStations = stations || [];
    console.log('Filtered charging stations:', filteredStations.length);

  } catch (error) {
    console.error('Failed to fetch filtered stations:', error);
    
    // Extract error message from response
    const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Failed to get route with charging stations';
    
    Alert.alert('Error', errorMessage);
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
              setRouteDistanceInKm(result.distance);
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
              setRouteDistanceInKm(result.distance);
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
            <AltRouteIcon size={22} color="#fff" />
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
          <MyLocationIcon size={24} color="#fff" />
        </TouchableOpacity>

        {/* Trip Plan Button */}
        <TouchableOpacity
          style={[styles.fab, styles.tripPlanFab]}
          onPress={handleTripPlan}
        >
          <RouteIcon size={24} color="#fff" />
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