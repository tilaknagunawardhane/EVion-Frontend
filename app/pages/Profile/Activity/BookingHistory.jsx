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

const BookingHistory = () => {
  const handleBackPress = () => {
    router.back();
  };

  const bookingData = [
    {
      id: '1',
      stationName: 'EVion Station - Colombo 03',
      bookingId: 'BK001234',
      date: '2024-07-15',
      timeSlot: '2:00 PM - 4:00 PM',
      connector: 'CCS Type 2',
      vehicle: 'BYD ATTO 3',
      status: 'Completed',
      cost: 'Rs. 2,500',
      duration: '1h 45m',
    },
    {
      id: '2',
      stationName: 'EVion Station - Kandy',
      bookingId: 'BK001235',
      date: '2024-07-18',
      timeSlot: '10:00 AM - 12:00 PM',
      connector: 'CHAdeMO',
      vehicle: 'BYD ATTO 3',
      status: 'Upcoming',
      cost: 'Rs. 2,200',
      duration: '2h 00m',
    },
    {
      id: '3',
      stationName: 'EVion Station - Galle',
      bookingId: 'BK001236',
      date: '2024-07-12',
      timeSlot: '4:00 PM - 6:00 PM',
      connector: 'Type 2',
      vehicle: 'BYD ATTO 3',
      status: 'Completed',
      cost: 'Rs. 2,800',
      duration: '1h 30m',
    },
    {
      id: '4',
      stationName: 'EVion Station - Negombo',
      bookingId: 'BK001237',
      date: '2024-07-10',
      timeSlot: '8:00 AM - 10:00 AM',
      connector: 'CCS Type 2',
      vehicle: 'BYD ATTO 3',
      status: 'Cancelled',
      cost: 'Rs. 0',
      duration: '-',
    },
    {
      id: '5',
      stationName: 'EVion Station - Matara',
      bookingId: 'BK001238',
      date: '2024-07-08',
      timeSlot: '1:00 PM - 3:00 PM',
      connector: 'Type 2',
      vehicle: 'BYD ATTO 3',
      status: 'Completed',
      cost: 'Rs. 2,350',
      duration: '1h 55m',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return colors.success;
      case 'Upcoming':
        return colors.primary;
      case 'Cancelled':
        return colors.danger;
      default:
        return colors.secondaryText;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return 'checkmark-circle';
      case 'Upcoming':
        return 'time';
      case 'Cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={styles.bookingInfo}>
          <Text style={styles.stationName}>{item.stationName}</Text>
          <Text style={styles.bookingId}>#{item.bookingId}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
          <Ionicons name={getStatusIcon(item.status)} size={12} color={getStatusColor(item.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.secondaryText} />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={colors.secondaryText} />
          <Text style={styles.detailText}>{item.timeSlot}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="flash-outline" size={16} color={colors.secondaryText} />
          <Text style={styles.detailText}>{item.connector}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="car-outline" size={16} color={colors.secondaryText} />
          <Text style={styles.detailText}>{item.vehicle}</Text>
        </View>
      </View>

      <View style={styles.bookingMetrics}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{item.cost}</Text>
          <Text style={styles.metricLabel}>Total Cost</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{item.duration}</Text>
          <Text style={styles.metricLabel}>Duration</Text>
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
        <Text style={styles.headerTitle}>Booking History</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={bookingData}
        renderItem={renderBookingItem}
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
  bookingCard: {
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
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansMedium,
    marginLeft: 4,
  },
  bookingDetails: {
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
  bookingMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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

export default BookingHistory;
