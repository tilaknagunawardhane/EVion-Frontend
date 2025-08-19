import React, { useState, useEffect } from 'react';
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

const ChargingStationScreen = () => {
  const router = useRouter();
  const { stationID: stationId } = useLocalSearchParams();
  const [stationData, setStationData] = useState(null);
  const [selectedConnector, setSelectedConnector] = useState(null);
  const [showBottomPopup, setShowBottomPopup] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStationDetails = async () => {
    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync('accessToken');
      
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/stations/station-details/${stationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

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
      const response = await fetch(`${API_BASE_URL}/api/stations/toggle-bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stationId }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setBookmarked(result.isBookmarked);
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
    if (stationId) {
      fetchStationDetails();
    }
  }, [stationId]);

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
          <TouchableOpacity>
            <Text style={styles.reportText}>Report</Text>
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
                    connectorID: connectorType.connector?._id ? `#${connectorType.connector._id.slice(-4).toUpperCase()}` : '#N/A',
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
                router.push({
                  pathname: '/pages/ReportConnector',
                  params: {
                    stationId,
                    chargerId: selectedConnector?.charger?._id,
                    connectorId: selectedConnector?.connector?.connector?._id
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
  scrollContainer: { paddingBottom: 120 },
  imageContainer: { position: 'relative' },
  stationImage: { width: '100%', height: 220 },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    backgroundColor: colors.background,
    padding: 8,
    borderRadius: 20
  },
  backIcon: { width: 18, height: 18, tintColor: colors.mainTextColor },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 16
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor
  },
  icon: { width: 30, height: 30, marginLeft: 8 },
  subtitle: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginHorizontal: 24
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 16,
    marginTop: 12
  },
  openBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6
  },
  openText: {
    color: colors.background,
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 10
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  starIcon: {
    width: 14,
    height: 14,
    tintColor: colors.star,
    marginRight: 4
  },
  ratingText: {
    fontSize: 10,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor
  },
  reportText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.danger,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 8,
    marginHorizontal: 24
  },
  noConnectors: {
    marginHorizontal: 24,
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
    padding: 24,
    paddingBottom: 32,
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
    marginBottom: 20,
    backgroundColor: colors.lightBackground,
    borderRadius: 12,
    padding: 16,
  },
  chargerTitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  connectorSubtitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
    marginBottom: 8,
  },
  popupHeader: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 16,
    textAlign: 'center',
  },
  
});

export default ChargingStationScreen;