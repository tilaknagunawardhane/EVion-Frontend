import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import CustomButton from '../../../components/CustomButton';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import VehicleProfile from '../../../components/VehicleProfile';
import VehicleCard from '../../../components/VehicleCard';
import { useNavigation } from '@react-navigation/native';
import InputField from '../../../components/InputField';
import { router, useLocalSearchParams } from 'expo-router'; // Ensure you have this import for navigation
import { API_BASE_URL } from '@env';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUserData from '../../../hooks/useUserData';
import * as SecureStore from 'expo-secure-store';

const VehicleAddedScreen = ({ navigation, route }) => {
  // Get vehicle parameters from route params
  const params = useLocalSearchParams();
  const { user, isLoading: isUserLoading } = useUserData();
  const { newVehicleID } = params;
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newVehicle, setNewVehicle] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) {
          throw new Error('Not authenticated');
        }
        if (!user?._id) {
          throw new Error('User ID not found');
        }

        const response = await fetch(`${API_BASE_URL}/api/vehicles/fetchVehicles`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ userID: user._id }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch vehicles');
        }

        // Ensure data is always an array
        const vehicleData = Array.isArray(result.data) ? result.data : [];
        setVehicles(vehicleData);

        // Safely find the new vehicle
        if (newVehicleID && vehicleData.length > 0) {
          const foundVehicle = vehicleData.find(v => v._id === newVehicleID) || null;
          setNewVehicle(foundVehicle);
        }
      } catch (error) {
        setError(error.message);
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: error.message || 'Failed to load vehicles',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      fetchVehicles();
    }
  }, [user, newVehicleID]);
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading vehicles...</Text>
      </View>
    );
  }

  const handleAddVehicle = async () => {
    const isSignupFlow = await AsyncStorage.getItem('isSignupFlow');
    const isProfileFlow = await AsyncStorage.getItem('isProfileFlow');

    if (isSignupFlow === 'true') {
      router.push('/pages/AddVehicle/Addcard');
      await AsyncStorage.removeItem('isSignupFlow');
    } else if (isProfileFlow === 'true') {
      router.push('/pages/Profile/MyEVsScreen');
      await AsyncStorage.removeItem('isProfileFlow');
    }
    else {
      router.push('/(tabs)');
    }
  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>My Vehicles</Text>

        <View style={styles.vehicleListContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {vehicles.map((vehicle, index) => (
              <VehicleProfile
                key={index}
                image={require('../../../assets/car.png')}
                name={`${vehicle.make_info?.make || 'Unknown make'}  ${vehicle.model_info?.model || 'Unknown Model'}\n(${vehicle.vehicle_type || 'Not Specified'})`}
              />
            ))}
          </ScrollView>
        </View>


        {newVehicle && (
          <>
            <Text style={styles.subTitle}>New Vehicle Added!</Text>
            <VehicleCard
              image={require('../../../assets/car.png')}
              name={`${newVehicle.make_info?.make || 'Unknown Make'} ${newVehicle.model_info?.model || 'Unknown Model'}`}
              year={newVehicle.manufactured_year?.toString() || 'N/A'}
              batteryCapacity={`${newVehicle.battery_capacity}kWh`}
              batteryHealth={`${newVehicle.battery_health}%`}
              connector1_image={newVehicle.connectorImages?.AC ? { uri: `${API_BASE_URL}${newVehicle.connectorImages.AC}` } : require('../../../assets/type2charger.png')}
              connector1_name={newVehicle.connector_type_AC_info?.type_name || 'N/A'}
              connector2_image={newVehicle.connectorImages?.DC ? { uri: `${API_BASE_URL}${newVehicle.connectorImages.DC}` } : null}
              connector2_name={newVehicle.connector_type_DC_info?.type_name || 'N/A'}
            />
          </>
        )}


      </ScrollView>
      <View />
      <View style={styles.bottomSection}>
        <Text style={styles.addAnotherText}></Text>
        <View style={{ marginBottom: -40 }} />
        <Text
          style={styles.addAnotherLink}
          onPress={() => router.push('/pages/AddVehicle/AddVehicle1')}
        >

          Add Another Vehicle
        </Text>

        {/* <CustomButton title="Continue" onPress={() => router.push('/pages/AddVehicle/Addcard')} /> */}
        <CustomButton title="Continue" onPress={handleAddVehicle} />

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 20,
  },
  vehicleListContainer: {
    height: 140, // Adjust based on your VehicleProfile card height
    marginBottom: 30,
  },

  horizontalScroll: {
    flexDirection: 'row',
    gap: 16, // Space between cards
    paddingBottom: 10,
    paddingHorizontal: 10,
  },

  subTitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    textAlign: 'center',
    marginBottom: 15,
  },
  bottomSection: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  addAnotherText: {
    color: colors.primary,
    fontSize: 1,
    fontFamily: fonts.PlusJakartaSansMedium,
    textAlign: 'center',
    marginBottom: 30,
    // marginTop: 10
  },
  addAnotherLink: {
    color: colors.primary,
    textAlign: 'center',
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 14, // reduced from 16 to 14
    marginBottom: 10,
  },
});

export default VehicleAddedScreen;
