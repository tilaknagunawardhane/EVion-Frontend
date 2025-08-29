// import React, { useEffect, useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   Platform,
//   TouchableOpacity,
//   Image,
//   StatusBar,
//   Animated,
//   ScrollView
// } from 'react-native';
// import axios from 'axios';
// import * as Location from 'expo-location';
// import * as ExpoMaps from 'expo-maps';
// import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
// import { GOOGLE_MAPS_API_KEY } from '@env';
// import { useLocalSearchParams, useNavigation } from 'expo-router';
// import colors from '../../../constants/color';
// import fonts from '../../../constants/fonts';
// import { router } from 'expo-router'; // Ensure you have this import for navigation


// export default function DirectionsScreen() {
//   const params = useLocalSearchParams();
//   const navigation = useNavigation();

//   console.log('DirectionsScreen params:', params);

//   // State management
//   const [userLocation] = useState({
//     latitude: parseFloat(params.userLatitude),
//     longitude: parseFloat(params.userLongitude)
//   });
//   const [destination] = useState({
//     latitude: parseFloat(params.destinationLatitude),
//     longitude: parseFloat(params.destinationLongitude),
//     title: params.destinationTitle || 'Destination'
//   });
//   const [routePoints, setRoutePoints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [distance, setDistance] = useState(null);
//   const [duration, setDuration] = useState(null);
//   const mapRef = useRef(null);
//   const [mapReady, setMapReady] = useState(false);
//   const [fromText, setFromText] = useState('Your Location');
//   const [toText, setToText] = useState(params.destinationTitle || 'Destination');
//   const [fromCoords, setFromCoords] = useState({
//     latitude: parseFloat(params.userLatitude),
//     longitude: parseFloat(params.userLongitude)
//   });
//   const [toCoords, setToCoords] = useState({
//     latitude: parseFloat(params.destinationLatitude),
//     longitude: parseFloat(params.destinationLongitude)
//   });
//   const [panelExpanded, setPanelExpanded] = useState(false);
//   const panelHeight = useRef(new Animated.Value(150)).current;

//   // Mock data for charging stations (replace with your actual data)
//   const chargingStations = [
//     {
//       id: '1',
//       name: 'Fonseka Charging Station',
//       address: 'Southern Highway, Wellpenna, Matusama',
//       type: 'Type 2 (Mennekes)',
//       power: '7.4 kW (AC)',
//       recommendedSlot: '09:00 - 10:00 AM',
//       suggestedChargeTime: '1 hour',
//       distance: '52km',
//       currentCharge: '50%',
//       targetCharge: '80%',
//       arrivalTime: '9:30 AM'
//     },
//     {
//       id: '2',
//       name: 'Genso Charging Station',
//       address: 'Southern Highway, Wellpenna, Matusama',
//       type: 'Gale',
//       power: '50 kW (DC)',
//       recommendedSlot: '10:50 AM',
//       suggestedChargeTime: '30 mins',
//       distance: '52km',
//       currentCharge: '30%',
//       targetCharge: '80%',
//       arrivalTime: '10:50 AM'
//     }
//   ];

//   // Effects
//   useEffect(() => {
//     if (mapReady && routePoints.length > 0 && mapRef.current?.setCameraPosition) {
//       const centerLat = (fromCoords.latitude + toCoords.latitude) / 2;
//       const centerLng = (fromCoords.longitude + toCoords.longitude) / 2;

//       mapRef.current.setCameraPosition({
//         coordinates: { latitude: centerLat, longitude: centerLng },
//         zoom: 12,
//         duration: 1000,
//       });
//     }
//   }, [mapReady, routePoints, fromCoords, toCoords]);

//   useEffect(() => {
//     if (fromCoords && toCoords) {
//       fetchRoute(fromCoords, toCoords);
//     }
//   }, [fromCoords, toCoords]);

