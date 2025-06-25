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
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../constants/color.js';
import fonts from '../../../constants/fonts.js';
import { useRouter } from 'expo-router';
import { useNavigation, useRoute } from '@react-navigation/native';

const CompletedBookingDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const router = useRouter();

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
  } = route?.params || {};

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Icon name="ellipsis-vertical" size={24} color={colors.black} />
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
              router.push('../pages/bookings/ReportIssue');
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
              <Icon name="close" size={24} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.infoTitle}>Need to know..</Text>
            <Text style={styles.infoItem}>• You can cancel your booking anytime — but only <Text style={styles.bold}>up to 30 minutes</Text> before the scheduled start time.</Text>
            <Text style={styles.infoItem}>• You can reschedule your booking (change date or time) <Text style={styles.bold}>up to 30 minutes</Text> before the slot begins.</Text>
            <Text style={styles.infoItem}>• Cancellations made within 30 minutes of the slot will incur a <Text style={styles.bold}>late cancellation fee</Text> to compensate the station’s lost opportunity.</Text>
            <Text style={styles.infoItem}>• If you arrive late <Text style={styles.bold}>(after the 15–minute buffer)</Text>, an extra fee will be charged for each minute delayed.</Text>
            <Text style={styles.infoItem}>• If you miss your booking and don’t show up, the <Text style={styles.bold}>full estimated charging cost will be charged.</Text></Text>
            <Text style={styles.infoItem}>• Note: A <Text style={styles.bold}>3% service fee</Text> will be added to your charging cost as a booking fee.</Text>
            <Text style={[styles.infoItem, { marginTop: 10 }]}>Please plan ahead and manage your bookings responsibly to avoid unnecessary charges. Thank you for supporting a smooth EV charging experience!</Text>
          </View>
        </View>
      </Modal>

      {/* Station Info */}
      <View style={styles.stationBox}>
        <Image source={{ uri: 'https://i.ibb.co/SKQ5ZBk/station.png' }} style={styles.stationImage} />
        <View style={styles.stationText}>
          <Text style={styles.stationName}>{stationName}</Text>
          <Text style={styles.stationLocation}>{address}</Text>
        </View>
        <TouchableOpacity>
          <Icon name="arrow-forward-circle" size={28} color={colors.primary} />
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
          <MaterialCommunityIcons name="ev-station" size={24} color={colors.primary} />
          <Text style={styles.chargerType}>{connectorType}</Text>
          <Text style={styles.chargerId}>ID: {chargerId}</Text>
        </View>
        <Text style={styles.label}>Battery Gain:</Text>
        <Text style={styles.value}>{batteryGain}</Text>
        <Text style={styles.label}>Est. Time to 80%:</Text>
        <Text style={styles.value}>{estTimeTo80}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.iconText}><Icon name="flash" size={20} /> {power}</Text>
          <Text style={styles.iconText}><Icon name="cash" size={20} /> {rate}</Text>
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
      <TouchableOpacity style={styles.startButton} onPress={() => console.log("Book again pressed")}>
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
