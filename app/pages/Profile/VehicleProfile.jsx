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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_BASE_URL } from '@env';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import Svg, { Path } from 'react-native-svg';

// SVG Icon Components
function BackIcon({ size = 24, color = colors.mainTextColor }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EditIcon({ size = 24, color = colors.secondaryText }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChargingIcon({ size = 24, color = 'white' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 2V8H20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 18V12L9 15H13L10 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function RemoveIcon({ size = 24, color = '#E53935' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

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
          <BackIcon size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.title}>{vehicle.make_info?.make || 'Vehicle'}</Text>
        <TouchableOpacity 
          onPress={() => router.push({
            pathname: '/pages/Profile/UpdateVehicle1',
            params: { userID, vehicleID }
          })}
          style={styles.editButton}
        >
          <EditIcon size={20} color={colors.secondaryText} />
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
          <ChargingIcon size={20} color="white" />
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
            <>
              <RemoveIcon size={20} color="#E53935" />
              <Text style={styles.removeText}>Remove Vehicle</Text>
            </>
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
  editButton: {
    padding: 4,
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  removeText: {
    color: '#E53935',
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 16,
  },
});

export default VehicleProfileScreen;