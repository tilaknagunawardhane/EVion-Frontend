import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
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
      date: '2024-07-15',
      time: '2:30 PM - 3:45 PM',
      duration: '1h 15m',
      energy: '45.2 kWh',
      cost: 'Rs. 2,260',
      status: 'Completed',
      batteryStart: '25%',
      batteryEnd: '85%',
    },
    {
      id: '2',
      stationName: 'EVion Station - Kandy',
      date: '2024-07-12',
      time: '10:15 AM - 11:30 AM',
      duration: '1h 15m',
      energy: '38.7 kWh',
      cost: 'Rs. 1,935',
      status: 'Completed',
      batteryStart: '30%',
      batteryEnd: '80%',
    },
    {
      id: '3',
      stationName: 'EVion Station - Galle',
      date: '2024-07-08',
      time: '4:00 PM - 5:30 PM',
      duration: '1h 30m',
      energy: '52.1 kWh',
      cost: 'Rs. 2,605',
      status: 'Completed',
      batteryStart: '15%',
      batteryEnd: '90%',
    },
    {
      id: '4',
      stationName: 'EVion Station - Negombo',
      date: '2024-07-05',
      time: '8:30 AM - 9:45 AM',
      duration: '1h 15m',
      energy: '41.3 kWh',
      cost: 'Rs. 2,065',
      status: 'Completed',
      batteryStart: '20%',
      batteryEnd: '75%',
    },
  ];

  const renderSessionItem = ({ item }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <Text style={styles.stationName}>{item.stationName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${colors.success}15` }]}>
          <Text style={[styles.statusText, { color: colors.success }]}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.sessionDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.secondaryText} />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={colors.secondaryText} />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="timer-outline" size={16} color={colors.secondaryText} />
          <Text style={styles.detailText}>Duration: {item.duration}</Text>
        </View>
      </View>

      <View style={styles.sessionMetrics}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{item.energy}</Text>
          <Text style={styles.metricLabel}>Energy Used</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{item.cost}</Text>
          <Text style={styles.metricLabel}>Total Cost</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{item.batteryStart} → {item.batteryEnd}</Text>
          <Text style={styles.metricLabel}>Battery Level</Text>
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
        <Text style={styles.headerTitle}>Session History</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={sessionData}
        renderItem={renderSessionItem}
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
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stationName: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    flex: 1,
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
  sessionDetails: {
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
  sessionMetrics: {
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

export default SessionHistory;