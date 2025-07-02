import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import AppBar from '../../components/TripAppBar';
import DropdownField from '../../components/DropdownField';
import CustomButton from '../../components/CustomButton';
import InputWithIcon from '../../components/InputWithIcon';
import InputField from '../../components/InputField';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import { router } from 'expo-router';
import ConfirmationModal from '../../components/ConfirmationModal';
import VehicleCard from '../../components/Card';

const PlanTripScreen = () => {
  const [startingLocation, setStartingLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [additionalDestinations, setAdditionalDestinations] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('BYD Atto 3');
  const [batteryLevel, setBatteryLevel] = useState('80%');
  const [passengers, setPassengers] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleRoute = () => {
    if (startingLocation && destination && passengers && batteryLevel) {
      setModalVisible(true);
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const handleConfirm = () => {
    setModalVisible(false);
    router.push('/pages/LoadingScreen');
  };

  const handleCancel = () => {
    setModalVisible(false);
    router.push('/pages/LoadingScreen');
  };

  const handleAddDestination = () => {
    setAdditionalDestinations([...additionalDestinations, '']);
  };

  const handleDestinationChange = (text, index) => {
    const newDestinations = [...additionalDestinations];
    newDestinations[index] = text;
    setAdditionalDestinations(newDestinations);
  };

  const handleRemoveDestination = (index) => {
    const newDestinations = [...additionalDestinations];
    newDestinations.splice(index, 1);
    setAdditionalDestinations(newDestinations);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />
      <View style={styles.bottomBackground} />
      <AppBar title="Plan Your Route" />

      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <View style={styles.locationSection}>
              <View style={styles.inputWrapper}>
                <InputWithIcon
                  icon={require('../../assets/from.png')}
                  placeholder="From (Starting Location)"
                  value={startingLocation}
                  onChangeText={setStartingLocation}
                />
              </View>

              <View style={[styles.inputWrapper, { marginTop: 8 }]}>
                <InputWithIcon
                  icon={require('../../assets/to.png')}
                  placeholder="To (Destination)"
                  value={destination}
                  onChangeText={setDestination}
                />
              </View>

              {additionalDestinations.map((dest, index) => (
                <View
                  key={index}
                  style={[styles.inputWrapper, styles.additionalDestinationWrapper]}
                >
                  <InputWithIcon
                    icon={require('../../assets/to.png')}
                    placeholder={`Destination ${index + 2}`}
                    value={dest}
                    onChangeText={(text) => handleDestinationChange(text, index)}
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveDestination(index)}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity style={styles.addDestinationButton} onPress={handleAddDestination}>
                <View style={styles.addDestinationContent}>
                  <Image
                    source={require('../../assets/add_circle.png')}
                    style={styles.addIcon}
                  />
                  <Text style={styles.addDestinationText}>Add Destination</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Choose Vehicle</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.vehicleOptions}
            >
              <VehicleCard
                name="BYD Atto 3"
                type="SUV"
                image={require('../../assets/byd.png')}
                selected={selectedVehicle === 'BYD Atto 3'}
                onPress={() => setSelectedVehicle('BYD Atto 3')}
                isBYD={true}
              />
              <VehicleCard
                name="Hyundai Kona Electric"
                type="SUV"
                image={require('../../assets/kona.png')}
                selected={selectedVehicle === 'Hyundai Kona'}
                onPress={() => setSelectedVehicle('Hyundai Kona')}
                isBYD={false}
              />
            </ScrollView>

            <View style={[styles.inputContainer, { marginTop: 12 }]}>
              <Text style={styles.inputLabel}>
                Battery Level at the Start of the trip*
              </Text>
              <View style={[styles.inputWrapper, { marginTop: -25 }]}>
                <InputField
                  label=""
                  placeholder="Battery Level"
                  value={batteryLevel}
                  onChangeText={setBatteryLevel}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={[styles.inputContainer, { marginTop: 12 }]}>
              <Text style={styles.inputLabel}>Number of Passengers*</Text>
              <View style={[styles.inputWrapper, { marginTop: -25 }]}>
                <DropdownField 
                  label=""
                  selectedValue={passengers}
                  onValueChange={setPassengers}
                  placeholder="Select Here"
                  options={['1', '2', '3', '4', '5', '6+']}
                />
              </View>
            </View>
          </View>

          <CustomButton title="Get Route" onPress={handleRoute} type="primary" />
        </ScrollView>
      </View>

      <ConfirmationModal
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: colors.primary,
    zIndex: -1,
  },
  bottomBackground: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    zIndex: -1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 180,
    paddingTop: 10,
    flexGrow: 1,
  },
  formContainer: {
    width: '100%',
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 50,
  },
  locationSection: {
    marginBottom: 10,
  },
  inputWrapper: {
    width: 332,
    height: 55,
    alignSelf: 'center',
  },
  additionalDestinationWrapper: {
    marginTop: 8,
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    right: 10,
    top: 14,
    zIndex: 1,
  },
  removeButtonText: {
    fontSize: 16,
    color: colors.secondaryText,
    fontWeight: 'bold',
  },
  addDestinationButton: {
    backgroundColor: '#E6F7F2',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  addDestinationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addDestinationText: {
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
  },
  addIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginVertical: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  inputContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  vehicleOptions: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
});

export default PlanTripScreen;
