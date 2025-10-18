import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import ConnectorCard from '../../../components/SelectConnectorCard';
import { API_BASE_URL } from '@env';


const SelectConnector = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedConnector, setSelectedConnector] = useState(null);

  const [vehicleConnectors, setVehicleConnectors] = useState([]);
  const [stationConnectors, setStationConnectors] = useState([]);
  const [compatibleConnectors, setCompatibleConnectors] = useState([]);

  const [loadingConnectors, setLoadingConnectors] = useState(true);

  useEffect(() => {

    if(params.selectedVehicle){
      const vehicle = JSON.parse(params.selectedVehicle);
      setSelectedVehicle(vehicle);
      console.log('Selected Vehicle: ', vehicle);

      const connectors = [
        ...(vehicle.connector_type_AC ? [vehicle.connector_type_AC] : []),
        ...(vehicle.connector_type_DC ? [vehicle.connector_type_DC] : []),
      ];
      setVehicleConnectors(connectors);
      // console.log('VehicleConnectors: ', connectors);
      // console.log('type: ', Array.isArray(connectors));

      if(params.selectedStation){
        const station = JSON.parse(params.selectedStation);
        setSelectedStation(station);
        console.log('Selected Station: ', station);
      }
      else{
        console.log('No Station');
      }

    }
    else{
      console.log('No vehicle');
    }
  }, []);

  // Fetching the station connectors
  useEffect(() => {   

    if (!selectedStation?._id) return;  //stop if station is null

    const fetchStationsConectors = async () => {
      try {
        setLoadingConnectors(true);  // start loading
        const url = `${API_BASE_URL}/api/bookings/getConnectorsByStation?station_id=${selectedStation._id}`;
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
        setStationConnectors(Array.isArray(data) ? data : []);
      }
      else{
        console.error('Error:', data.message || 'No message provided');
      }

      } catch (error) {
        console.error('Fetch error:', error.message);
        console.error('Error stack:', error.stack);
      }
      finally {
      setLoadingConnectors(false); // stop loading
    }
    };

    fetchStationsConectors();

  }, [selectedStation]);
  
  // getting the compatible connectors
  useEffect(() => {
    console.log('vehicleConnectors: ', vehicleConnectors);
    console.log('stationConnectors: ', stationConnectors);

    if (!vehicleConnectors.length || !stationConnectors.length) {
      setCompatibleConnectors([]);
      return;
    }

    const compatible = stationConnectors.filter(stationCon =>
      vehicleConnectors.some(vehicleCon => vehicleCon._id === stationCon.connector?._id)
    );

    console.log('Compatible connectors:', compatible);
    setCompatibleConnectors(compatible);

  }, [vehicleConnectors, stationConnectors]);

  // console.log('params: ', params.selectedVehicle ? JSON.parse(params.selectedVehicle) : null);


  const buildNavigationParams = () => ({
    ...(selectedVehicle && { selectedVehicle: JSON.stringify(selectedVehicle) }),
    ...(selectedStation && { selectedStation: JSON.stringify(selectedStation) }),
    ...(selectedConnector && { selectedConnector: JSON.stringify(selectedConnector) }),
  });

  const handleSelect = () => {
    if (selectedConnector) {
      router.push({
        pathname: '/pages/bookings/AddBooking',
        params: buildNavigationParams(),
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* drag‑handle */}
      <View style={styles.topBar} />

      <Text style={styles.title}>Select Connector</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {loadingConnectors ? (
          <View style={styles.emptyWrapper}>
            <Text style={styles.emptyText}>Loading connectors...</Text>
          </View>
        ) : compatibleConnectors.length > 0 ? (
          compatibleConnectors.map((item) => (
            <TouchableOpacity
              key={item._id}
              activeOpacity={0.9}
              onPress={() => setSelectedConnector(item)}
            >
              <ConnectorCard
                connector={item}
                selected={selectedConnector?._id === item._id}
              />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyWrapper}>
            <Text style={styles.emptyText}>
              No compatible connectors found for this vehicle at this station.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* SELECT BUTTON */}
      <TouchableOpacity
        style={[styles.selectBtn, !selectedConnector && styles.disabledBtn]}
        onPress={handleSelect}
        disabled={!selectedConnector}
      >
        <Text
          style={[styles.selectText, !selectedConnector && styles.disabledText]}
        >
          Select
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectConnector;

/* ----------------------------- STYLES ----------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  topBar: {
    alignSelf: 'center',
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    textAlign: 'center',
    marginBottom: 12,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  /* button */
  selectBtn: {
    backgroundColor: colors.primary,
    margin: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectText: {
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.white,
  },
  disabledBtn: {
    backgroundColor: colors.lightestGray,
  },
  disabledText: {
    color: colors.secondaryText,
  },

  emptyWrapper: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 40,
},
emptyText: {
  fontSize: 15,
  fontFamily: fonts.PlusJakartaSansMedium,
  color: colors.secondaryText,
  textAlign: 'center',
  lineHeight: 22,
},

});
