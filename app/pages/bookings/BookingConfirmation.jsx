import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';

const BookingConfirmationModal = ({ visible, onClose, onConfirm }) => {
  // Sample data - replace with your actual data
  const bookingDetails = {
    station: {
      name: "Genso Charging Station",
      address: "Southern Highway, Welipenna, Matugama"
    },
    energy: "75kWh +40%",
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
            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={onConfirm}>
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
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  header: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 12,
  },
  detailsContainer: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  energyValue: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.primary,
  },
  costValue: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  note: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.HighlightText,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
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
    detailsRow: {
      marginBottom: 16,
    },
    detailItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    detailLabel: {
      fontSize: 14,
      fontFamily: fonts.PlusJakartaSans,
      color: colors.secondaryText,
    },
    energyValue: {
      fontSize: 16,
      fontFamily: fonts.PlusJakartaSansBold,
      color: colors.primary,
    },
    costValue: {
      fontSize: 18,
      fontFamily: fonts.PlusJakartaSansBold,
      color: colors.mainTextColor,
    },
});

export default BookingConfirmationModal;