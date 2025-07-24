import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

import AppBar from '../../../components/AppBar';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';


import BookmarkIcon from '../../../assets/favourite.png';
import BookmarkFilledIcon from '../../../assets/bookmark.png';
import MaintenanceIcon from '../../../assets/favourite.png';

const FavouritesScreen = () => {

  const [favourites, setFavourites] = useState([
    {
      id: 1,
      name: 'Genso Charging Station',
      address: 'Southern Highway, Welipenna, Matugama',
      image: require('../../../assets/charging-station.png'),
      isFavourite: true,
      status: 'active',
      category: 'favourites'
    },
    {
      id: 2,
      name: 'Electric Vehicle Charging Station',
      address: 'Wellawaya Rd, Wadduwa',
      image: require('../../../assets/charging-station.png'),
      isFavourite: true,
      status: 'active',
      category: 'favourites'
    },
    {
      id: 3,
      name: 'Electric Vehicle Charging Station',
      address: 'Wellawaya Rd, Wadduwa',
      image: require('../../../assets/charging-station.png'),
      isFavourite: false,
      status: 'maintenance',
      category: 'maintenance'
    },
    {
      id: 4,
      name: 'Electric Vehicle Charging Station',
      address: 'Wellawaya Rd, Wadduwa',
      image: require('../../../assets/charging-station.png'),
      isFavourite: true,
      status: 'reported',
      category: 'reported'
    },
  ]);

  const toggleFavourite = (id) => {
    setFavourites(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isFavourite: !item.isFavourite } : item
      )
    );
  };

  const renderStationCard = (station) => {
    return (
      <TouchableOpacity
        key={station.id}
        // style={styles.card}
        onPress={() => router.push({
          pathname: '/pages/StationProfile',
          params: { id: station.id }
        })}
      >
        <View key={station.id} style={styles.card}>
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
              <Image
                source={station.isFavourite ? BookmarkFilledIcon : BookmarkIcon}
                style={styles.bookmarkIcon}
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
        // style={styles.card}
        onPress={() => router.push({
          pathname: '/pages/StationProfile',
          params: { id: station.id }
        })}
      >
        <View key={station.id} style={styles.card}>
          <View style={styles.cardContent}>
            <Image source={station.image} style={styles.stationImage} />
            <View style={styles.stationInfo}>
              <Text style={styles.stationName}>{station.name}</Text>
              <Text style={styles.stationAddress}>{station.address}</Text>
            </View>
            <View style={styles.maintenanceIconWrapper}>
              <Image source={MaintenanceIcon} style={styles.maintenanceIcon} />
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
    station.category === 'maintenance'
  );

  const reportedStations = favourites.filter(station =>
    station.category === 'reported'
  );

  return (
    <View style={styles.container}>
      <AppBar title="Favourites" showBackButton />

      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Favourites */}
        {activeFavourites.map(station => renderStationCard(station))}

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
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkWrapperActive: {
    backgroundColor: '#E0F8F1',
  },
  bookmarkIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  maintenanceIconWrapper: {
    backgroundColor: colors.stroke,
    borderRadius: 8,
    padding: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintenanceIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

export default FavouritesScreen;