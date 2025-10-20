import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import colors from '../../../constants/color.js';
import fonts from '../../../constants/fonts.js';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';

// SVG Icon Components
function ArrowBackIcon({ size = 24, color = colors.black }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EllipsisVerticalIcon({ size = 24, color = colors.black }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="6" r="1" fill={color} />
      <Circle cx="12" cy="12" r="1" fill={color} />
      <Circle cx="12" cy="18" r="1" fill={color} />
    </Svg>
  );
}

function CloseIcon({ size = 24, color = colors.black }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6L18 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ArrowForwardCircleIcon({ size = 28, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
      <Path
        d="M12 16L16 12L12 8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 12H16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EvStationIcon({ size = 24, color = colors.primary }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19.77 7.23L19.78 7.22L16.06 3.5L15 4.56L17.11 6.67C16.17 7.03 15.5 7.93 15.5 9C15.5 10.38 16.62 11.5 18 11.5C18.36 11.5 18.69 11.42 19 11.29V18.5C19 19.05 18.55 19.5 18 19.5C17.45 19.5 17 19.05 17 18.5V14C17 12.9 16.1 12 15 12H14V5C14 3.9 13.1 3 12 3H6C4.9 3 4 3.9 4 5V21H14V13.5H15.5V18.5C15.5 19.88 16.62 21 18 21C19.38 21 20.5 19.88 20.5 18.5V9C20.5 8.31 20.22 7.68 19.77 7.23Z"
        fill={color}
      />
      <Path
        d="M18 10C18.5523 10 19 9.55228 19 9C19 8.44772 18.5523 8 18 8C17.4477 8 17 8.44772 17 9C17 9.55228 17.4477 10 18 10Z"
        fill={color}
      />
    </Svg>
  );
}

function FlashIcon({ size = 20, color = colors.mainTextColor }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 10V3L4 14H11V21L20 10H13Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CashIcon({ size = 20, color = colors.mainTextColor }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="2"/>
      <Circle cx="12" cy="12" r="2" stroke={color} strokeWidth="2"/>
      <Path d="M6 12H6.01M18 12H18.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );
}

const CompletedBookingDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [menuVisible, setMenuVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [cancelConfirmVisible, setCancelConfirmVisible] = useState(false);

  // Updated destructuring from params
  const {
    stationName = 'Genso Charging Station',
    address = 'Southern Highway, Welipenna, Matugama',
    dateLabel = 'Jun 11, 2025',
    duration = '1 Hr 30 Mins',
    timeRange = '9:30 AM - 11:00 AM',
    connectorType = 'CCS 2',
    carName = 'Nissan Leaf 2020',
    carImage = null,
    cost = 'LKR 4125',
    chargerId = '#E0299',
    batteryGain = '~35% in 30 mins',
    estTimeTo80 = '~45 mins',
    power = '50kW (DC)',
    rate = 'LKR 55.00 /kW',
    estEnergy = '75kWh',
    estBattery = '+40%',
  } = params || {};

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowBackIcon size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <EllipsisVerticalIcon size={24} color={colors.black} />
        </TouchableOpacity>
      </View>

      {/* Popup Menu */}
      <Modal transparent visible={menuVisible} animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={() => { setMenuVisible(false); setInfoVisible(true); }}>
              <Text style={styles.menuItem}>Info</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setMenuVisible(false);
              router.push('/pages/bookings/ReportIssue');
            }}>
              <Text style={styles.menuItem}>Report</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Info Modal */}
      <Modal visible={infoVisible} transparent animationType="slide">
        <View style={styles.infoOverlay}>
          <View style={styles.infoModal}>
            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => setInfoVisible(false)}>
              <CloseIcon size={24} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.infoTitle}>Need to know..</Text>
            <Text style={styles.infoItem}>• You can cancel your booking anytime — but only <Text style={styles.bold}>up to 30 minutes</Text> before the scheduled start time.</Text>
            <Text style={styles.infoItem}>• You can reschedule your booking (change date or time) <Text style={styles.bold}>up to 30 minutes</Text> before the slot begins.</Text>
            <Text style={styles.infoItem}>• Cancellations made within 30 minutes of the slot will incur a <Text style={styles.bold}>late cancellation fee</Text> to compensate the station's lost opportunity.</Text>
            <Text style={styles.infoItem}>• If you arrive late <Text style={styles.bold}>(after the 15–minute buffer)</Text>, an extra fee will be charged for each minute delayed.</Text>
            <Text style={styles.infoItem}>• If you miss your booking and don't show up, the <Text style={styles.bold}>full estimated charging cost will be charged.</Text></Text>
            <Text style={styles.infoItem}>• Note: A <Text style={styles.bold}>3% service fee</Text> will be added to your charging cost as a booking fee.</Text>
            <Text style={[styles.infoItem, { marginTop: 10 }]}>Please plan ahead and manage your bookings responsibly to avoid unnecessary charges. Thank you for supporting a smooth EV charging experience!</Text>
          </View>
        </View>
      </Modal>

      {/* Station Info */}
      <View style={styles.stationBox}>
        <Image source={require('../../../assets/Station.jpg')} style={styles.stationImage} />
        <View style={styles.stationText}>
          <Text style={styles.stationName}>{stationName}</Text>
          <Text style={styles.stationLocation}>{address}</Text>
        </View>
        <TouchableOpacity>
          <ArrowForwardCircleIcon size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Date & Time */}
      <View style={styles.dateTimeBox}>
        <Text style={styles.dateText}>{dateLabel}</Text>
        <View style={styles.timeTag}>
          <Text style={styles.timeTagText}>{duration}</Text>
        </View>
        <Text style={styles.timeRange}>{timeRange}</Text>
      </View>

      {/* Charger Info */}
      <View style={styles.chargerCard}>
        <View style={styles.row}>
          <EvStationIcon size={24} color={colors.primary} />
          <Text style={styles.chargerType}>{connectorType}</Text>
          <Text style={styles.chargerId}>ID: {chargerId}</Text>
        </View>
        <Text style={styles.label}>Battery Gain:</Text>
        <Text style={styles.value}>{batteryGain}</Text>
        <Text style={styles.label}>Est. Time to 80%:</Text>
        <Text style={styles.value}>{estTimeTo80}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.iconText}><FlashIcon size={20} /> {power}</Text>
          <Text style={styles.iconText}><CashIcon size={20} /> {rate}</Text>
        </View>
      </View>

      {/* Estimations */}
      <View style={styles.estimations}>
        <View style={styles.estimateRow}>
          <Text style={styles.estimateLabel}>Estimated Energy Delivered:</Text>
          <Text style={styles.estimateValue}>{estEnergy}</Text>
        </View>
        <View style={styles.estimateRow}>
          <Text style={styles.estimateLabel}>Estimated Battery % Increase:</Text>
          <Text style={styles.estimateValue}>{estBattery}</Text>
        </View>
        <View style={styles.estimateRow}>
          <Text style={styles.estimateLabel}>Estimated Cost:</Text>
          <Text style={styles.estimateValue}>{cost}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity style={styles.startButton} onPress={() => router.push('/pages/bookings/AddBooking')}>
        <Text style={styles.startText}>Book Again</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.rescheduleButton} onPress={() => router.push('/pages/bookings/ReceiptScreen')}>
        <Text style={styles.rescheduleText}>View Receipt</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,// 👈 Adds gap from the top
    backgroundColor: colors.white,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, fontFamily: fonts.PlusJakartaSansBold },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 55,
    paddingRight: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  menuContainer: {
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 8,
    paddingVertical: 8,
    width: 150,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.text,
  },
  stationBox: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationImage: { width: 60, height: 60, borderRadius: 8 },
  stationText: { flex: 1, marginLeft: 10 },
  stationName: { fontSize: 16, fontFamily: fonts.PlusJakartaSansBold },
  stationLocation: { color: colors.lightGray, fontSize: 12, fontFamily: fonts.PlusJakartaSans },
  dateTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
    gap: 8,
  },
  dateText: { fontSize: 14, fontFamily: fonts.PlusJakartaSansMedium },
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
  chargerCard: {
    backgroundColor: colors.cardBackground,
    padding: 15,
    borderRadius: 10,
    borderColor: colors.lightestGray,
    borderWidth: 1,
    marginBottom: 20,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  chargerType: { fontFamily: fonts.PlusJakartaSansBold, marginLeft: 5 },
  chargerId: {
    marginLeft: 'auto',
    fontSize: 12,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
  label: {
    color: colors.secondaryText,
    marginTop: 5,
    fontFamily: fonts.PlusJakartaSans,
  },
  value: {
    marginBottom: 5,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  iconText: { flexDirection: 'row', alignItems: 'center', fontFamily: fonts.PlusJakartaSansBold },
  estimations: { marginBottom: 20 },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  estimateLabel: {
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    fontSize: 14,
  },
  estimateValue: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 14,
    color: colors.mainTextColor,
  },
  startButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  startText: {
    color: colors.white,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  rescheduleButton: {
    backgroundColor: colors.rescheduleBg,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  rescheduleText: {
    color: colors.primary,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  cancelText: {
    textAlign: 'center',
    color: colors.danger,
    fontFamily: fonts.PlusJakartaSansBold,
    marginBottom: 30,
  },
  // Info Modal Styles
  infoOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  infoModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    marginBottom: 10,
  },
  infoItem: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    marginBottom: 8,
    color: colors.mainTextColor,
  },
  bold: { fontFamily: fonts.PlusJakartaSansBold },
  cancelOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cancelModal: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cancelTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    marginBottom: 10,
    color: colors.black,
  },
  cancelMsg: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 10,
  },
  cancelActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  cancelCloseBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelCloseText: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 14,
    color: colors.text,
  },
  cancelConfirmBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelConfirmText: {
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 14,
    color: colors.white,
  },
});

export default CompletedBookingDetailsScreen;