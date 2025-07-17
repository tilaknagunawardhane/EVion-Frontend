import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import CustomButton from '../../../components/CustomButton';

const MyEVsScreen = () => {
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const user1 = await AsyncStorage.getItem('user');
      if (user1) {
        const userObj = JSON.parse(user1); // Parse FIRST
        setUser(userObj);
        console.log('user: ', user);
      }
    };
    getUser();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      if (!user?.user?._id) return;
      // console.log('Fetching vehicles for user:', user._id);

      const response = await fetch(`${API_BASE_URL}/api/vehicles/fetchVehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: user.user._id }),
      });

      const result = await response.json();
      // console.log('API response:', result);

      if (!response.ok) {
        Toast.show({
          type: ALERT_TYPE.ERROR,
          title: 'Error',
          textBody: result.message || 'Failed to fetch vehicles'
        });
      }

      setVehicles(result.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: error.message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddVehicle = async () => {
      await AsyncStorage.setItem('isProfileFlow', 'true');
    
      router.push('/pages/AddVehicle/AddVehicle1');
  }

  useEffect(() => {
    if (user?.user?._id) {
      fetchVehicles();
    }
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVehicles();
  };

  if (loading && vehicles.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your vehicles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.title}>My EVs</Text>
        <TouchableOpacity onPress={handleAddVehicle}>
          <Ionicons name="add-circle-outline" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {vehicles.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No vehicles found</Text>
            <CustomButton
              title="Add Your First Vehicle"
              onPress={handleAddVehicle}
            />
          </View>
        ) : (
          vehicles.map((vehicle, index) => (
            <TouchableOpacity
              key={vehicle._id || index}
              style={styles.card}
              // In your MyEVsScreen where you navigate:
              onPress={() =>
                router.push({
                  pathname: '/pages/Profile/VehicleProfile',
                  params: {
                    vehicleID: vehicle._id,
                    userID: user.user._id,
                  },
                })
              }

            >
              <Image
                source={
                  require('../../../assets/Ford.png')}
                style={styles.image}
              />
              <View style={styles.info}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.brand}>{vehicle.make_info?.make || 'Unknown Brand'}</Text>
                </View>
                <Text style={styles.model}>{vehicle.model_info?.model || 'Unknown Model'}</Text>
                <Text style={styles.year}>{vehicle.manufactured_year || 'N/A'}</Text>
                <Text style={styles.kW}>{vehicle.battery_capacity ? `${vehicle.battery_capacity}kWh` : 'N/A'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.mainTextColor} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 20,
  },
  appBar: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    height: 132,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 130,
    height: 100,
    resizeMode: 'contain',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  brand: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  model: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginTop: 2,
  },
  year: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
    marginTop: 2,
  },
  kW: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.HighlightText,
    marginTop: 4,
  },
});

export default MyEVsScreen;