//   useEffect(() => {
//     Animated.timing(panelHeight, {
//       toValue: panelExpanded ? 650 : 150,
//       duration: 300,
//       useNativeDriver: false
//     }).start();
//   }, [panelExpanded]);

//   // Helper functions
//   const fetchRoute = async (start, end) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `https://maps.googleapis.com/maps/api/directions/json?` +
//         `origin=${start.latitude},${start.longitude}` +
//         `&destination=${end.latitude},${end.longitude}` +
//         `&key=${GOOGLE_MAPS_API_KEY}` +
//         `&mode=driving`
//       );
      
//       if (response.data.status !== 'OK') {
//         throw new Error(response.data.error_message || 'Directions request failed');
//       }
      
//       if (response.data.routes.length === 0) {
//         Alert.alert('No routes found', 'Could not find a path between these locations');
//         return;
//       }
      
//       const route = response.data.routes[0];
//       const points = decodePolyline(route.overview_polyline.points);
//       setRoutePoints(points);
      
//       if (route.legs.length > 0) {
//         const leg = route.legs[0];
//         setDistance(leg.distance.text);
//         setDuration(leg.duration.text);
//       }
//     } catch (error) {
//       console.error('Directions error:', error);
//       Alert.alert('Route Error', error.message || 'Failed to get directions. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const decodePolyline = (encoded) => {
//     const points = [];
//     let index = 0, len = encoded.length;
//     let lat = 0, lng = 0;

//     while (index < len) {
//       let b, shift = 0, result = 0;
//       do {
//         b = encoded.charCodeAt(index++) - 63;
//         result |= (b & 0x1f) << shift;
//         shift += 5;
//       } while (b >= 0x20);

//       const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
//       lat += dlat;

//       shift = 0;
//       result = 0;
//       do {
//         b = encoded.charCodeAt(index++) - 63;
//         result |= (b & 0x1f) << shift;
//         shift += 5;
//       } while (b >= 0x20);

//       const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
//       lng += dlng;

//       points.push({
//         latitude: lat * 1e-5,
//         longitude: lng * 1e-5
//       });
//     }

//     return points;
//   };

//   const recenterMap = () => {
//     if (mapRef.current?.setCameraPosition) {
//       const centerLat = (fromCoords.latitude + toCoords.latitude) / 2;
//       const centerLng = (fromCoords.longitude + toCoords.longitude) / 2;

//       mapRef.current.setCameraPosition({
//         coordinates: { latitude: centerLat, longitude: centerLng },
//         zoom: 12,
//         duration: 1000,
//       });
//     }
//   };

//   const togglePanel = () => {
//     setPanelExpanded(!panelExpanded);
//   };

//   const MapNamespace = Platform.OS === 'ios' ? ExpoMaps.AppleMaps : ExpoMaps.GoogleMaps;
//   const MapViewComponent = MapNamespace.View;

//   return (
//     <View style={styles.container}>
//       {/* Back Button */}
//       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//         <Image
//           source={require('../../../assets/back-icon.png')}
//           style={styles.backIcon}
//         />
//       </TouchableOpacity>

//       {/* Map View */}
//       {loading && <ActivityIndicator size="large" style={styles.loader} />}

//       <MapViewComponent
//         ref={mapRef}
//         style={styles.map}
//         camera={{
//           centerCoordinate: {
//             latitude: (fromCoords.latitude + toCoords.latitude) / 2,
//             longitude: (fromCoords.longitude + toCoords.longitude) / 2
//           },
//           zoom: 12,
//         }}
//         onMapReady={() => {
//           setTimeout(() => setMapReady(true), 100);
//         }}
//         markers={[
//           {
//             id: 'start',
//             coordinates: fromCoords,
//             title: fromText,
//             description: 'Starting point',
//             icon: { uri: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png' }
//           },
//           {
//             id: 'end',
//             coordinates: toCoords,
//             title: toText,
//             description: 'Destination',
//             icon: { uri: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png' }
//           },
//         ]}
//         polylines={routePoints.length > 0 ? [
//           {
//             id: 'route',
//             coordinates: routePoints,
//             strokeColor: '#007AFF',
//             strokeWidth: 4
//           }
//         ] : []}
//       />

