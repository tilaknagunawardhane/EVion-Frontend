import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import SelectableInput from '../../../components/SelectableInput';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router'; 

const AddBooking = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [selectedField, setSelectedField] = useState(null);
  const [station, setStation] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [connector, setConnector] = useState(null);
  const [datetime, setDatetime] = useState(null);

  const isFormComplete = station && vehicle && connector && datetime;

  const handleSubmit = () => {
    if (!isFormComplete) return;
    // Proceed with booking logic
    console.log('Booking submitted');
  };

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
                  router.push('/pages/bookings/SelectCharger'); // ✅ this opens SelectCharger.jsx
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
          text="Select Vehicle"
          active={selectedField === 'vehicle'}
          onPress={() => {
            setSelectedField('vehicle');
            setVehicle('Nissan Leaf'); // placeholder
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
            setConnector('Type 2'); // placeholder
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
            setDatetime('2025-07-01 10:00 AM'); // placeholder
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
          style={[
            styles.addButtonText,
            !isFormComplete && styles.disabledButtonText,
          ]}
        >
          Add Booking
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddBooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  formContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
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
  disabledButton: {
    backgroundColor: colors.lightestGray,
  },
  disabledButtonText: {
    color: colors.secondaryText,
  },
});
