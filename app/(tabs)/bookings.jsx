import React, { useState, useEffect } from 'react';
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
import { API_BASE_URL } from '@env';
import { useRouter , useLocalSearchParams} from 'expo-router';
import useUserData from '../../hooks/useUserData';

const BookingsScreen = () => {
  const { user } = useUserData();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const router = useRouter();
    const params = useLocalSearchParams();
  

  const [bookingsData, setBookingsData] = useState({
    Upcoming: [],
    Completed: [],
    Cancelled: [],
  });

  console.log('API_BASE_URL:', API_BASE_URL);

  useEffect(() => {
    if (!user) {
      console.log('No user detected');
      return; // do nothing until user is loaded
    }

  const fetchBookings = async () => {
    try {
      const endpointMap = {
        Upcoming: 'getUserUpcomingBookings',
        Completed: 'getUserCompletedBookings',
        Cancelled: 'getUserCancelledBookings',
      };
      const endpoint = endpointMap[activeTab];
      const url = `${API_BASE_URL}/api/bookings/${endpoint}?ev_user_id=${user._id}`;
      console.log('Fetching from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // console.log('Response status:', response.status);
      // console.log('Response headers:', response.headers);

      // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error(`Server returned non-JSON response (status: ${response.status})`);
    }
      const data = await response.json();
      // console.log('API Response:', data);

      if (response.ok) {
        setBookingsData((prev) => ({
          ...prev,
          [activeTab]: data || [],
        }));
      } else {
        console.error('Error:', data.message || 'No message provided');
      }
    } catch (error) {
      console.error('Fetch error:', error.message);
      console.error('Error stack:', error.stack);
    }

    console.log('bookingsData: ', bookingsData);
  };

    fetchBookings();
    // console.log('user: ', user);
  }, [activeTab, user]);


  const renderBookings = () => {
    const bookings = bookingsData[activeTab];
    if (bookings.length === 0) {
      return (
        <Text style={styles.noBookingsText}>
          No {activeTab.toLowerCase()} bookings available.
        </Text>
      );
    }

     if (!Array.isArray(bookings)) {
    return (
      <Text style={styles.noBookingsText}>
        Loading {activeTab.toLowerCase()} bookings...
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
              params: { booking : JSON.stringify(booking) },
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
