import React, { useState } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import BookingCard from '../../../components/BookingCard';
import CompletedBookingCard from '../../../components/CompletedBookingCard'; // Adjust the import path

const BookingsScreen = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');

  // Sample data for each tab (replace with your actual data source)
  const bookingsData = {
    Upcoming: [
      {
        dateLabel: 'Jun 12, 2025', // Updated to current date
        duration: '1 Hr 30 Mins',
        time: '9:30 AM',
        stationName: 'Genso Charging Station',
        address: 'Southern Highway, Welipenna, Matugama',
        carImage: require('../../../assets/vehicles/atto3.png'),
        carName: 'BYD Atto 3 (SUV)',
        connectorType: 'CCS Combo Type 2',
      },
      {
        dateLabel: 'Jun 11, 2025',
        duration: '1 Hr 30 Mins',
        time: '11:30 PM',
        stationName: 'Fonseka Charging Station',
        address: 'No: 2/82, Maha Payagala, Payagala',
        carImage: require('../../../assets/vehicles/dolphin.png'),
        carName: 'BYD ADolphin (Hatchback)',
        connectorType: 'Type 2 (Mennekes)',
      },
      {
        dateLabel: 'Jun 14, 2025',
        duration: '2 Hr 30 Mins',
        time: '11:30 PM',
        stationName: 'Chargenet Charging Station',
        address: 'No: 2/82, Maha Payagala, Payagala',
        carImage: require('../../../assets/vehicles/atto3.png'),
        carName: 'BYD Atto3 (Hatchback)',
        connectorType: 'Type 2 (Mennekes)',
      },
    ],
    Completed: [
      {
        dateLabel: 'Jun 05, 2025',
        cost: '3,804.35',
        stationName: 'Genso Charging Station',
        address: 'Southern Highway, Welipenna, Matugama',
        carImage: require('../../../assets/vehicles/dolphin.png'), // Hyundai Kona image
        carName: 'Hyundai Kona',
        connectorType: 'CCS Combo Type 2',
      },
      {
        dateLabel: 'Jun 10, 2025',
        cost: '2,500.00',
        stationName: 'Eco Charge Point',
        address: '123 Green Road, Colombo',
        carImage: require('../../../assets/vehicles/atto3.png'),
        carName: 'BYD Atto 3 (SUV)',
        connectorType: 'CCS Combo Type 2',
      },
    ],
    Cancelled: [
      {
        dateLabel: 'Jun 9, 2025',
        duration: '1 Hr',
        time: '10:00 AM',
        stationName: 'City Charge Hub',
        address: '456 Urban Street, Negombo',
        carImage: require('../../../assets/vehicles/dolphin.png'),
        carName: 'BYD ADolphin (Hatchback)',
        connectorType: 'Type 2 (Mennekes)',
      },
    ],
  };

  // Render bookings based on the active tab
  const renderBookings = () => {
    const bookings = bookingsData[activeTab];
    if (bookings.length === 0) {
      return (
        <Text style={styles.noBookingsText}>
          No {activeTab.toLowerCase()} bookings available.
        </Text>
      );
    }
    return bookings.map((booking, index) => {
      if (activeTab === 'Completed') {
        return (
          <CompletedBookingCard
            key={index}
            dateLabel={booking.dateLabel}
            cost={booking.cost}
            stationName={booking.stationName}
            address={booking.address}
            carImage={booking.carImage}
            carName={booking.carName}
            connectorType={booking.connectorType}
          />
        );
      }
      return (
        <BookingCard
          key={index}
          dateLabel={booking.dateLabel}
          duration={booking.duration}
          time={booking.time}
          stationName={booking.stationName}
          address={booking.address}
          carImage={booking.carImage}
          carName={booking.carName}
          connectorType={booking.connectorType}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab('Upcoming')}>
          <Text style={[styles.tab, activeTab === 'Upcoming' && styles.activeTab]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Completed')}>
          <Text style={[styles.tab, activeTab === 'Completed' && styles.activeTab]}>
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Cancelled')}>
          <Text style={[styles.tab, activeTab === 'Cancelled' && styles.activeTab]}>
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderBookings()}
      </ScrollView>
    </View>
  );
};

export default BookingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', paddingTop: 50 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 8,
    marginHorizontal: 16,
  },
  tab: {
    fontSize: 16,
    color: '#888',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeTab: {
    color: '#00B894',
    fontWeight: '600',
    borderBottomWidth: 2,
    borderBottomColor: '#00B894',
  },
  noBookingsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});