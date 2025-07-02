import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import SelectVehicleCard from '../../../components/SelectVehicleCard';

const AddBooking = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [selectedField, setSelectedField] = useState(null);
  const [station, setStation] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [connector, setConnector] = useState(null);
  const [datetime, setDatetime] = useState(null);
  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const isFormComplete = station && vehicle && connector && datetime;

  const handleSubmit = () => {
    if (!isFormComplete) return;
    console.log('Booking submitted');
  };

  const vehicles = [
  {
    id: 1,
    name: 'BYD Atto 3 (SUV)',
    year: '2022',
    battery: '60.48kWh',
    speed: '80 kW DC Fast',
    image: require('../../../assets/vehicles/atto3.png'),
    ports: [
      { icon: 'ev-plug-type2', label: 'Type 2 (Mennekes)' },
      { icon: 'ev-plug-chademo', label: 'CHAdeMO' },
    ],
  },
  {
    id: 2,
    name: 'Hyundai Kona Electric (SUV)',
    year: '2022',
    battery: '64kWh',
    speed: '80 kW DC Fast',
    image: require('../../../assets/vehicles/dolphin.png'),
    ports: [
      { icon: 'ev-plug-type2', label: 'Type 2 (Mennekes)' },
      { icon: 'ev-plug-ccs2', label: 'CCS Combo Type 2' },
    ],
  },
];


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
          text={station ? station : "Select Charging Station"}
          active={selectedField === 'station'}
          onPress={() => {
            setSelectedField('station');
            router.push('/pages/bookings/SelectCharger');
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
          text={selectedVehicle ? selectedVehicle.name : "Select Vehicle"}
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
          text="Select Connector"
          active={selectedField === 'connector'}
          onPress={() => {
            setSelectedField('connector');
            setConnector('Type 2');
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
          text="Select Date & Time"
          active={selectedField === 'datetime'}
          onPress={() => {
            setSelectedField('datetime');
            setDatetime('2025-07-01 10:00 AM');
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
              {vehicles.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setSelectedVehicle(item)}
                  activeOpacity={0.9}
                >
                  <SelectVehicleCard
                    vehicle={item}
                    selected={selectedVehicle?.id === item.id}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.addNewBtn}>
              <Text style={styles.addNewText}>Add New Vehicle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.selectBtn}
              onPress={() => {
                setVehicle(selectedVehicle.name);
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
