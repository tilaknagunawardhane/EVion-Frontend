import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  ScrollView
} from 'react-native';
import axios from 'axios';
import * as ExpoMaps from 'expo-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import chargingStations from '../../../utils/ChargingStations';
import ChargingStationCard from '../../../components/ChargingStationCard';
import VehicleInfo from '../../../components/VehicleInfo';
import RouteCities from '../../../components/RouteCities';

export default function DirectionsScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();

  // State management
  const [loading, setLoading] = useState(true);
  const [routeData, setRouteData] = useState(null);
  const [chargingStops, setChargingStops] = useState([]);
  const [routeCities, setRouteCities] = useState([]);
  const [vehicleData] = useState({
    model: 'BYD Atto 3 (SUV)',
    batteryLevel: 'O4',
    currentCharge: 80,
    efficiency: 5 // km per kWh
  });
  
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const panelHeight = useRef(new Animated.Value(150)).current;

  // Effects
  useEffect(() => {
    if (params.userLatitude && params.userLongitude && params.destinationLatitude && params.destinationLongitude) {
      fetchRouteAndStations();
    }
  }, [params]);

  useEffect(() => {
    if (mapReady && routeData?.polyline && mapRef.current?.setCameraPosition) {
      const centerLat = (parseFloat(params.userLatitude) + parseFloat(params.destinationLatitude)) / 2;
      const centerLng = (parseFloat(params.userLongitude) + parseFloat(params.destinationLongitude)) / 2;

      mapRef.current.setCameraPosition({
        coordinates: { latitude: centerLat, longitude: centerLng },
        zoom: 12,
        duration: 1000,
      });
    }
  }, [mapReady, routeData]);

  useEffect(() => {
    Animated.timing(panelHeight, {
      toValue: panelExpanded ? 500 : 150,
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [panelExpanded]);

  // API functions
  const fetchRouteAndStations = async () => {
    setLoading(true);
    try {
      // First get the route
      const routeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?` +
        `origin=${params.userLatitude},${params.userLongitude}` +
        `&destination=${params.destinationLatitude},${params.destinationLongitude}` +
        `&key=${GOOGLE_MAPS_API_KEY}` +
        `&mode=driving`
      );

      if (routeResponse.data.status !== 'OK') {
        throw new Error(routeResponse.data.error_message || 'Directions request failed');
      }

      const route = routeResponse.data.routes[0];
      const points = decodePolyline(route.overview_polyline.points);
      
      // Extract cities along the route
      const cities = extractCitiesFromRoute(route);
      
      // Find charging stations along the route
      const stationsAlongRoute = findStationsAlongRoute(points, chargingStations);
      
      // Plan charging stops based on vehicle range
      const plannedStops = planChargingStops(
        points, 
        stationsAlongRoute, 
        vehicleData.currentCharge, 
        vehicleData.efficiency
      );

      setRouteData({
        polyline: points,
        distance: route.legs[0]?.distance?.text || 'N/A',
        duration: route.legs[0]?.duration?.text || 'N/A',
        startAddress: route.legs[0]?.start_address || 'Starting point',
        endAddress: route.legs[0]?.end_address || 'Destination'
      });
      
      setChargingStops(plannedStops);
      setRouteCities(cities);
    } catch (error) {
      console.error('Route error:', error);
      Alert.alert('Route Error', error.message || 'Failed to get directions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
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

  const extractCitiesFromRoute = (route) => {
    const cities = new Set();
    
    // Add start and end cities
    if (route.legs[0]?.start_address) {
      const city = route.legs[0].start_address.split(',')
        .map(part => part.trim())
        .find(part => part.match(/[A-Za-z\s]+/));
      if (city) cities.add(city);
    }
    
    if (route.legs[0]?.end_address) {
      const city = route.legs[0].end_address.split(',')
        .map(part => part.trim())
        .find(part => part.match(/[A-Za-z\s]+/));
      if (city) cities.add(city);
    }
    
    // Add via points if any
    route.legs[0]?.steps?.forEach(step => {
      if (step.html_instructions) {
        const cityMatch = step.html_instructions.match(/toward (.+?)</) || 
                         step.html_instructions.match(/to (.+?)</);
        if (cityMatch && cityMatch[1]) {
          cities.add(cityMatch[1].replace(/<[^>]*>/g, '').trim());
        }
      }
    });
    
    return Array.from(cities).slice(0, 5); // Return max 5 cities
  };

  const findStationsAlongRoute = (routePoints, stations, maxDistanceKm = 5) => {
    return stations.filter(station => {
      // Check if station is within maxDistanceKm of any route point
      return routePoints.some(point => {
        const distance = haversineDistance(
          point.latitude,
          point.longitude,
          station.latitude,
          station.longitude
        );
        return distance <= maxDistanceKm;
      });
    });
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  const planChargingStops = (routePoints, stations, currentCharge, efficiency, minCharge = 20) => {
    const stops = [];
    let remainingRange = (currentCharge - minCharge) * efficiency;
    let distanceCovered = 0;
    let lastStop = null;
    
    // Simplified algorithm - in real app you'd want something more sophisticated
    for (let i = 0; i < routePoints.length; i += Math.floor(routePoints.length / 20)) {
      const point = routePoints[i];
      const distanceToNext = i > 0 ? 
        haversineDistance(
          routePoints[i-1].latitude,
          routePoints[i-1].longitude,
          point.latitude,
          point.longitude
        ) : 0;
      
      distanceCovered += distanceToNext;
      remainingRange -= distanceToNext;
      
      if (remainingRange < 0) {
        // Find nearest station to this point
        const nearestStation = stations.reduce((nearest, station) => {
          const distance = haversineDistance(
            point.latitude,
            point.longitude,
            station.latitude,
            station.longitude
          );
          
          if (!nearest || distance < nearest.distance) {
            return { station, distance };
          }
          return nearest;
        }, null);
        
        if (nearestStation && nearestStation.distance < 10) { // Max 10km detour
          stops.push({
            ...nearestStation.station,
            distanceFromStart: distanceCovered,
            suggestedChargeTime: calculateChargeTime(nearestStation.station.power),
            arrivalTime: calculateArrivalTime(distanceCovered, routeData?.duration)
          });
          
          // Reset range after charging
          remainingRange = (80 - minCharge) * efficiency; // Assuming charging to 80%
          lastStop = nearestStation.station;
        }
      }
    }
    
    return stops;
  };

  const calculateChargeTime = (power) => {
    // Very simplified calculation
    if (power.includes('50 kW')) return '30-45 mins';
    if (power.includes('22 kW')) return '1-2 hours';
    return '2+ hours';
  };

  const calculateArrivalTime = (distance, totalDuration) => {
    if (!totalDuration) return 'N/A';
    
    // Very simplified calculation
    const totalHours = parseFloat(totalDuration) || 1;
    const fraction = distance / (parseFloat(routeData?.distance) || 1);
    const hours = Math.floor(totalHours * fraction);
    const minutes = Math.floor((totalHours * fraction - hours) * 60);
    
    // Current time + hours:minutes
    const now = new Date();
    now.setHours(now.getHours() + hours);
    now.setMinutes(now.getMinutes() + minutes);
    
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const recenterMap = () => {
    if (mapRef.current?.setCameraPosition && routeData?.polyline?.length > 0) {
      const centerLat = (parseFloat(params.userLatitude) + parseFloat(params.destinationLatitude)) / 2;
      const centerLng = (parseFloat(params.userLongitude) + parseFloat(params.destinationLongitude)) / 2;

      mapRef.current.setCameraPosition({
        coordinates: { latitude: centerLat, longitude: centerLng },
        zoom: 12,
        duration: 1000,
      });
    }
  };

  const togglePanel = () => {
    setPanelExpanded(!panelExpanded);
  };

  const MapNamespace = Platform.OS === 'ios' ? ExpoMaps.AppleMaps : ExpoMaps.GoogleMaps;
  const MapViewComponent = MapNamespace.View;

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image
          source={require('../../../assets/back-icon.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      {/* Map View */}
      {loading && <ActivityIndicator size="large" style={styles.loader} />}

      <MapViewComponent
        ref={mapRef}
        style={styles.map}
        camera={{
          centerCoordinate: {
            latitude: (parseFloat(params.userLatitude) + parseFloat(params.destinationLatitude)) / 2,
            longitude: (parseFloat(params.userLongitude) + parseFloat(params.destinationLongitude)) / 2
          },
          zoom: 12,
        }}
        onMapReady={() => {
          setTimeout(() => setMapReady(true), 100);
        }}
        markers={[
          {
            id: 'start',
            coordinates: {
              latitude: parseFloat(params.userLatitude),
              longitude: parseFloat(params.userLongitude)
            },
            title: 'Start',
            description: 'Starting point',
            icon: { uri: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png' }
          },
          {
            id: 'end',
            coordinates: {
              latitude: parseFloat(params.destinationLatitude),
              longitude: parseFloat(params.destinationLongitude)
            },
            title: params.destinationTitle || 'Destination',
            description: 'Destination',
            icon: { uri: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png' }
          },
          ...chargingStops.map((stop, index) => ({
            id: `stop_${index}`,
            coordinates: {
              latitude: stop.latitude,
              longitude: stop.longitude
            },
            title: stop.title,
            description: `Charging stop ${index + 1}`,
            icon: { uri: 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png' }
          }))
        ]}
        polylines={routeData?.polyline ? [
          {
            id: 'route',
            coordinates: routeData.polyline,
            strokeColor: '#007AFF',
            strokeWidth: 4
          }
        ] : []}
      />

      {/* Route Info Panel */}
      <Animated.View style={[styles.routePanel, { height: panelHeight }]}>
        <TouchableOpacity 
          style={styles.panelHandle} 
          onPress={togglePanel}
          activeOpacity={0.8}
        >
          <View style={styles.handleBar} />
        </TouchableOpacity>
        
        {panelExpanded ? (
          <ScrollView style={styles.expandedContent}>
            <View style={styles.routeHeader}>
              <Text style={styles.routeTitle}>Route Plan - Station Details</Text>
              
              <VehicleInfo 
                duration={routeData?.duration}
                distance={routeData?.distance}
                vehicleModel={vehicleData.model}
                batteryLevel={vehicleData.batteryLevel}
                startAddress={routeData?.startAddress}
              />
              
              <View style={styles.recommendedRoute}>
                <Text style={styles.recommendedText}>Recommended Route</Text>
                <Text style={styles.chargingStops}>{chargingStops.length} charging stops</Text>
              </View>
              
              <RouteCities cities={routeCities} />
            </View>
            
            {/* Charging Stations */}
            {chargingStops.map((station, index) => (
              <ChargingStationCard 
                key={station.id}
                station={station}
                index={index}
                distanceFromStart={station.distanceFromStart}
                arrivalTime={station.arrivalTime}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.collapsedContent}>
            <View style={styles.routeInfoRow}>
              <MaterialIcons name="directions-car" size={24} color={colors.primary} />
              <Text style={styles.routeInfoText}>{routeData?.duration || 'Calculating...'} ({routeData?.distance || 'N/A'})</Text>
            </View>
            <Text style={styles.destinationText} numberOfLines={2}>
              To: {params.destinationTitle || 'Destination'}
            </Text>
            <View style={styles.chargingInfo}>
              <Text style={styles.chargingText}>{chargingStops.length} charging stops</Text>
            </View>
          </View>
        )}
      </Animated.View>

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
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 50,
    left: 16,
    zIndex: 20,
    backgroundColor: `${colors.stroke}4D`,
    borderRadius: 20,
    padding: 10,
  },
  backIcon: {
    width: 18,
    height: 18,
    tintColor: colors.mainTextColor,
    resizeMode: 'contain',
  },
  map: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 10,
    transform: [{ translateX: -18 }, { translateY: -18 }],
  },
  routePanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
    overflow: 'hidden',
  },
  panelHandle: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  collapsedContent: {
    flex: 1,
    justifyContent: 'center',
  },
  expandedContent: {
    flex: 1,
    paddingBottom: 20,
  },
  routeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  routeInfoText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    marginLeft: 10,
    color: colors.mainTextColor,
  },
  destinationText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 10,
  },
  chargingInfo: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  chargingText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.primary,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 170,
    right: 20,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    zIndex: 20,
  },
  routeHeader: {
    marginBottom: 20,
  },
  routeTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 15,
  },
  recommendedRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  recommendedText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginRight: 10,
  },
  chargingStops: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.primary,
  },
});