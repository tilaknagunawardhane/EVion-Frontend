import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';

import colors        from '../../constants/color';
import fonts         from '../../constants/fonts';
import PopupAppBar   from '../../components/PopupAppBar';
import SlotItem      from '../../components/SlotItem';

const StartChargingModal = ({ visible, onClose, onReserve }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  /* ───────── reserve handler ───────── */
  const handleReserve = () => {
    onReserve?.(selectedSlot);     // pass slot up if parent cares
    onClose?.();                   // hide this modal
    router.push('/pages/BookingReceipt');
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.fullOverlay}>
        <PopupAppBar />

        <View style={styles.card}>
          {/* header */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Reserve Next Slot?</Text>
            <TouchableOpacity
              onPress={() => {
                onClose?.();
                router.back();     // pop the modal route if present
              }}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Charging allowed until next reservation. Reserve upcoming slots to keep charging.
          </Text>

          {/* slot list */}
          <ScrollView>
            <SlotItem
              type="current"
              time="08:00am – 08:30am"
              remaining="(12 mins left)"
            />

            <SlotItem
              type="selectable"
              time="08:30am – 09:00am"
              isSelected={selectedSlot === '08:30am – 09:00am'}
              onPress={() => setSelectedSlot('08:30am – 09:00am')}
            />

            <SlotItem type="disabled" time="09:00am – 09:30am" />
            <SlotItem type="disabled" time="09:30am – 10:00am" />

            <SlotItem
              type="selectable"
              time="10:00am – 10:30am"
              isSelected={selectedSlot === '10:00am – 10:30am'}
              onPress={() => setSelectedSlot('10:00am – 10:30am')}
            />
          </ScrollView>

          {/* footer buttons */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              onPress={() => {
                onClose?.();
                router.back();
              }}>
              <Text style={styles.enoughText}>Enough for now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.reserveBtn,
                !selectedSlot && { opacity: 0.5 },
              ]}
              disabled={!selectedSlot}
              onPress={handleReserve}>
              <Text style={styles.reserveText}>Reserve</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default StartChargingModal;

/* ───────── styles ───────── */
const styles = StyleSheet.create({
  fullOverlay: {
    flex: 1,
    backgroundColor: colors.secondaryText,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
  },
  card: {
    marginHorizontal: 20,
    marginTop: 40,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 22,
    color: colors.mainTextColor,
  },
  closeText: {
    fontSize: 24,
    color: colors.secondaryText,
  },
  subtitle: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 14,
    color: colors.secondaryText,
    marginVertical: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  enoughText: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 14,
    color: colors.secondaryText,
  },
  reserveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  reserveText: {
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 14,
    color: colors.background,
  },
});
