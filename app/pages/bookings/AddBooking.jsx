import React, { useEffect, useState, useMemo } from 'react';
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
import SelectVehicleCard from '../../../components/SelectVehicleCard';
import SelectConnectorCard from '../../../components/SelectConnectorCard';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function AddBooking() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [selectedField, setSelectedField] = useState(null);
  const [station, setStation] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [connector, setConnector] = useState(null);
  const [datetime, setDatetime] = useState(null);

  const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [connectorModalVisible, setConnectorModalVisible] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState(null);

  /* ------------------------------------------------------------------ */
  /* ----------  PARAMETER‑SYNC EFFECTS (unchanged from before) -------- */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (params.selectedDateTime && String(params.selectedDateTime) !== datetime) {
      setDatetime(String(params.selectedDateTime));
    }
  }, [params.selectedDateTime, datetime]);

  useEffect(() => {
    if (params.selectedStation && params.selectedStation !== 'undefined') {
      try {
        const parsed = JSON.parse(params.selectedStation);
        if (parsed?.id !== station?.id) {
          setStation(parsed);
        }
      } catch (e) {
        console.error('Error parsing station param:', e);
      }
    }
  }, [params.selectedStation, station?.id]);

  useEffect(() => {
    if (params.selectedVehicle && params.selectedVehicle !== 'undefined') {
      try {
        const parsed = JSON.parse(params.selectedVehicle);
        if (parsed?.id !== vehicle?.id) {
          setVehicle(parsed);
          setSelectedVehicle(parsed);
        }
      } catch (e) {
        console.error('Error parsing vehicle param:', e);
      }
    }
  }, [params.selectedVehicle, vehicle?.id]);

  useEffect(() => {
    if (params.selectedConnector && params.selectedConnector !== 'undefined') {
      try {
        const parsed = JSON.parse(params.selectedConnector);
        if (parsed?.id !== connector?.id) {
          setConnector(parsed);
          setSelectedConnector(parsed);
        }
      } catch (e) {
        console.error('Error parsing connector param:', e);
      }
    }
  }, [params.selectedConnector, connector?.id]);

  /* ------------------------------------------------------------------ */
  /* --------------------  DATA SOURCE ARRAYS  ------------------------ */
  /* ------------------------------------------------------------------ */
  /* In production these can be fetched or imported from another file   */

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

  const connectors = [
    {
      id: '#E0299',
      label: 'Type 2 (Mennekes)',
      status: 'Available',
      batteryGain: '~20% in 30 mins',
      estTime: '~2.5 - 3 hrs',
      power: '22kW (AC)',
      price: 'LKR 55.00 /kW',
      icon: require('../../../assets/type2.png'),
    },
    {
      id: '#E0300',
      label: 'CHAdeMO',
      status: 'Available',
      batteryGain: '~80% in 40 mins',
      estTime: '~45 – 60 mins',
      power: '50kW (DC)',
      price: 'LKR 65.00 /kW',
      icon: require('../../../assets/chademo.png'),
    },
    {
      id: '#E0301',
      label: 'CCS Combo Type 2',
      status: 'Available',
      batteryGain: '~80% in 40 mins',
      estTime: '~45 – 60 mins',
      power: '50kW (DC)',
      price: 'LKR 65.00 /kW',
      icon: require('../../../assets/ccs2.png'),
    },
  ];

  /* ------------------------------------------------------------------ */
  /* ---------  FILTER CONNECTORS BASED ON SELECTED VEHICLE  ---------- */
  /* ------------------------------------------------------------------ */

  const filteredConnectors = useMemo(() => {
    // If no vehicle selected yet, allow all connectors
    if (!vehicle || !vehicle.ports?.length) return connectors;

    const supportedLabels = vehicle.ports.map((p) => p.label);
    return connectors.filter((c) => supportedLabels.includes(c.label));
  }, [vehicle, connectors]);

  /* If user changes vehicle and chosen connector isn’t supported,
     clear the connector selection */
  useEffect(() => {
    if (
      connector &&
      !filteredConnectors.some((c) => c.id === connector.id)
    ) {
      setConnector(null);
      setSelectedConnector(null);
    }
  }, [filteredConnectors, connector]);

  /* ------------------------------------------------------------------ */
  /* -----------------------  FORM HELPERS  --------------------------- */
  /* ------------------------------------------------------------------ */

  const isFormComplete = station && vehicle && connector && datetime;

  const handleSubmit = () => {
    if (!isFormComplete) return;
    console.log('Booking submitted', { station, vehicle, connector, datetime });
    router.push('/pages/bookings/BookingConfirmation');
  };

  const buildNavigationParams = () => ({
    ...(station && { selectedStation: JSON.stringify(station) }),
    ...(vehicle && { selectedVehicle: JSON.stringify(vehicle) }),
    ...(connector && { selectedConnector: JSON.stringify(connector) }),
    ...(datetime && { selectedDateTime: datetime }),
  });

  /* ------------------------------------------------------------------ */
  /* ------------------------  RENDER HELPERS  ------------------------ */
  /* ------------------------------------------------------------------ */

  const renderConnectorText = () => {
    if (!connector) return 'Select Connector';
    return (
      <View style={styles.connectorDetails}>
        <Text style={styles.connectorLabel}>{connector.label}</Text>
        <View style={styles.connectorRow}>
          <Text style={styles.connectorSubtext}>{connector.power}</Text>
          <Text style={styles.connectorSubtext}>{connector.price}</Text>
        </View>
      </View>
    );
  };

  const renderStationText = () => {
    if (!station) return 'Select Charging Station';
    return (
      <View>
        <Text style={styles.stationName}>{station.name}</Text>
        <Text style={styles.stationLocation}>{station.location}</Text>
      </View>
    );
  };

  /* ------------------------------------------------------------------ */
  /* ---------------------------  UI  --------------------------------- */
  /* ------------------------------------------------------------------ */

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
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
          text={renderStationText()}
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
          text={selectedVehicle ? selectedVehicle.name : 'Select Vehicle'}
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
          text={renderConnectorText()}
          active={selectedField === 'connector'}
          onPress={() => {
            setSelectedField('connector');
            setConnectorModalVisible(true);
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
          text={datetime ?? 'Select Date & Time'}
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

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.addButton, !isFormComplete && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={!isFormComplete}
      >
        <Text style={[styles.addButtonText, !isFormComplete && styles.disabledButtonText]}>
          Add Booking
        </Text>
      </TouchableOpacity>

      {/* --------------------  Vehicle Modal  -------------------- */}
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
                if (selectedVehicle) {
                  setVehicle(selectedVehicle);
                  setVehicleModalVisible(false);
                }
              }}
            >
              <Text style={styles.selectBtnText}>Select</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* -------------------  Connector Modal  ------------------- */}
      <Modal
        visible={connectorModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setConnectorModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.dragHandle} />
            <Text style={styles.modalTitle}>Select Connector</Text>

            <ScrollView style={{ maxHeight: 400 }}>
              {filteredConnectors.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setSelectedConnector(item)}
                  activeOpacity={0.9}
                >
                  <SelectConnectorCard
                    connector={item}
                    selected={selectedConnector?.id === item.id}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.selectBtn}
              onPress={() => {
                if (selectedConnector) {
                  setConnector(selectedConnector);
                  setConnectorModalVisible(false);
                }
              }}
            >
              <Text style={styles.selectBtnText}>Select</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* ----------------------------  STYLES  ---------------------------- */
/* ------------------------------------------------------------------ */
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
  disabledButtonText: { color: colors.lightGray },
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
  addNewBtn: { alignItems: 'center', marginTop: 6 },
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
  connectorDetails: {
    flex: 1,
  },
  connectorLabel: {
    fontFamily: fonts.PlusJakartaSansSemiBold,
    fontSize: 14,
    color: colors.mainTextColor,
  },
  connectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  connectorSubtext: {
    fontSize: 12,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
  stationName: {
    fontFamily: fonts.PlusJakartaSansSemiBold,
    fontSize: 14,
    color: colors.mainTextColor,
  },
  stationLocation: {
    fontSize: 12,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    marginTop: 2,
  },
});
