import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';

import InputField   from '../../components/InputField';
import PopupAppBar  from '../../components/PopupAppBar';
import colors       from '../../constants/color';
import fonts        from '../../constants/fonts';

const BatteryStatusModal = ({ visible, onClose, onConfirm }) => {
  const [battery, setBattery] = useState('');

  /* ───────── confirm handler ───────── */
  const handleConfirm = () => {
    onConfirm?.(battery);   // pass value up if parent cares
    onClose?.();            // hide this modal
    router.push('/pages/QuickCheckModal');
  };

  /* ───────── component ───────── */
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.fullOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* optional top app‑bar inside modal */}
        <PopupAppBar />

        {/* modal card */}
        <View style={styles.card}>
          {/* close (×) button */}
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => {
              onClose?.();
              router.back();      // go to previous screen
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          {/* headline + helper text */}
          <Text style={styles.title}>Battery Status</Text>
          <Text style={styles.description}>
            Please provide your current battery percentage to help us optimize your route plan.
          </Text>

          {/* input */}
          <InputField
            label=""
            value={battery}
            onChangeText={setBattery}
            placeholder="Enter Battery Percentage"
            keyboardType="numeric"
          />

          {/* confirm */}
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default BatteryStatusModal;

/* ───────── styles ───────── */
const styles = StyleSheet.create({
  fullOverlay: {
    flex: 1,
    backgroundColor: colors.secondaryText,            // translucent overlay tint
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    marginTop: 100,
    borderRadius: 20,
    padding: 20,
    elevation: 5,                                     // Android shadow
    shadowColor: '#000',                              // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  closeIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  closeText: {
    fontSize: 20,
    color: '#888',
  },
  title: {
    fontFamily: fonts.PlusJakartaSansMedium,
    fontSize: 24,
    color: colors.mainTextColor,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmBtn: {
    marginTop: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmText: {
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 14,
    color: 'white',
  },
});
