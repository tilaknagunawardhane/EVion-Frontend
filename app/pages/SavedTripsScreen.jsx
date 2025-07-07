import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import AppBar from '../../components/AppBar';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';

import SavedTripCard from '../../components/SavedTripCard';
import CompletedTripCard from '../../components/CompletedTripCard';

const SavedTripsScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Saved');

  const savedTrips = [
    {
      id: 1,
      from: 'Home 23, Park Lane, Nugegoda',
      to: 'Mathara',
      image: require('../../assets/kona.png'),
      vehicle: 'Hyundai Kona Electric (SUV)',
      passengers: 3,
      battery: '80%',
    },
    {
      id: 2,
      from: 'Home 23, Park Lane, Nugegoda',
      to: 'Kandy',
      vehicle: 'BYD Atto 3 (SUV)',
      passengers: 3,
      battery: '20%',
    },
    {
      id: 3,
      from: 'Home 23, Park Lane, Nugegoda',
      to: 'Nuwara Eliya',
      vehicle: 'BYD Atto 3 (SUV)',
      passengers: 3,
      battery: '70%',
    },
  ];

  const completedTrips = [
    {
      id: 1,
      date: 'Jun 05, 2025',
      from: 'Home 23, Park Lane, Nugegoda',
      stops: [
        {
          name: 'Fonseka Charging Station',
          address: 'Southern Highway, Welipenna, Matugama',
        },
      ],
      to: 'Mathara',
      image: require('../../assets/kona.png'),
      vehicle: 'Hyundai Kona Electric (SUV)',
      passengers: 3,
      stopsCount: 1,
    },
    {
      id: 2,
      date: 'Jun 05, 2025',
      from: 'Home 23, Park Lane, Nugegoda',
      stops: [
        {
          name: 'EV Charging Station',
          address: 'NO.110, Highlevel Road, Kottawa',
        },
        {
          name: 'Genso Charging Station',
          address: 'Kadugannawa',
        },
      ],
      to: 'Kandy',
      vehicle: 'BYD Atto 3 (SUV)',
      passengers: 3,
      stopsCount: 2,
    },
  ];

  return (
    <View style={styles.container}>
      <AppBar title="My Route Plans" />

      <View style={styles.tabRow}>
        <TouchableOpacity onPress={() => setSelectedTab('Saved')}>
          <Text style={[styles.tabText, selectedTab === 'Saved' && styles.tabTextActive]}>
            Saved
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('Completed')}>
          <Text style={[styles.tabText, selectedTab === 'Completed' && styles.tabTextActive]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {selectedTab === 'Saved'
          ? savedTrips.map(trip => <SavedTripCard key={trip.id} trip={trip} />)
          : completedTrips.map(trip => <CompletedTripCard key={trip.id} trip={trip} />)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.stroke,
  },
  tabText: {
    fontSize: 16,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  tabTextActive: {
    color: colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  scrollView: {
    padding: 16,
  },
});

export default SavedTripsScreen;
