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
import * as SecureStore from 'expo-secure-store';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import Svg, { Path } from 'react-native-svg';

import AppBar from '../../../components/AppBar';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import { router } from 'expo-router';
import { API_BASE_URL } from '@env';
import useUserData from '../../../hooks/useUserData';

// SVG Icon Components
function HeartIcon({ size = 24, color = colors.danger, filled = false }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
      <Path
        d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
        stroke={color}
        strokeWidth={filled ? 0 : 2}
        fill={filled ? color : 'none'}
      />
    </Svg>
  );
}

function ToolsIcon({ size = 24, color = colors.warning }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21.71 20.29L20.29 21.71C20.1 21.9 19.85 22 19.59 22C19.33 22 19.08 21.9 18.89 21.71L16.25 19.07C15.38 19.43 14.45 19.62 13.5 19.62C9.85 19.62 6.9 16.67 6.9 13.02C6.9 11.34 7.51 9.78 8.55 8.55L3.5 3.5C3.11 3.11 3.11 2.47 3.5 2.08C3.89 1.69 4.53 1.69 4.92 2.08L9.97 7.13C11.2 6.09 12.76 5.48 14.44 5.48C18.09 5.48 21.04 8.43 21.04 12.08C21.04 13.03 20.85 13.96 20.49 14.83L23.13 17.47C23.52 17.86 23.52 18.5 23.13 18.89L21.71 20.29ZM10.54 15.46C11.48 16.4 12.92 16.4 13.86 15.46L19.91 9.41C19.96 9.36 19.96 9.28 19.91 9.23L18.09 7.41C18.04 7.36 17.96 7.36 17.91 7.41L11.86 13.46C10.92 14.4 10.92 15.84 11.86 16.78L10.54 15.46Z"
        fill={color}
      />
    </Svg>
  );
}

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
              <HeartIcon
                size={24}
                filled={station.isFavourite}
                color={colors.danger}
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
              <ToolsIcon size={24} color={colors.warning} />
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