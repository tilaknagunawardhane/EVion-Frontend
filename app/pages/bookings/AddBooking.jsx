import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import SelectableInput from '../../../components/SelectableInput';
import { useNavigation } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SelectVehicleCard from '../../../components/SelectVehicleCard';
import { API_BASE_URL } from '@env';
import useUserData from '../../../hooks/useUserData';

const AddBooking = () => {
  const { user } = useUserData();

  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [selectedField, setSelectedField] = useState(null);
  const [station, setStation] = useState(null);
  const [connector, setConnector] = useState(null);

  const [datetime, setDatetime] = useState(null);

  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  // const [selectedConnector, setSelectedConnector] = useState(null);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [ownedVehicles, setOwnedVehicles] = useState(null);



  console.log('API_BASE_URL:', API_BASE_URL);

  useEffect(() => {
    if (!user) return; // do nothing until user is loaded

    const fetchOwnedVehicles = async () => {
      try{
        const url = `${API_BASE_URL}/api/bookings/getOwnedVehicles?ev_user_id=${user._id}`;
        console.log('Fetching from:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

      // console.log('Response status:', response.status);
      // console.log('Response headers:', response.headers);

      // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error(`Server returned non-JSON response (status: ${response.status})`);
    }
      const data = await response.json();
      // console.log('API Response:', data);
      // console.log('Array.isArray(data):', Array.isArray(data));

      if(response.ok) {
        setOwnedVehicles(Array.isArray(data) ? data : data.vehicles || []);
        // console.log('ownedVehicles: ', ownedVehicles);
      }
      else{
        console.error('Error:', data.message || 'No message provided');
      }
      }catch (error) {
        console.error('Fetch error:', error.message);
        console.error('Error stack:', error.stack);
      }
    };

    fetchOwnedVehicles();

    if(params.selectedStation){
      console.log('Station is selected');
      console.log('station: ', params.selectedStation);
      setStation(JSON.parse(params.selectedStation));
    }
    if(params.selectedConnector){
      setConnector(JSON.parse(params.selectedConnector));
    }
    if(params.selectedVehicle){
      setSelectedVehicle(JSON.parse(params.selectedVehicle));
    }
    if(params.selectedDateTime){
      setDatetime(JSON.parse(params.selectedDateTime));
    }

    console.log('user: ', user);
  }, [user]);

  useEffect(() => {
  if (ownedVehicles !== null) {
    console.log('Updated ownedVehicles:', ownedVehicles);
    console.log('ownedVehiles isArray??:', Array.isArray(ownedVehicles));
  }
  }, [ownedVehicles]);

  useEffect(()=> {
    console.log('selectedStation: ', station);
  }, [station]);

  useEffect(()=> {
    console.log('selectedVEhicel: ', selectedVehicle);
  }, [selectedVehicle]);

  useEffect(()=> {
    console.log('Connector: ', connector);
  }, [connector]);
  
  useEffect(()=> {
    console.log('selecteddatetime: ', datetime);
  }, [datetime]);


  const isFormComplete = station && selectedVehicle && connector && datetime;

  const handleSubmit = async () => {
    if (!isFormComplete){
      console.log('Form is not completed!!');
      return;
    }
    console.log('ZZZselecteddatetime: ', datetime.bookingStartTime);
    try {
      const newBooking = {
        ev_user_id: user._id,
        vehicle_id: selectedVehicle._id,
        charging_station_id: station._id,
        charger_id: '68a6180887c199647d8a8f2e',
        connector_type_id: connector._id,
        booking_date_time: datetime.bookingStartTime,
        no_of_slots: 5,
        status: 'upcoming'
      };

      console.log('Submitting booking:', newBooking);

      const response = await fetch(`${API_BASE_URL}/api/bookings/addBooking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBooking),
      });

      console.log('Response status:', response.status);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response (status: ${response.status})`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (response.ok) {
        console.log('✅ Booking submitted successfully');
      } else {
        console.error('❌ Error:', data.message || 'Failed to submit booking');
      }
    } catch (error) {
      console.error('Submit error:', error.message);
    }
  };

  const buildNavigationParams = () => ({
    ...(station && { selectedStation: JSON.stringify(station) }),
    ...(selectedVehicle && { selectedVehicle: JSON.stringify(selectedVehicle) }),
    ...(connector && { selectedConnector: JSON.stringify(connector) }),
    ...(datetime && { selectedDateTime: datetime }),
  });


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Booking</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Charging Station */}
        <Text style={styles.label}>Charging Station*</Text>
        <SelectableInput
          icon={
            <MaterialCommunityIcons
              name="ev-station"
              size={20}
              color={selectedField === 'station' ? colors.primary : colors.lightGray}
            />
          }
          text={station ? station.name : "Select Charging Station"}
          active={selectedField === 'station'}
          onPress={() => {
            setSelectedField('station');
            router.push({
              pathname: '/pages/bookings/SelectCharger',
              params: buildNavigationParams(),
            });
          }}
        />

        {/* Vehicle */}
        <Text style={styles.label}>Vehicle*</Text>
        <SelectableInput
          icon={
            <MaterialCommunityIcons
              name="car-outline"
              size={20}
              color={selectedField === 'vehicle' ? colors.primary : colors.lightGray}
            />
          }
          text={selectedVehicle ? `${selectedVehicle.make.make} ${selectedVehicle.model.model}` : "Select Vehicle"}
          active={selectedField === 'vehicle'}
          onPress={() => {
            setSelectedField('vehicle');
            setVehicleModalVisible(true);
          }}
        />

        {/* Connector */}
        <Text style={styles.label}>Connector*</Text>
        <SelectableInput
          icon={
            <MaterialCommunityIcons
              name="power-plug-outline"
              size={20}
              color={selectedField === 'connector' ? colors.primary : colors.lightGray}
            />
          }
          text={connector ? `${connector.current_type} ${connector.type_name}` : "Select Connector"}
          active={selectedField === 'connector'}
          onPress={() => {
            setSelectedField('connector');
             router.push({
              pathname: '/pages/bookings/SelectConnector',
              params: buildNavigationParams(),
            });
            // console.log('Nav Params:', buildNavigationParams());
          }}
        />

        {/* Date & Time */}
        <Text style={styles.label}>Date & Time*</Text>
        <SelectableInput
          icon={
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={20}
              color={selectedField === 'datetime' ? colors.primary : colors.lightGray}
            />
          }
          text={datetime ? `${datetime.label}` : 'Select Date Time'}
          active={selectedField === 'datetime'}
          onPress={() => {
            setSelectedField('datetime');
            router.push({
              pathname: '/pages/bookings/SelectDateTime',
              params: buildNavigationParams(),
            });
          }}
        />
      </ScrollView>

      {/* Add Booking Button */}
      <TouchableOpacity
        style={[styles.addButton, !isFormComplete && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={!isFormComplete}
      >
        <Text
          style={[styles.addButtonText, !isFormComplete && styles.disabledButtonText]}
        >
          Add Booking
        </Text>
      </TouchableOpacity>

      {/* Vehicle Selection Modal */}
      <Modal
        visible={vehicleModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setVehicleModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.dragHandle} />
            <Text style={styles.modalTitle}>Select Vehicle</Text>

            <ScrollView>
              {Array.isArray(ownedVehicles) ? (
              ownedVehicles.length > 0 ? (
                ownedVehicles.map((item) => ( 
                  <TouchableOpacity
                    key={item._id}
                    onPress={() => setSelectedVehicle(item)}
                    activeOpacity={0.9}
                  >
                    <SelectVehicleCard
                      vehicle={item}
                      selected={selectedVehicle?._id === item._id}
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No vehicles found</Text>
                </View>
              )
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Loading vehicles...</Text>
              </View>
            )}
            </ScrollView>

            <TouchableOpacity style={styles.addNewBtn}>
              <Text style={styles.addNewText}>Add New Vehicle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selectBtn}
              onPress={() => {
                // setVehicle(selectedVehicle.name);
                setVehicleModalVisible(false);
              }}
            >
              <Text style={styles.selectBtnText}>Select</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddBooking;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  formContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  label: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginTop: 16,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: colors.white,
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 15,
  },
  disabledButton: { backgroundColor: colors.lightestGray },
  disabledButtonText: { color: colors.secondaryText },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    marginBottom: 12,
    textAlign: 'center',
  },
  addNewBtn: {
    alignItems: 'center',
    marginTop: 6,
  },
  addNewText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  selectBtn: {
    backgroundColor: colors.primary,
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectBtnText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
});