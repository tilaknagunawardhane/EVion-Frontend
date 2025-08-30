import React, { useState } from 'react';
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

const SessionHistory = () => {
  const handleBackPress = () => {
    router.back();
  };

  const sessionData = [
    {
      id: '1',
      stationName: 'EVion Station - Colombo 03',
      stationAddress: 'Galle Road, Bambalapitiya',
      date: '2024-08-15',
      time: '2:30 PM - 3:45 PM',
      duration: '1h 15m',
      energy: '45.2 kWh',
      cost: 'Rs. 2,260',
      status: 'Completed',
      batteryStart: 25,
      batteryEnd: 85,
      chargingSpeed: 'Fast Charging',
      connector: 'CCS2',
      vehicle: 'Tesla Model 3',
    },
    {
      id: '2',
      stationName: 'EVion Station - Kandy',
      stationAddress: 'Peradeniya Road, Kandy',
      date: '2024-08-12',
      time: '10:15 AM - 11:30 AM',
      duration: '1h 15m',
      energy: '38.7 kWh',
      cost: 'Rs. 1,935',
      status: 'Completed',
      batteryStart: 30,
      batteryEnd: 80,
      chargingSpeed: 'Fast Charging',
      connector: 'CCS2',
      vehicle: 'Tesla Model 3',
    },
    {
      id: '3',
      stationName: 'EVion Station - Galle',
      stationAddress: 'Matara Road, Galle',
      date: '2024-08-08',
      time: '4:00 PM - 5:30 PM',
      duration: '1h 30m',
      energy: '52.1 kWh',
      cost: 'Rs. 2,605',
      status: 'Completed',
      batteryStart: 15,
      batteryEnd: 90,
      chargingSpeed: 'Super Fast Charging',
      connector: 'CCS2',
      vehicle: 'Tesla Model 3',
    },
  ];

  const renderSessionCard = ({ item }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <View style={styles.stationInfo}>
          <Text style={styles.stationName}>{item.stationName}</Text>
          <Text style={styles.stationAddress}>{item.stationAddress}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.sessionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>📅 {item.date}</Text>
          <Text style={styles.detailText}>⏰ {item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>🚗 {item.vehicle}</Text>
          <Text style={styles.detailText}>⚡ {item.connector}</Text>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{item.duration}</Text>
          <Text style={styles.metricLabel}>Duration</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{item.energy}</Text>
          <Text style={styles.metricLabel}>Energy</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{item.cost}</Text>
          <Text style={styles.metricLabel}>Cost</Text>
        </View>
      </View>

      <View style={styles.batteryContainer}>
        <Text style={styles.batteryLabel}>Battery: {item.batteryStart}% → {item.batteryEnd}%</Text>
        <Text style={styles.chargingSpeedText}>{item.chargingSpeed}</Text>
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
        <Text style={styles.headerTitle}>Session History</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Session List */}
      <FlatList
        data={sessionData}
        renderItem={renderSessionCard}
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
  sessionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stationInfo: {
    flex: 1,
    marginRight: 12,
  },
  stationName: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.success + '15',
  },
  statusText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.success,
  },
  sessionDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    flex: 1,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.primary + '08',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.primary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 10,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  batteryContainer: {
    backgroundColor: colors.secondary + '08',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  batteryLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  chargingSpeedText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
});

export default SessionHistory;