//       {/* Route Info Panel */}
//       <Animated.View style={[styles.routePanel, { height: panelHeight }]}>
//         <TouchableOpacity 
//           style={styles.panelHandle} 
//           onPress={togglePanel}
//           activeOpacity={0.8}
//         >
//           <View style={styles.handleBar} />
//         </TouchableOpacity>
        
//         {panelExpanded ? (
//           <ScrollView style={styles.expandedContent}>
//             <View style={styles.routeHeader}>
//               <Text style={styles.routeTitle}>Route Plan - Station Details</Text>
              
//               <View style={styles.routeSummary}>
//                 <Text style={styles.timeText}>9:30</Text>
//                 <Text style={styles.destinationName}>Premasiri Khemadasa Mapuoka</Text>
//                 <View style={styles.durationDistance}>
//                   <Text style={styles.durationText}>5 hrs 28 mins (318km)</Text>
//                 </View>
//                 <View style={styles.vehicleInfo}>
//                   <Text style={styles.vehicleText}>BYD Atto 3 (SUV)</Text>
//                   <View style={styles.batteryTag}>
//                     <Text style={styles.batteryText}>O4</Text>
//                   </View>
//                 </View>
//                 <View style={styles.startTag}>
//                   <Text style={styles.startText}>Start</Text>
//                 </View>
//               </View>
              
//               <View style={styles.recommendedRoute}>
//                 <Text style={styles.recommendedText}>Recommended Route</Text>
//                 <Text style={styles.chargingStops}>2 charging stops</Text>
//               </View>
              
//               <View style={styles.addressBox}>
//                 <Ionicons name="home" size={18} color={colors.primary} />
//                 <Text style={styles.addressText}>Home 23, Park Lane, Nugegoda</Text>
//                 <Text style={styles.timeText}>08.00 AM</Text>
//               </View>
//             </View>
            
//             {/* Charging Stations */}
//             {chargingStations.map((station, index) => (
//               <View key={station.id} style={styles.stationContainer}>
//                 <View style={styles.stationHeader}>
//                   <View style={styles.stationMarker}>
//                     <FontAwesome name="map-marker" size={24} color={colors.primary} />
//                     <View style={styles.stationNumber}>
//                       <Text style={styles.stationNumberText}>{index + 1}</Text>
//                     </View>
//                   </View>
//                   <View style={styles.stationInfo}>
//                     <Text style={styles.stationName}>{station.name}</Text>
//                     <Text style={styles.stationAddress}>{station.address}</Text>
//                   </View>
//                 </View>
                
//                 <View style={styles.chargeInfo}>
//                   <View style={styles.chargeLevels}>
//                     <Text style={styles.chargeText}>Near {station.name.split(' ')[0]}</Text>
//                     <Text style={styles.chargeText}>{station.distance}</Text>
//                     <Text style={styles.chargeText}>{station.currentCharge} → {station.targetCharge}</Text>
//                   </View>
                  
//                   <View style={styles.chargeDetails}>
//                     <Text style={styles.chargeType}>{station.type}</Text>
//                     <Text style={styles.chargePower}>{station.power}</Text>
                    
//                     <View style={styles.recommendedSlot}>
//                       <Text style={styles.slotText}>Recommended Slot:</Text>
//                       <Text style={styles.slotTime}>{station.recommendedSlot}</Text>
//                     </View>
                    
//                     <Text style={styles.suggestedTime}>Suggested Charge Time: {station.suggestedChargeTime}</Text>
                    
