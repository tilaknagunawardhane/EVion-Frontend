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

  const [connectors, setConnectors] = useState(null);
  const [vehicleConnectors, setVehicleConnectors] = useState([]);

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
      console.log('VehicleConnectors: ', connectors);
      console.log('type: ', Array.isArray(connectors));

      if(params.selectedStation){
        const station = JSON.parse(params.selectedStation);
        setSelectedStation(station);
        console.log('Selected Station: ', selectedStation);
      }
      else{
        console.log('No Station');
      }

    }
    else{
      console.log('No vehicle');
    }

  }, []);

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
        {vehicleConnectors.map((item) => (
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
        ))}
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
});
