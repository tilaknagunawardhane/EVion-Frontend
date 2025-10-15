import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';

const ActivityScreen = () => {
  const handleBackPress = () => {
    router.back();
  };

  const handleSessionHistory = () => {
    console.log('Navigation to SessionHistory triggered');
    // Use absolute path for file-based routing
    router.push('/pages/Profile/Activity/SessionHistory');
    console.log('Router.push called for SessionHistory');
  };

  const handleTripHistory = () => {
    // Use absolute path for file-based routing
    router.push('/pages/Profile/Activity/TripHistory');
  };

  const handleBookingHistory = () => {
    // Use absolute path for file-based routing
    router.push('/pages/Profile/Activity/BookingHistory');
  };

  const activityOptions = [
    {
      id: 'session',
      title: 'Session History',
      subtitle: 'View your charging sessions',
      icon: 'flash',
      onPress: handleSessionHistory,
      color: colors.primary,
    },
    {
      id: 'trip',
      title: 'Trip History',
      subtitle: 'View your completed trips',
      icon: 'car',
      onPress: handleTripHistory,
      color: '#4CAF50',
    },
    {
      id: 'booking',
      title: 'Booking History',
      subtitle: 'View your booking records',
      icon: 'calendar',
      onPress: handleBookingHistory,
      color: '#FF9800',
    },
  ];

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
        <Text style={styles.headerTitle}>Activity</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          
          {/* Activity Options */}
          <View style={styles.optionsContainer}>
            {activityOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionCard}
                onPress={option.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <View style={[styles.iconContainer, { backgroundColor: `${option.color}15` }]}>
                    <Ionicons name={option.icon} size={24} color={option.color} />
                  </View>
                  
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  </View>
                  
                  <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  optionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.stroke,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
});

export default ActivityScreen;