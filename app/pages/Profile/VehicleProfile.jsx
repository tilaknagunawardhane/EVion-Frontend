import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_BASE_URL } from '@env';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

const VehicleProfileScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userID, vehicleID } = params;

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/vehicles/getVehicleByID`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, vehicleID }),
      });

      const result = await response.json();

      if (!response.ok) {
        Toast.show({
          type: ALERT_TYPE.ERROR,
          title: 'Error',
          textBody: result.message || 'Failed to fetch vehicle details',
        });
        return;
      }

      setVehicle(result.data);
    } catch (error) {
      console.error('Fetch error:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: error.message || 'Network error occurred',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRemoveVehicle = async () => {
    try {
      setIsDeactivating(true);

      const response = await fetch(`${API_BASE_URL}/api/vehicles/deactivateVehicle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: params.userID,
          vehicleID: params.vehicleID
        })
      });

      const result = await response.json();

      if (!response.ok) {
        Toast.show({
          type: ALERT_TYPE.ERROR,
          title: 'Error',
          textBody: result.message || 'Failed to remove vehicle',
        });
        return;
      }

      router.replace('/pages/Profile/MyEVsScreen');


    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: error.message || 'Failed to remove vehicle',
      });
    } finally {
      setIsDeactivating(false);
    }
  };

  useEffect(() => {
    if (userID && vehicleID) {
      fetchVehicle();
    }
  }, [userID, vehicleID]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVehicle();
  };

  if (loading && !vehicle) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading vehicle details...</Text>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Vehicle not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.title}>{vehicle.make_info?.make || 'Vehicle'}</Text>
        <TouchableOpacity onPress={() => router.push({
          pathname: '/pages/Profile/UpdateVehicle1',
          params: { userID, vehicleID }
        })}>
          <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        {vehicle.model_info?.model || 'Model'}  |  {vehicle.manufactured_year || 'Year'}
      </Text>

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
        <View style={styles.imageAndStatsRow}>
          <Image
            source={
              require('../../../assets/Ford.png')
            }
            style={styles.image}
            defaultSource={require('../../../assets/Ford.png')}
          />

          <View style={styles.rightStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{vehicle.battery_capacity || 'N/A'} kWh</Text>
              <Text style={styles.statLabel}>Battery Capacity</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{vehicle.battery_health || 'N/A'} %</Text>
              <Text style={styles.statLabel}>Battery Health</Text>
            </View>
          </View>
        </View>

        <View style={styles.connectorSection}>
          <View style={styles.connectorWrapper}>
            <Text style={styles.connectorLabel}>AC Connectors</Text>
            <View style={styles.connectorCard}>
              <Image
                source={vehicle.connectorImages?.AC ?
                  { uri: `${API_BASE_URL}${vehicle.connectorImages.AC}` } :
                  require('../../../assets/type2.png')
                }
                style={styles.connectorIcon}
              />
              <Text style={styles.connectorType}>
                {vehicle.connector_type_AC_info?.type_name || 'N/A'}
              </Text>
              <Text style={styles.connectorPower}>
                {vehicle.max_power_AC || 'N/A'} kW
              </Text>
            </View>
          </View>

          <View style={styles.connectorWrapper}>
            <Text style={styles.connectorLabel}>DC Connectors</Text>
            <View style={styles.connectorCard}>
              <Image
                source={vehicle.connectorImages?.DC ?
                  { uri: `${API_BASE_URL}${vehicle.connectorImages.DC}` } :
                  require('../../../assets/type2.png')
                }
                style={styles.connectorIcon}
              />
              <Text style={styles.connectorType}>
                {vehicle.connector_type_DC_info?.type_name || 'N/A'}
              </Text>
              <Text style={styles.connectorPower}>
                {vehicle.max_power_DC || 'N/A'} kW
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.chargeNowButton}
          onPress={() => router.push('/pages/StartChargingModal')}
        >
          <Text style={styles.chargeNowText}>Charge Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Alert.alert(
      'Remove Vehicle',
      'Are you sure you want to remove this vehicle?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: handleRemoveVehicle,
          style: 'destructive',
        },
      ]
    );
          }}
          disabled={isDeactivating}
          style={styles.removeButton}
        >
          {isDeactivating ? (
            <ActivityIndicator color="#E53935" />
          ) : (
            <Text style={styles.removeText}>Remove Vehicle</Text>
          )}
        </TouchableOpacity>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 16,
  },
  appBar: {
    paddingTop: 60,
    paddingBottom: 4,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  edit: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageAndStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: 180,
    height: 301,
    resizeMode: 'contain',
  },
  rightStats: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  statItem: {
    marginBottom: 18,
  },
  statValue: {
    fontSize: 24,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
  },
  connectorSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 74,
  },
  connectorWrapper: {
    flex: 1,
  },
  connectorCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    marginTop: 8,
    marginRight: 30,
    width: '100%',
  },
  connectorIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  connectorType: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    textAlign: 'center',
  },
  connectorPower: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.HighlightText,
    marginVertical: 4,
  },
  connectorLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
  },
  chargeNowButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  chargeNowText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  removeVehicleText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: '#E53935',
    textAlign: 'center',
    marginTop: 8,
  },
  removeButton: {
    marginTop: 0,
    padding: 12,
    alignItems: 'center',
  },
  removeText: {
    color: '#E53935',
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 16,
  },
});

export default VehicleProfileScreen;