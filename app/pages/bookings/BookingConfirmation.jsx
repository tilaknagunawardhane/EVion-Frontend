import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import { useNavigation } from "@react-navigation/native";
import { useRouter, useLocalSearchParams } from 'expo-router';


const BookingConfirmationModal = ({ visible, onClose, onConfirm }) => {
    const navigation = useNavigation();
      const router = useRouter();
    
  
  // Sample data - replace with your actual data
  const bookingDetails = {
    station: {
      name: "Genso Charging Station",
      address: "Southern Highway, Welipenna, Matugama"
    },
    energy: "75kWh",
    cost: "LKR 4125",
    dateTime: "22 Thursday, June\n05:00 - 06:00 AM"
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Booking Details */}
          <Text style={styles.sectionTitle}>Confirm Booking</Text>

          <View style={styles.detailsRow}>
            {/* Energy Delivered */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Estimated Energy Delivered:</Text>
              <Text style={styles.energyValue}>{bookingDetails.energy}</Text>
            </View>

            {/* Battery Increase */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Estimated Battery % Increase:</Text>
              <Text style={styles.energyValue}>+40%</Text>
            </View>

            {/* Cost */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Estimated Cost:</Text>
              <Text style={styles.costValue}>{bookingDetails.cost}</Text>
            </View>
          </View>
          
          {/* Note */}
          <Text style={styles.note}>
            Note: A 3% service fee will be added to your charging cost as a booking fee.
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.secondaryButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(tabs)/bookings')}>
              <Text style={styles.primaryButtonText}>Confirm Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10, // Add some padding to prevent edge touching
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%', // Slightly increased width
    maxWidth: 400,
  },
  sectionTitle: {
    fontSize: 20, // Slightly reduced size
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 16,
    textAlign: 'center',
  },
  detailsRow: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap', // Allow wrapping if needed
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    flexShrink: 1, // Allow text to shrink
    marginRight: 8, // Add some spacing
  },
  energyValue: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.primary,
    flexShrink: 0, // Prevent value from shrinking
  },
  costValue: {
    fontSize: 16, // Slightly reduced size
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  note: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.HighlightText,
    fontStyle: 'italic',
    marginBottom: 20,
    lineHeight: 16, // Add line height for better readability
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    minWidth: '48%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#EEEEEE',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    minWidth: '48%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 14,
  },
});

export default BookingConfirmationModal;