import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
  RefreshControl,
  FlatList
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import ConnectorCard from '../../components/ConnectorCard';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_BASE_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { useLocalSearchParams } from 'expo-router';
import useUserData from '../../hooks/useUserData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ChargingStationScreen = () => {
  const router = useRouter();
  const { stationID: stationId } = useLocalSearchParams();
  const { user, isLoading: isUserLoading } = useUserData();
  const [stationData, setStationData] = useState(null);
  const [selectedConnector, setSelectedConnector] = useState(null);
  const [showBottomPopup, setShowBottomPopup] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStationDetails = async () => {
    try {
      setIsLoading(true);
      if (!user?._id) {
        throw new Error('User ID not found');
      }
      const token = await SecureStore.getItemAsync('accessToken');

      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/stations/station-details/${stationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: user._id })
      });

      const result = await response.json();
      console.log('Station Details:', result);

      if (!response.ok) {
        Toast.show({
          type: ALERT_TYPE.ERROR,
          title: 'Error',
          textBody: result.message || 'Failed to fetch station details'
        });
        return;
      }

      setStationData(result.data);
      setBookmarked(result.data?.isBookmarked || false);
    } catch (error) {
      console.error('Fetch error:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: error.message,
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const toggleBookmark = async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/stations/toggle-favorite/${stationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id })

      });

      const result = await response.json();

      if (response.ok) {
        setBookmarked(result.isFavorite);
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: result.message,
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.ERROR,
          title: 'Error',
          textBody: result.message,
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Failed to update bookmark',
      });
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchStationDetails();
    }
  }, [user]);


  const onRefresh = () => {
    setRefreshing(true);
    fetchStationDetails();
  };

  const handleConnectorPress = (chargerIndex, connectorIndex) => {
    const charger = stationData.chargers[chargerIndex];
    const connector = charger.connector_types[connectorIndex];
    setSelectedConnector({
      chargerIndex,
      connectorIndex,
      charger,
      connector
    });
    setShowBottomPopup(true);
  };

  if (isLoading && !stationData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading station details...</Text>
      </View>
    );
  }

  if (!stationData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Station not found</Text>
        <CustomButton
          title="Go Back"
          onPress={() => router.back()}
        />
      </View>
    );
  }

  // Calculate average rating
  const averageRating = stationData.ratings?.length > 0
    ? stationData.ratings.reduce((sum, rating) => sum + rating.stars, 0) / stationData.ratings.length
    : 0;

  return (
    <View style={styles.container}>
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
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/Station.jpg')}
            style={styles.stationImage}
          />
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Image source={require('../../assets/back-icon.png')} style={styles.backIcon} />
          </TouchableOpacity>
        </View>

        {/* Header Title */}
        <View style={styles.topRow}>
          <Text style={styles.title}>{stationData.station_name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0 }}>
            <TouchableOpacity onPress={toggleBookmark}>
              <MaterialCommunityIcons
                name={bookmarked ? 'heart' : 'heart-outline'}
                size={24}
                color={bookmarked ? colors.danger : colors.danger}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons name="navigation" size={44} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.subtitle}>{stationData.address}, {stationData.city}</Text>

        {/* Status & Rating */}
        <View style={styles.statusRow}>
          <View style={[
            styles.openBadge,
            { backgroundColor: stationData.station_status === 'open' ? colors.primary : colors.danger }
          ]}>
            <Text style={styles.openText}>
              {stationData.station_status === 'open' ? 'Open' : 'Closed'}
            </Text>
          </View>
          <View style={styles.ratingRow}>
            <Image source={require('../../assets/star.png')} style={styles.starIcon} />
            <Text style={styles.ratingText}>
              {averageRating.toFixed(1)} ({stationData.ratings?.length || 0} Reviews)
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push({
              pathname: '/pages/StationReport',
              params: { stationId: stationId, station_name: stationData.station_name, station_address: stationData.address, station_city: stationData.city }
            })}
          >
            <Text style={styles.reportText} >Report</Text>
          </TouchableOpacity>
        </View>

        {/* Chargers List */}
        <Text style={styles.sectionTitle}>Available Chargers</Text>

        {stationData.chargers?.length > 0 ? (
          stationData.chargers.map((charger, chargerIndex) => (
            <View key={charger._id || chargerIndex} style={styles.chargerContainer}>
              <Text style={styles.chargerTitle}>
                Charger: {charger.charger_name} ({charger.power_type} - {charger.max_power_output}kW)
              </Text>

              {/* Connectors List */}
              <Text style={styles.connectorSubtitle}>Connectors:</Text>

              {charger.connector_types?.length > 0 ? (
                charger.connector_types.map((connectorType, connectorIndex) => {
                  const connectorData = {
                    status: connectorType.status === 'available' ? 'Available' : 'Unavailable',
                    connectorType: connectorType.connector?.type_name || 'Unknown',
                    connectorID: connectorType.connector_id ? `#${connectorType.connector_id.slice(-4).toUpperCase()}` : '#N/A',
                    // For the actual connector document ID, you can also store it separately if needed
                    connectorDocumentId: connectorType.connector?._id,
                    connectorImage: connectorType.connector_img
                      ? { uri: `${API_BASE_URL}${connectorType.connector_img}` }
                      : require('../../assets/type2.png'),
                    batteryGain: charger.power_type === 'DC'
                      ? '35% in 30 mins'
                      : '20% in 30 mins',
                    estimatedTime: charger.power_type === 'DC'
                      ? '~45 mins'
                      : '~2.5 - 3 hrs',
                    powerInfo: `${charger.max_power_output}kW (${charger.power_type})`,
                    price: `LKR ${charger.price || 0}.00`,
                  };

                  return (
                    <ConnectorCard
                      key={connectorIndex}
                      index={connectorIndex + 1}
                      {...connectorData}
                      onPress={() => handleConnectorPress(chargerIndex, connectorIndex)}
                    />
                  );
                })
              ) : (
                <Text style={styles.noConnectors}>No connectors available for this charger.</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noConnectors}>No chargers available at this station.</Text>
        )}
      </ScrollView>

      {/* Bottom Popup Modal */}
      <Modal
        transparent
        visible={showBottomPopup}
        animationType="slide"
        onRequestClose={() => setShowBottomPopup(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowBottomPopup(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.popupHeader}>
              {selectedConnector?.charger?.charger_name} - {selectedConnector?.connector?.connector?.type_name}
            </Text>

            <CustomButton
              title="Book Now"
              onPress={() => {
                router.push({
                  pathname: '/pages/bookings/AddBooking',
                  params: {
                    stationId,
                    chargerId: selectedConnector?.charger?._id,
                    connectorId: selectedConnector?.connector?.connector?._id
                  }
                });
                setShowBottomPopup(false);
              }}
              type="primary"
              style={[styles.popupButton, { backgroundColor: colors.primary }]}
              textStyle={{ color: colors.background }}
            />

            <CustomButton
              title="Check Availability"
              onPress={() => {
                router.push({
                  pathname: '/pages/CheckAvailability',
                  params: {
                    stationId,
                    chargerId: selectedConnector?.charger?._id,
                    connectorId: selectedConnector?.connector?.connector?._id
                  }
                });
                setShowBottomPopup(false);
              }}
              type="primary"
              style={[styles.popupButton, { backgroundColor: colors.bgGreen }]}
              textStyle={{ color: colors.primary }}
            />

            <CustomButton
              title="Report Connector"
              onPress={() => {
                const currentConnector = selectedConnector?.connector;
                router.push({
                  pathname: '/pages/ChargerReport',
                  params: {
                    stationId,
                    station_name: stationData.station_name,
                    station_address: stationData.address,
                    station_city: stationData.city,
                    chargerId: selectedConnector?.charger?._id,
                    charger_name: selectedConnector?.charger?.charger_name,
                    // Use the correct path based on your data structure
                    connectorId: currentConnector?.connector_id, // The connector document ID
                    connectorTypesId: currentConnector?._id, // The connector_types document ID
                    connector_type: currentConnector?.connector?.type_name,
                    connector_status: currentConnector?.status, // This is directly on connectorType
                    connector_img: currentConnector?.connector_img // This is directly on connectorType
                  }
                });
                setShowBottomPopup(false);
              }}
              type="primary"
              style={[styles.popupButton, { backgroundColor: 'transparent' }]}
              textStyle={{ color: colors.danger }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Add these new styles to your existing StyleSheet
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontFamily: fonts.PlusJakartaSans,
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
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 20,
  },
  scrollContainer: { paddingBottom: 10 },
  imageContainer: { position: 'relative' },
  stationImage: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.28, resizeMode: 'cover' },
  backButton: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.05,
    left: SCREEN_WIDTH * 0.04,
    backgroundColor: colors.background,
    padding: SCREEN_WIDTH * 0.02,
    borderRadius: 20
  },
  backIcon: { width: SCREEN_WIDTH * 0.045, height: SCREEN_WIDTH * 0.045, tintColor: colors.mainTextColor },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: SCREEN_WIDTH * 0.05,
    marginTop: SCREEN_HEIGHT * 0.02
  },
  title: {
    fontSize: SCREEN_WIDTH < 375 ? 18 : 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor
  },
  icon: { width: SCREEN_WIDTH * 0.075, height: SCREEN_WIDTH * 0.075, marginLeft: SCREEN_WIDTH * 0.02 },
  subtitle: {
    fontSize: SCREEN_WIDTH < 375 ? 12 : 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginHorizontal: SCREEN_WIDTH * 0.05
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: SCREEN_WIDTH * 0.04,
    marginTop: SCREEN_HEIGHT * 0.015,
    marginBottom: SCREEN_HEIGHT * 0.01
  },
  openBadge: {
    paddingHorizontal: SCREEN_WIDTH * 0.03,
    paddingVertical: SCREEN_HEIGHT * 0.005,
    borderRadius: 6
  },
  openText: {
    color: colors.background,
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: SCREEN_WIDTH < 375 ? 10 : 12,

  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  starIcon: {
    width: SCREEN_WIDTH * 0.035,
    height: SCREEN_WIDTH * 0.035,
    tintColor: colors.star,
    marginRight: SCREEN_WIDTH * 0.01
  },
  ratingText: {
    fontSize: SCREEN_WIDTH < 375 ? 10 : 12,

    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor
  },
  reportText: {
    fontSize: SCREEN_WIDTH < 375 ? 14 : 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.danger,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  sectionTitle: {
    fontSize: SCREEN_WIDTH < 375 ? 14 : 16,

    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginHorizontal: SCREEN_WIDTH * 0.05
  },
  noConnectors: {
    marginHorizontal: SCREEN_WIDTH * 0.06,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SCREEN_WIDTH * 0.06,
    paddingBottom: SCREEN_HEIGHT * 0.04,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  popupButton: {
    marginBottom: 0,
  },
  chargerContainer: {
    marginBottom: SCREEN_HEIGHT * 0.025,
    backgroundColor: colors.lightBackground,
    borderRadius: 12,
    padding: SCREEN_WIDTH * 0.04,
  },
  chargerTitle: {
    fontSize: SCREEN_WIDTH < 375 ? 14 : 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  connectorSubtitle: {
    fontSize: SCREEN_WIDTH < 375 ? 12 : 16,

    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  popupHeader: {
    fontSize: SCREEN_WIDTH < 375 ? 16 : 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: SCREEN_HEIGHT * 0.02,
    textAlign: 'center',
  },

});

export default ChargingStationScreen;