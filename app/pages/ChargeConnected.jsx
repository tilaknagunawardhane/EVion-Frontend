import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import InputField from '../../components/InputField';


const ChargeConnectedScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/pages/WaitingConnection')}>
          <Ionicons name="chevron-back" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Set!</Text>
        <View style={{ width: 24 }} /> {/* For spacing balance */}
      </View>

      {/* Subtitle */}
      <Text style={styles.subText}>Vehicle successfully linked{'\n'}to the charger</Text>

      {/* Main content area with centered EV Image */}
      <View style={styles.mainContent}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/EVconnectedcharge.png')} // Use the connected charging image
            style={styles.evImage}
          />
        </View>
      </View>

      {/* Connected Status at bottom */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Connected</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },
  header: {
    width: '100%',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  subText: {
    fontSize: 14,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 24,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#E9F7F4', // Light green background circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  evImage: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  statusContainer: {
    alignItems: 'center',
    paddingBottom: 80,
  },
  statusText: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
});

export default ChargeConnectedScreen;
