import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_BASE_URL } from '@env';
import useUserData from '../../../hooks/useUserData';

// const favouriteStations = [
//   {
//     _id: '687d2ec70e0c0b8ef0b4186c',
//     name: 'Genso Charging Station',
//     address: 'Southern Highway, Welipenna, Matugama',
//     image: require('../../../assets/chargingStations/genso1.png'),
//   },
//   {
//     _id: '686cc1846c2941a55f13a8cd',
//     name: 'Electric Vehicle Charging Station',
//     address: 'Wellawaya Rd, Wadduwa',
//     image: require('../../../assets/chargingStations/genso1.png'),
//   },
// ];

const SelectCharger = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedConnector, setSelectedConnector] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  const [favouriteStations, setfavouriteStations] = useState(null);

  const { user } = useUserData();

  useEffect(() => {
    if (!user) return;

    if(params.selectedVehicle){
      const vehicle = JSON.parse(params.selectedVehicle);
      setSelectedVehicle(vehicle);
    }
    if(params.selectedConnector){
      const Connector = JSON.parse(params.selectedConnector);
      setSelectedConnector(Connector);
    }
    if(params.selectedDateTime){
      console.log('dateTime: ', params.selectedDateTime);
      const dateTime = JSON.parse(params.selectedDateTime);
      setSelectedDateTime(dateTime);
    }

    console.log('selected vehicle: ', selectedVehicle);
    console.log('selected connector: ', selectedConnector);


    //Fetching the Favourite stations

    const fetchFavouriteStations = async () => {
      try {
        const url = `${API_BASE_URL}/api/bookings/getFavouritePartneredStations?ev_user_id=${user._id}`;
        console.log('Fetching from:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

      const data = await response.json();
      if (response.ok) {
        console.log('Samples: ', data);
        setfavouriteStations(Array.isArray(data) ? data : []);
      }
      else{
        console.error('Error:', data.message || 'No message provided');
      }

      } catch (error) {
        console.error('Fetch error:', error.message);
        console.error('Error stack:', error.stack);
      }
    };

    fetchFavouriteStations();

  }, [user]);

  useEffect(() => {
    console.log('Favourite Stations: ', favouriteStations);
  }, [favouriteStations]);

  const buildNavigationParams = () => ({
    ...(selectedVehicle && { selectedVehicle: JSON.stringify(selectedVehicle) }),
    ...(selectedConnector && { selectedConnector: JSON.stringify(selectedConnector) }),
    ...(selectedStation && { selectedStation: JSON.stringify(selectedStation)}),
    ...(selectedDateTime && { selectedDateTime: JSON.stringify(selectedDateTime)}),
  });

  const handleSelect = () => {
    if (selectedStation) {
      router.push({
        pathname: '/pages/bookings/AddBooking',
        params: buildNavigationParams(),
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Charging Stations</Text>
        <TouchableOpacity>
          <Icon name="ellipsis-vertical" size={20} color={colors.black} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search a station"
          placeholderTextColor={colors.secondaryText}
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
        <Icon name="search-outline" size={20} color={colors.lightGray} style={styles.searchIcon} />
      </View>

      {/* Open Map */}
      <TouchableOpacity style={styles.mapButton}>
        <MaterialIcons name="map" size={20} color={colors.primary} />
        <Text style={styles.mapButtonText}>Open Map</Text>
      </TouchableOpacity>

      {/* Favourites Section */}
      <Text style={styles.sectionTitle}>Favourites</Text>
      <FlatList
        data={favouriteStations}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item._id}
            onPress={() => setSelectedStation(item)}
          >
            <View style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.station_name}</Text>
              <Text style={styles.cardSubtitle}>{item.address}</Text>
              <Text style={styles.cardSubtitle}>{item.city}</Text>
            </View>
            <MaterialIcons name="bookmark" size={20} color={colors.primary} />
          </View>
          </TouchableOpacity>
        )}
      />

      {/* Select Button */}
      <TouchableOpacity 
        style={[styles.selectBtn, !selectedStation && styles.disabledButton]}
        onPress={handleSelect}
        disabled={!selectedStation}
      >  
        <Text style={[styles.selectText, !selectedStation && styles.disabledButtonText]}>
          Select
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectCharger;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  searchRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 14,
    paddingVertical: 12,
    color: colors.mainTextColor,
  },
  searchIcon: {
    marginLeft: 8,
  },
  mapButton: {
    flexDirection: 'row',
    backgroundColor: '#e6faf7',
    margin: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  mapButtonText: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
  },
  sectionTitle: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 14,
    color: colors.mainTextColor,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 14,
    color: colors.mainTextColor,
  },
  cardSubtitle: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 12,
    color: colors.secondaryText,
  },
  disabledButton: {
    backgroundColor: colors.lightestGray,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    borderRadius: 8,
  },
  disabledButtonText: {
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 15,
  },
  selectBtn: {
    backgroundColor: colors.primary,
    margin: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectText: {
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.white,
  },
});