import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../constants/color.js';
import fonts from '../constants/fonts.js';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_BASE_URL } from '@env';
import Svg, { Path } from 'react-native-svg';

// SVG Icon Components
function NavigationIcon({ size = 28, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L3 21H21L12 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 6V18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 18L16 14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EvPlugIcon({ size = 24, color = colors.mainTextColor }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22V11"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 8V2C16 1.44772 15.5523 1 15 1H9C8.44772 1 8 1.44772 8 2V8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 8H18V16C18 18.2091 16.2091 20 14 20H10C7.79086 20 6 18.2091 6 16V8Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11 11H13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15V11"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const CompletedBookingCard = ({ 
  dateLabel, 
  time,
  cost, 
  stationName, 
  charging_station_id,
  address, 
  carImage,
  vehicle,
  carName, 
  connectorType,
  connector,
  connector_type_id,
  iconColor = colors.primary // Use primary color from constants as default
}) => {
    const router = useRouter();

  console.log('connector_type_id: ', connector_type_id);

  const [connectorDetails, setConnectorDetails] = useState(null);

  // Fetching the station connectors
    useEffect(() => {   
  
      if (!charging_station_id?._id) return;  //stop if station is null
  
      const fetchConnector = async () => {
        try {
          const url = `${API_BASE_URL}/api/bookings/getConnectorsByStation?station_id=${charging_station_id._id}`;
          console.log('Fetching from:', url);
  
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          console.log('Response status:', response.status);
  
        const data = await response.json();
        if (response.ok) {
          console.log('Samples: ', data);
          const connector = data.find(item => item._id === connector_type_id);
          setConnectorDetails(connector);
        }
        else{
          console.error('Error:', data.message || 'No message provided');
        }
  
        } catch (error) {
          console.error('Fetch error:', error.message);
          console.error('Error stack:', error.stack);
        }
      };
  
      fetchConnector();
  
    }, []);

    useEffect(() => {
      console.log('connector Details: ', connectorDetails);
    },[connectorDetails])

  const buildNavigationParams = () => ({
    ...(charging_station_id && { selectedStation: JSON.stringify(charging_station_id) }),
    ...(vehicle && { selectedVehicle: JSON.stringify(vehicle) }),
    ...(connectorDetails && { selectedConnector: JSON.stringify(connectorDetails) }),
  });
  
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
          <Text style={styles.dateText}>{dateLabel}</Text>
          <View style={styles.costContainer}>
            <Text style={styles.costText}>LKR {cost}</Text>
          </View>
          <TouchableOpacity style={styles.bookAgainButton} 
            onPress={() => 
            router.push({
              pathname: '/pages/bookings/AddBooking',
              params: buildNavigationParams(),
              })}>
            <Text style={styles.bookAgainText}>Book Again</Text>
          </TouchableOpacity>
        </View>
      <View style={styles.separator} />
      <View style={styles.middleRow}>
        <View style={styles.stationContainer}>
          <Text style={styles.stationName}>{charging_station_id.station_name}</Text>
          <Text style={styles.address}>{charging_station_id.address}</Text>
        </View>
        <TouchableOpacity>
          <NavigationIcon size={28} color={iconColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <View style={styles.bottomRow}>
        <View style={styles.carContainer}>
          <Image source={carImage ? { uri: carImage } : require('../assets/car.png')}
          style={styles.carImage} />
          <Text style={styles.carName}>{vehicle.make.make} {vehicle.model.model}</Text>
        </View>
        <View style={styles.connectorContainer}>
          <EvPlugIcon size={24} color={colors.mainTextColor} />
          <Text style={styles.connector}>{connector.type_name} - {connector.current_type}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background, // Use background color from constants
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  dateText: {
    fontFamily: fonts.PlusJakartaSansBold, // Use bold font from constants
    fontSize: 16,
    color: colors.mainTextColor, // Use main text color from constants
  },
  duration: {
    borderWidth: 1,
    borderColor: colors.primary, // Use primary color for border
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginHorizontal: 10,
  },
  durationText: {
    color: colors.primary, // Use primary color for text
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans, // Use regular font from constants
  },
  timeText: {
    fontFamily: fonts.PlusJakartaSansBold, // Use bold font from constants
    fontSize: 16,
    color: colors.mainTextColor, // Use main text color from constants
  },
  separator: {
    height: 1,
    backgroundColor: colors.stroke, // Use stroke color from constants
    marginVertical: 8,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  stationContainer: {
    flex: 1,
  },
  stationName: {
    fontFamily: fonts.PlusJakartaSansMedium, // Use bold font from constants
    fontSize: 16,
    color: colors.mainTextColor, // Use main text color from constants
  },
  address: {
    color: colors.secondaryText, // Use secondary text color from constants
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans, // Use regular font from constants
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  carContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connectorContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  carImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: 'cover',
    overflow: 'hidden',
    backgroundColor: colors.stroke, // Use stroke color as fallback background
  },
  carName: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans, // Use regular font from constants
    color: colors.mainTextColor, // Use main text color from constants
  },
  connector: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans, // Use regular font from constants
    color: colors.mainTextColor, // Use main text color from constants
  },
  costContainer: {
  paddingHorizontal: 4,
  justifyContent: 'center',
  alignItems: 'center',
},
costText: {
  color: colors.secondary, // Updated to match image color
  fontSize: 14,
  fontFamily: fonts.PlusJakartaSansMedium,
},

bookAgainButton: {
  backgroundColor: colors.primary,
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 6,
},
bookAgainText: {
  color: '#fff',
  fontSize: 12,
  fontFamily: fonts.PlusJakartaSansMedium,
},

});

export default CompletedBookingCard;