//                     <View style={styles.stationActions}>
//                       <TouchableOpacity style={styles.viewButton}>
//                         <Text style={styles.viewButtonText}>View Station</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity style={styles.bookButton} onPress={() => router.push('/pages/StationProfile')}>
//                         <Text style={styles.bookButtonText}>Book Now</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             ))}
//           </ScrollView>
//         ) : (
//           <View style={styles.collapsedContent}>
//             <View style={styles.routeInfoRow}>
//               <MaterialIcons name="directions-car" size={24} color={colors.primary} />
//               <Text style={styles.routeInfoText}>{duration} ({distance})</Text>
//             </View>
//             <Text style={styles.destinationText} numberOfLines={2}>
//               To: {toText}
//             </Text>
//             <View style={styles.chargingInfo}>
//               <Text style={styles.chargingText}>2 charging stops</Text>
//             </View>
//           </View>
//         )}
//       </Animated.View>

//       {/* Recenter Button */}
//       <TouchableOpacity
//         style={styles.recenterButton}
//         onPress={recenterMap}
//         activeOpacity={0.7}
//       >
//         <MaterialIcons name="my-location" size={24} color="#fff" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   backButton: {
//     position: 'absolute',
//     top: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 50,
//     left: 16,
//     zIndex: 20,
//     backgroundColor: `${colors.stroke}4D`,
//     borderRadius: 20,
//     padding: 10,
//   },
//   backIcon: {
//     width: 18,
//     height: 18,
//     tintColor: colors.mainTextColor,
//     resizeMode: 'contain',
//   },
//   map: {
//     flex: 1,
//   },
//   loader: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     zIndex: 10,
//     transform: [{ translateX: -18 }, { translateY: -18 }],
//   },
//   routePanel: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 15,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: -2 },
//     shadowRadius: 4,
//     overflow: 'hidden',
//   },
//   panelHandle: {
//     width: '100%',
//     alignItems: 'center',
//     paddingVertical: 8,
//   },
//   handleBar: {
//     width: 40,
//     height: 4,
//     backgroundColor: '#ccc',
//     borderRadius: 2,
//   },
//   collapsedContent: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   expandedContent: {
//     flex: 1,
//     paddingBottom: 20,
//   },
//   routeInfoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   routeInfoText: {
//     fontSize: 16,
//     fontFamily: fonts.PlusJakartaSans,
//     marginLeft: 10,
//     color: colors.mainTextColor,
//   },
//   destinationText: {
//     fontSize: 14,
//     fontFamily: fonts.PlusJakartaSans,
//     color: colors.secondaryText,
//     marginBottom: 10,
//   },
//   chargingInfo: {
//     backgroundColor: '#F5F5F5',
//     borderRadius: 15,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     alignSelf: 'flex-start',
//   },
//   chargingText: {
//     fontSize: 12,
//     fontFamily: fonts.PlusJakartaSans,
//     color: colors.primary,
//   },
//   recenterButton: {
//     position: 'absolute',
//     bottom: 170,
//     right: 20,
//     backgroundColor: colors.primary,
//     padding: 12,
//     borderRadius: 25,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     zIndex: 20,
//   },
//   routeHeader: {
//     marginBottom: 20,
//   },
//   routeTitle: {
//     fontSize: 18,
//     fontFamily: fonts.PlusJakartaSansBold,
//     color: colors.mainTextColor,
//     marginBottom: 15,
//   },
//   routeSummary: {
//     marginBottom: 15,
//   },
//   timeText: {
//     fontSize: 16,
//     fontFamily: fonts.PlusJakartaSansBold,
//     color: colors.mainTextColor,
//   },
//   destinationName: {
//     fontSize: 16,
//     fontFamily: fonts.PlusJakartaSans,
//     color: colors.mainTextColor,
//     marginVertical: 5,
//   },
//   durationDistance: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   durationText: {
//     fontSize: 14,
//     fontFamily: fonts.PlusJakartaSans,
//     color: colors.secondaryText,
//   },
//   vehicleInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   vehicleText: {
//     fontSize: 14,
//     fontFamily: fonts.PlusJakartaSans,
//     color: colors.secondaryText,
//     marginRight: 10,
//   },
//   batteryTag: {
//     backgroundColor: '#E8F5E9',
//     borderRadius: 4,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//   },
//   batteryText: {
//     fontSize: 12,
//     fontFamily: fonts.PlusJakartaSans,
//     color: colors.primary,
//   },
//   startTag: {
//     backgroundColor: '#E3F2FD',
//     borderRadius: 4,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     alignSelf: 'flex-start',
//   },
//   startText: {
//     fontSize: 12,
//     fontFamily: fonts.PlusJakartaSans,
//     color: '#0D47A1',
//   },
//   recommendedRoute: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   recommendedText: {
//     fontSize: 14,
//     fontFamily: fonts.PlusJakartaSansBold,
//     color: colors.mainTextColor,
//     marginRight: 10,
//   },
//   chargingStops: {
//     fontSize: 14,
//     fontFamily: fonts.PlusJakartaSans,
//     color: colors.primary,
//   },
//   addressBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 20,
//   },
//   addressText: {
//     flex: 1,
//     fontSize: 14,
//     fontFamily: fonts.PlusJakartaSans,
//     color: colors.mainTextColor,
//     marginLeft: 10,
//     marginRight: 10,
//   },
//   stationContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#eee',
//     marginBottom: 15,
//     overflow: 'hidden',
//   },
//   stationHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   stationMarker: {
//     position: 'relative',
//     marginRight: 10,
//   },
//   stationNumber: {
//     position: 'absolute',
//     top: 5,
//     left: 8,
//     backgroundColor: colors.primary,
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   stationNumberText: {
//     fontSize: 10,
//     fontFamily: fonts.PlusJakartaSansBold,
//     color: '#fff',
//   },
//   stationInfo: {
//     flex: 1,
//   },
//   stationName: {
//     fontSize: 16,
//     fontFamily: fonts.PlusJakartaSansBold,
//     color: colors.mainTextColor,
//   },
//   stationAddress: {
//     fontSize: 12,
//     fontFamily: fonts.PlusJakartaSans,
//     color: colors.secondaryText,
//   },
//   chargeInfo: {
//     padding: 15,
//   },
//   chargeLevels: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   chargeText: {
//     fontSize: 12,
//     fontFamily: fonts.PlusJakartaSans,
//     color: colors.secondaryText,
//   },
//   chargeDetails: {
//     marginBottom: 10,
//   },
//   chargeType: {
//     fontSize: 14,
//     fontFamily: fonts.PlusJakartaSans,
//     color: colors.mainTextColor,
//     marginBottom: 5,
//   },
//   chargePower: {
//     fontSize: 14,
//     fontFamily: fonts.PlusJakartaSans,
//     color: colors.mainTextColor,
//     marginBottom: 10,
//   },
//   recommendedSlot: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   slotText: {
//     fontSize: 14,
//     fontFamily: fonts.PlusJakartaSans,
//     color: colors.secondaryText,
//     marginRight: 5,
//   },
//   slotTime: {
//     fontSize: 14,
//     fontFamily: fonts.PlusJakartaSansBold,
//     color: colors.mainTextColor,
//   },
//   suggestedTime: {
//     fontSize: 14,
//     fontFamily: fonts.PlusJakartaSans,
//     color: colors.secondaryText,
//     marginBottom: 15,
//   },
//   stationActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   viewButton: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: colors.primary,
//     borderRadius: 8,
//     padding: 10,
//     marginRight: 10,
//     alignItems: 'center',
//   },
//   viewButtonText: {
//     fontSize: 14,
//     fontFamily: fonts.PlusJakartaSans,
//     color: colors.primary,
//   },
//   bookButton: {
//     flex: 1,
//     backgroundColor: colors.primary,
//     borderRadius: 8,
//     padding: 10,
//     alignItems: 'center',
//   },
//   bookButtonText: {
//     fontSize: 14,
//     fontFamily: fonts.PlusJakartaSans,
//     color: '#fff',
//   },
// });