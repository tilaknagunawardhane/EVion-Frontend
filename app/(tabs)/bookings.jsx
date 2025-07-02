import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import BookingCard from '../../components/BookingCard';
import CompletedBookingCard from '../../components/CompletedBookingCard';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import { useRouter } from 'expo-router';

const BookingsScreen = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const router = useRouter();

  const bookingsData = {
    Upcoming: [
      {
        dateLabel: 'Jun 12, 2025',
        duration: '1 Hr 30 Mins',
        time: '9:30 AM',
        stationName: 'Genso Charging Station',
        address: 'Southern Highway, Welipenna, Matugama',
        carImage: require('../../assets/vehicles/atto3.png'),
        carName: 'BYD Atto 3 (SUV)',
        connectorType: 'CCS Combo Type 2',
      },
      {
        dateLabel: 'Jun 11, 2025',
        duration: '1 Hr 30 Mins',
        time: '11:30 PM',
        stationName: 'Fonseka Charging Station',
        address: 'No: 2/82, Maha Payagala, Payagala',
        carImage: require('../../assets/vehicles/dolphin.png'),
        carName: 'BYD Dolphin (Hatchback)',
        connectorType: 'Type 2 (Mennekes)',
      },
      {
        dateLabel: 'Jun 14, 2025',
        duration: '2 Hr 30 Mins',
        time: '11:30 PM',
        stationName: 'Chargenet Charging Station',
        address: 'No: 2/82, Maha Payagala, Payagala',
        carImage: require('../../assets/vehicles/atto3.png'),
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
        carImage: require('../../assets/vehicles/dolphin.png'),
        carName: 'Hyundai Kona',
        connectorType: 'CCS Combo Type 2',
      },
      {
        dateLabel: 'Jun 10, 2025',
        cost: '2,500.00',
        stationName: 'Eco Charge Point',
        address: '123 Green Road, Colombo',
        carImage: require('../../assets/vehicles/atto3.png'),
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
        carImage: require('../../assets/vehicles/dolphin.png'),
        carName: 'BYD Dolphin (Hatchback)',
        connectorType: 'Type 2 (Mennekes)',
      },
    ],
  };

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
          <TouchableOpacity
            key={index}
            onPress={() =>
              router.push({
                pathname: '/pages/bookings/CompletedBookingDetails',
                params: booking,
              })
            }
          >
            <CompletedBookingCard {...booking} />
          </TouchableOpacity>
        );
      }
      // For Upcoming and Cancelled, use pathname as well
      return (
        <TouchableOpacity
          key={index}
          onPress={() =>
            router.push({
              pathname: '/pages/bookings/BookingDetails',
              params: booking,
            })
          }
        >
          <BookingCard {...booking} />
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
      <Text style={styles.title}>My Bookings</Text>
      <TouchableOpacity
        style={styles.bookingButton}
        onPress={() => router.push('/pages/bookings/AddBooking')}
      >
        <Text style={styles.addBookingText}>Add Booking</Text>
      </TouchableOpacity>
    </View>


      {/* Tabs */}
      <View style={styles.tabs}>
        {['Upcoming', 'Completed', 'Cancelled'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderBookings()}
      </ScrollView>
    </View>
  );
};

export default BookingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },
  headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginHorizontal: 16,
  marginBottom: 10,
},
  title: {
    fontSize: 24,
    fontFamily: fonts.PlusJakartaSansMedium,
    marginHorizontal: 16,
    marginBottom: 10,
    color: colors.mainTextColor,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: colors.stroke,
    paddingBottom: 8,
    marginHorizontal: 16,
  },
  tab: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeTab: {
    color: colors.primary,
    fontFamily: fonts.PlusJakartaSansMedium,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  noBookingsText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: 20,
  },
  bookingButton: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 10,
    width: '40%',
    alignItems: 'center',
    marginBottom: 10,
  },
  addBookingText: {
  color: '#fff',
  fontFamily: fonts.PlusJakartaSansMedium,
},

});
