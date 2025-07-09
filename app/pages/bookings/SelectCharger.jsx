import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';

const sampleStations = [
  {
    id: '1',
    name: 'Genso Charging Station',
    address: 'Southern Highway, Welipenna, Matugama',
    image: require('../../../assets/chargingStations/genso1.png'),
  },
  {
    id: '2',
    name: 'Electric Vehicle Charging Station',
    address: 'Wellawaya Rd, Wadduwa',
    image: require('../../../assets/chargingStations/genso1.png'),
  },
];

const SelectCharger = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);

  return (
    <View style={styles.container}>
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="chevron-back" size={24} color={colors.black} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Charging Stations</Text>

        <TouchableOpacity>
          <Icon name="ellipsis-vertical" size={20} color={colors.black} />
        </TouchableOpacity>
      </View>

      {/* ---------- Search ---------- */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search a station"
          placeholderTextColor={colors.secondaryText}
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
        <Icon
          name="search-outline"
          size={20}
          color={colors.lightGray}
          style={styles.searchIcon}
        />
      </View>

      {/* ---------- Open Map ---------- */}
      <TouchableOpacity style={styles.mapButton}>
        <MaterialIcons name="map" size={20} color={colors.primary} />
        <Text style={styles.mapButtonText}>Open Map</Text>
      </TouchableOpacity>

      {/* ---------- Favourites ---------- */}
      <Text style={styles.sectionTitle}>Favourites</Text>

      <FlatList
        data={sampleStations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => {
          const isSelected = selectedStation?.id === item.id;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedStation(item)}
              style={[
                styles.card,
                isSelected && { borderColor: colors.primary, borderWidth: 1.5 },
              ]}
            >
              <Image source={item.image} style={styles.cardImage} />

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.address}</Text>
              </View>

              <MaterialIcons name="bookmark" size={20} color={colors.primary} />
            </TouchableOpacity>
          );
        }}
      />

      {/* ---------- Select Button ---------- */}
      <TouchableOpacity
        style={[
          styles.disabledButton,
          selectedStation && { backgroundColor: colors.primary },
        ]}
        disabled={!selectedStation}
        onPress={() => {
          if (selectedStation) {
            router.push({
              pathname: '/pages/bookings/AddBooking',
              params: {
                selectedStation: JSON.stringify(selectedStation),
              },
            });
          }
        }}
      >
        <Text
          style={[
            styles.disabledButtonText,
            selectedStation && { color: colors.white },
          ]}
        >
          Select
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectCharger;

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* ----- Header ----- */
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

  /* ----- Search ----- */
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
  searchIcon: { marginLeft: 8 },

  /* ----- Map Button ----- */
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

  /* ----- Section Title ----- */
  sectionTitle: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 14,
    color: colors.mainTextColor,
    marginHorizontal: 16,
    marginBottom: 10,
  },

  /* ----- Card ----- */
  card: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
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
  cardContent: { flex: 1 },
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

  /* ----- Select Button ----- */
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
});
