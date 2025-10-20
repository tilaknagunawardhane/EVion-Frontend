import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const CancelledBookingCard = (props) => {
  console.log('CancelledBookingCard props:', props); // Debug log

  // Extract data with proper fallbacks
  const {
    // Station info
    charging_station_id = {},
    
    // Date and time
    dateLabel = 'Unknown Date',
    startTime = 'Unknown Time',
    endTime = 'Unknown Time',
    duration = 'Unknown Duration',
    
    // Vehicle and connector
    vehicle = {},
    connector = {},
    
    // Cancellation details
    cancelledAt = 'Unknown Time',
    refundInfo = {},
    cancellationReason = 'Cancelled by user',
    booking_fee = 100
  } = props;

  // Safely extract nested properties
  const stationName = charging_station_id?.station_name || 'Unknown Station';
  const address = charging_station_id?.address || 'Unknown Address';
  const connectorType = connector?.type_name || 'Unknown Connector';
  const currentType = connector?.current_type || '';
  
  // Extract vehicle info safely
  const carMake = vehicle?.make_info?.make || vehicle?.make?.make || 'Unknown';
  const carModel = vehicle?.model_info?.model || vehicle?.model?.model || 'Unknown';
  const carName = `${carMake} ${carModel}`;
  const carImage = vehicle?.image || null;

  // Extract refund info
  const refundAmount = refundInfo?.amount || 0;
  const refundPercentage = refundInfo?.percentage || 0;

  return (
    <View style={styles.card}>
      {/* Cancelled Badge */}
      {/* <View style={styles.cancelledBadge}>
        <MaterialIcons name="cancel" size={16} color={colors.white} />
        <Text style={styles.cancelledText}>Cancelled</Text>
      </View> */}

      {/* Top Row - Date, Duration, Time */}
      <View style={styles.topRow}>
        <Text style={styles.dateText}>{dateLabel}</Text>
        <View style={styles.duration}>
          <Text style={styles.durationText}>{duration}</Text>
        </View>
        <Text style={styles.timeText}>{startTime}-{endTime}</Text>
      </View>

      <View style={styles.separator} />

      {/* Middle Row - Station Info */}
      <View style={styles.middleRow}>
        <View style={styles.stationContainer}>
          <Text style={styles.stationName}>{stationName}</Text>
          <Text style={styles.address}>{address}</Text>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="navigation" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      {/* Bottom Row - Vehicle and Connector */}
      <View style={styles.bottomRow}>
        <View style={styles.carContainer}>
          <Image 
            source={carImage ? { uri: carImage } : require('../assets/car.png')} 
            style={styles.carImage} 
          />
          <Text style={styles.carName}>{carName}</Text>
        </View>
        <View style={styles.connectorContainer}>
          <MaterialCommunityIcons name="ev-plug-ccs2" size={24} color={colors.mainTextColor} />
          <Text style={styles.connector}>
            {connectorType} {currentType ? `- ${currentType}` : ''}
          </Text>
        </View>
      </View>

      {/* Refund Information */}
      {refundAmount > 0 ? (
        <View style={styles.refundSection}>
          <View style={styles.refundRow}>
            <MaterialIcons name="attach-money" size={18} color={colors.success} />
            <Text style={styles.refundText}>
              Refund: LKR {refundAmount} ({refundPercentage}%)
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.noRefundSection}>
          <View style={styles.refundRow}>
            <MaterialIcons name="info" size={18} color={colors.warning} />
            <Text style={styles.noRefundText}>No refund processed</Text>
          </View>
        </View>
      )}

      {/* Cancellation Details */}
      <View style={styles.cancellationSection}>
        <View style={styles.cancellationRow}>
          <MaterialIcons name="access-time" size={16} color={colors.secondaryText} />
          <Text style={styles.cancellationText}>Cancelled on: {cancelledAt}</Text>
        </View>
        <View style={styles.cancellationRow}>
          <MaterialIcons name="chat" size={16} color={colors.secondaryText} />
          <Text style={styles.cancellationText}>{cancellationReason}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    elevation: 2,
    // borderLeftWidth: 4,
    // borderLeftColor: colors.danger,
  },
  cancelledBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  cancelledText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSansBold,
    marginLeft: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
    marginTop: 8, // Added space for the badge
  },
  dateText: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 16,
    color: colors.mainTextColor,
  },
  duration: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginHorizontal: 10,
  },
  durationText: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
  },
  timeText: {
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 14,
    color: colors.mainTextColor,
  },
  separator: {
    height: 1,
    backgroundColor: colors.stroke,
    marginVertical: 8,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  stationContainer: {
    flex: 1,
  },
  stationName: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 16,
    color: colors.mainTextColor,
  },
  address: {
    color: colors.secondaryText,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  carContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  connectorContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  carImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: 'cover',
    overflow: 'hidden',
    backgroundColor: colors.stroke,
  },
  carName: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
  },
  connector: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
  },
  refundSection: {
    backgroundColor: colors.lightSuccess,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    // borderLeftWidth: 3,
    // borderLeftColor: colors.success,
  },
  noRefundSection: {
    backgroundColor: colors.lightWarning,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  refundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refundText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.success,
  },
  noRefundText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.warning,
  },
  cancellationSection: {
    backgroundColor: colors.lightDanger,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  cancellationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  cancellationText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.danger,
    flex: 1,
  },
});

export default CancelledBookingCard;