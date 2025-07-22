import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';

const TripHistory = () => {
  const handleBackPress = () => {
    router.back();
  };

  const tripData = [
    {
      id: '1',
      from: 'Colombo',
      to: 'Kandy',
      date: '2024-07-15',
      startTime: '8:00 AM',
      endTime: '11:30 AM',
      distance: '115 km',
      duration: '3h 30m',
      vehicle: 'BYD ATTO 3',
      energyUsed: '28.5 kWh',
      avgSpeed: '65 km/h',
      status: 'Completed',
    },
    {
      id: '2',
      from: 'Kandy',
      to: 'Nuwara Eliya',
      date: '2024-07-12',
      startTime: '2:00 PM',
      endTime: '4:15 PM',
      distance: '75 km',
      duration: '2h 15m',
      vehicle: 'BYD ATTO 3',
      energyUsed: '22.1 kWh',
      avgSpeed: '45 km/h',
      status: 'Completed',
    },
    {
      id: '3',
      from: 'Colombo',
      to: 'Galle',
      date: '2024-07-08',
      startTime: '9:30 AM',
      endTime: '12:00 PM',
      distance: '120 km',
      duration: '2h 30m',
      vehicle: 'BYD ATTO 3',
      energyUsed: '31.2 kWh',
      avgSpeed: '72 km/h',
      status: 'Completed',
    },
    {
      id: '4',
      from: 'Negombo',
      to: 'Colombo',
      date: '2024-07-05',
      startTime: '6:00 PM',
      endTime: '7:15 PM',
      distance: '38 km',
      duration: '1h 15m',
      vehicle: 'BYD ATTO 3',
      energyUsed: '15.8 kWh',
      avgSpeed: '48 km/h',
      status: 'Completed',
    },
  ];

  const renderTripItem = ({ item }) => (
    <View style={styles.tripCard}>
      <View style={styles.tripHeader}>
        <View style={styles.routeContainer}>
          <View style={styles.routePoint}>
            <View style={styles.fromDot} />
            <Text style={styles.locationText}>{item.from}</Text>
          </View>
          <View style={styles.routeLine} />
          <Ionicons name="arrow-forward" size={16} color={colors.primary} style={styles.arrowIcon} />
          <View style={styles.routeLine} />
          <View style={styles.routePoint}>
            <View style={styles.toDot} />
            <Text style={styles.locationText}>{item.to}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${colors.success}15` }]}>
          <Text style={[styles.statusText, { color: colors.success }]}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.tripDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.secondaryText} />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={colors.secondaryText} />
          <Text style={styles.detailText}>{item.startTime} - {item.endTime}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="car-outline" size={16} color={colors.secondaryText} />
          <Text style={styles.detailText}>{item.vehicle}</Text>
        </View>
      </View>

      <View style={styles.tripMetrics}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{item.distance}</Text>
          <Text style={styles.metricLabel}>Distance</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{item.duration}</Text>
          <Text style={styles.metricLabel}>Duration</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{item.energyUsed}</Text>
          <Text style={styles.metricLabel}>Energy Used</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{item.avgSpeed}</Text>
          <Text style={styles.metricLabel}>Avg Speed</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip History</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={tripData}
        renderItem={renderTripItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

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
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  listContainer: {
    padding: 16,
  },
  tripCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.stroke,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fromDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  toDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  locationText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  routeLine: {
    height: 1,
    backgroundColor: colors.stroke,
    flex: 1,
    marginHorizontal: 8,
  },
  arrowIcon: {
    marginHorizontal: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  tripDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginLeft: 8,
  },
  tripMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.stroke,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.primary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    textAlign: 'center',
  },
});

export default TripHistory;
