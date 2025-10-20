import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import colors from '../../../constants/color.js';
import fonts from '../../../constants/fonts.js';

const CancelledBookingDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const booking = params.booking ? JSON.parse(params.booking) : null;

  const {
    _id: bookingId,
    charging_station_id,
    dateLabel: bookingDateLabel,
    duration: bookingDuration,
    startTime,
    endTime,
    connector,
    vehicle,
    charger,
    no_of_slots,
    booking_fee = 100,
    refundInfo = {},
    cancellationReason = 'Cancelled by user',
    cancelledAt = 'Unknown Time'
  } = booking || {};

  const stationName = charging_station_id?.station_name ?? 'Unknown Station';
  const address = charging_station_id?.address ?? 'Unknown Address';
  const dateLabel = bookingDateLabel ?? 'Unknown Date';
  const duration = bookingDuration ?? 'Unknown Duration';
  const timeRange = startTime && endTime ? `${startTime} - ${endTime}` : 'Unknown Time';
  const chargerPowerType = charger?.power_type ?? 'Unknown Charger Type';
  const connectorType = connector?.type_name ?? 'Unknown Connector';
  const carName = vehicle ? `${vehicle.make.make} ${vehicle.model.model}` : 'Unknown Vehicle';
  const carImage = vehicle?.image ?? null;

  const handleAddReport = () => {
    router.push({
      pathname: '/pages/bookings/ReportIssue',
      params: { bookingId: bookingId }
    });
  };

  const handleBookAgain = () => {
    router.push('/pages/bookings/AddBooking');
  };

  const handleBackToBookings = () => {
    router.back();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        padding: 20,
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 30,
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToBookings}>
          <Icon name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cancelled Booking Details</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      {/* Cancellation Status Banner */}
      <View style={styles.cancellationBanner}>
        <Icon name="close-circle" size={24} color={colors.white} />
        <Text style={styles.cancellationBannerText}>Booking Cancelled</Text>
      </View>

      {/* Station Info */}
      <View style={styles.stationBox}>
        <Image source={{ uri: 'https://i.ibb.co/SKQ5ZBk/station.png' }} style={styles.stationImage} />
        <View style={styles.stationText}>
          <Text style={styles.stationName}>{stationName}</Text>
          <Text style={styles.stationLocation}>{address}</Text>
        </View>
      </View>

      {/* Date & Time */}
      <View style={styles.dateTimeBox}>
        <Text style={styles.dateText}>{dateLabel}</Text>
        <View style={styles.timeTag}>
          <Text style={styles.timeTagText}>{duration}</Text>
        </View>
        <Text style={styles.timeRange}>{timeRange}</Text>
      </View>

      {/* Refund Information */}
      {refundInfo.amount > 0 ? (
        <View style={styles.refundCard}>
          <View style={styles.refundHeader}>
            <Icon name="arrow-back" size={20} color={colors.success} />
            <Text style={styles.refundTitle}>Refund Processed</Text>
          </View>
          <View style={styles.refundAmountSection}>
            <Text style={styles.refundAmount}>LKR {refundInfo.amount}</Text>
            <Text style={styles.refundPercentage}>({refundInfo.percentage}% of LKR {booking_fee})</Text>
          </View>
          <Text style={styles.refundMessage}>{refundInfo.message}</Text>
          <Text style={styles.refundNote}>
            The refund has been credited back to your wallet.
          </Text>
        </View>
      ) : (
        <View style={styles.noRefundCard}>
          <View style={styles.noRefundContent}>
            <Icon name="information-circle" size={20} color={colors.warning} />
            <Text style={styles.noRefundText}>No refund was processed for this cancellation</Text>
          </View>
        </View>
      )}

      {/* Cancellation Details */}
      <View style={styles.cancellationDetails}>
        <Text style={styles.sectionTitle}>Cancellation Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Cancelled On:</Text>
          <Text style={styles.detailValue}>{cancelledAt}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Reason:</Text>
          <Text style={styles.detailValue}>{cancellationReason}</Text>
        </View>
      </View>

      {/* Booking Summary */}
      <View style={styles.bookingSummary}>
        <Text style={styles.sectionTitle}>Booking Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Vehicle:</Text>
          <Text style={styles.summaryValue}>{carName}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Connector Type:</Text>
          <Text style={styles.summaryValue}>{connectorType}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Charger Type:</Text>
          <Text style={styles.summaryValue}>{chargerPowerType}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Original Booking Fee:</Text>
          <Text style={styles.summaryValue}>LKR {booking_fee}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity 
        style={styles.rebookButton} 
        onPress={handleBookAgain}
      >
        <View style={styles.rebookButtonContent}>
          <Icon name="refresh" size={20} color={colors.white} />
          <Text style={styles.rebookButtonText}>Book Again at This Station</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.reportButton}
        onPress={handleAddReport}
      >
        <View style={styles.reportButtonContent}>
          <Icon name="alert-circle" size={20} color={colors.secondary} />
          <Text style={styles.reportButtonText}>Add Booking Report</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleBackToBookings}
      >
        <Text style={styles.backButtonText}>Back to Bookings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: { 
    fontSize: 20, 
    fontFamily: fonts.PlusJakartaSansBold 
  },
  cancellationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  cancellationBannerText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    marginLeft: 10,
  },
  stationBox: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stationImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 8 
  },
  stationText: { 
    flex: 1, 
    marginLeft: 10 
  },
  stationName: { 
    fontSize: 16, 
    fontFamily: fonts.PlusJakartaSansBold 
  },
  stationLocation: { 
    color: colors.lightGray, 
    fontSize: 12, 
    fontFamily: fonts.PlusJakartaSans 
  },
  dateTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    gap: 8,
  },
  dateText: { 
    fontSize: 14, 
    fontFamily: fonts.PlusJakartaSansMedium 
  },
  timeTag: {
    backgroundColor: colors.tagBackground,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
  },
  timeTagText: {
    color: colors.tagText,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  timeRange: {
    fontSize: 14,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
  refundCard: {
    backgroundColor: colors.lightSuccess,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  refundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  refundTitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.success,
    marginLeft: 8,
  },
  refundAmountSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  refundAmount: {
    fontSize: 24,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.success,
    marginRight: 8,
  },
  refundPercentage: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  refundMessage: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.success,
    marginBottom: 5,
  },
  refundNote: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    fontStyle: 'italic',
  },
  noRefundCard: {
    backgroundColor: colors.lightWarning,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  noRefundContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noRefundText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.warning,
    marginLeft: 8,
    flex: 1,
  },
  cancellationDetails: {
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    marginBottom: 10,
    color: colors.mainTextColor,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.secondaryText,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    flex: 2,
    textAlign: 'right',
  },
  bookingSummary: {
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  rebookButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  rebookButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rebookButtonText: {
    color: colors.white,
    fontFamily: fonts.PlusJakartaSansBold,
    marginLeft: 8,
  },
  reportButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.secondary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  reportButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportButtonText: {
    color: colors.secondary,
    fontFamily: fonts.PlusJakartaSansBold,
    marginLeft: 8,
  },
  backButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  backButtonText: {
    color: colors.primary,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
});

export default CancelledBookingDetailsScreen;