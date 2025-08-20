import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

import AppBar from '../../../components/AppBar';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import { router } from 'expo-router';
import { API_BASE_URL } from '@env';
import useUserData from '../../../hooks/useUserData';

const FavouritesScreen = () => {
  const { user, isLoading: isUserLoading } = useUserData();
  const [favourites, setFavourites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavourites = async () => {
    try {
      setIsLoading(true);
      if (!user?._id) {
        throw new Error('User ID not found');
      }
      
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/stations/favorites/${user._id}`, {
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
          textBody: result.message || 'Failed to fetch favourites'
        });
        return;
      }

      // Transform API response to match your existing structure
      const formattedFavourites = result.data.map(station => ({
        id: station._id,
        name: station.station_name,
        address: `${station.address}, ${station.city}`,
        image: require('../../../assets/charging-station.png'),
        isFavourite: true,
        status: station.station_status || 'active',
        category: 'favourites'
      }));

      setFavourites(formattedFavourites);
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

  const toggleFavourite = async (stationId) => {
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
        // Update local state
        setFavourites(prev =>
          prev.filter(item => item.id !== stationId)
        );
        
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
        textBody: 'Failed to update favourite',
      });
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchFavourites();
    }
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavourites();
  };

  const renderStationCard = (station) => {
    return (
      <TouchableOpacity
        key={station.id}
        onPress={() => router.push({
          pathname: '/pages/StationProfile',
          params: { stationID: station.id }
        })}
      >
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Image source={station.image} style={styles.stationImage} />
            <View style={styles.stationInfo}>
              <Text style={styles.stationName}>{station.name}</Text>
              <Text style={styles.stationAddress}>{station.address}</Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleFavourite(station.id)}
              style={[
                styles.bookmarkWrapper,
                station.isFavourite && styles.bookmarkWrapperActive
              ]}
            >
              <MaterialCommunityIcons
                name={station.isFavourite ? 'heart' : 'heart-outline'}
                size={24}
                color={station.isFavourite ? colors.danger : colors.danger}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMaintenanceCard = (station) => {
    return (
      <TouchableOpacity
        key={station.id}
        onPress={() => router.push({
          pathname: '/pages/StationProfile',
          params: { stationID: station.id }
        })}
      >
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Image source={station.image} style={styles.stationImage} />
            <View style={styles.stationInfo}>
              <Text style={styles.stationName}>{station.name}</Text>
              <Text style={styles.stationAddress}>{station.address}</Text>
            </View>
            <View style={styles.maintenanceIconWrapper}>
              <MaterialCommunityIcons
                name="tools"
                size={24}
                color={colors.warning}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const activeFavourites = favourites.filter(station =>
    station.category === 'favourites' && station.isFavourite
  );

  const maintenanceStations = favourites.filter(station =>
    station.status === 'maintenance'
  );

  const reportedStations = favourites.filter(station =>
    station.status === 'reported'
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <AppBar title="Favourites" showBackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading favourites...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar title="Favourites" showBackButton />

      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {/* Active Favourites */}
        {activeFavourites.length > 0 ? (
          activeFavourites.map(station => renderStationCard(station))
        ) : (
          <Text style={styles.emptyText}>No favourite stations found</Text>
        )}

        {/* Under Maintenance Section */}
        {maintenanceStations.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Under Maintenance</Text>
            {maintenanceStations.map(station => renderMaintenanceCard(station))}
          </>
        )}

        {/* With Reported Chargers Section */}
        {reportedStations.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>With Reported Chargers</Text>
            {reportedStations.map(station => renderStationCard(station))}
          </>
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
  scrollView: {
    padding: 16,
  },
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginTop: 24,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'cover',
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
    lineHeight: 20,
  },
  bookmarkWrapper: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkWrapperActive: {
    backgroundColor: '#E0F8F1',
  },
  maintenanceIconWrapper: {
    backgroundColor: colors.stroke,
    borderRadius: 8,
    padding: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FavouritesScreen;