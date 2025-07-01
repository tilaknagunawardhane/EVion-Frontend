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
import { useNavigation } from '@react-navigation/native'; // Added navigation

import InputField from '../../components/InputField'; 
import PopupAppBar from '../../components/PopupAppBar'; 
import colors from '../../constants/color';
import fonts from '../../constants/fonts';

const BatteryStatusModal = ({ visible, onClose, onConfirm }) => {
  const [battery, setBattery] = useState('');
  const navigation = useNavigation(); // Initialize navigation

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.fullOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <PopupAppBar />

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => {
              onClose?.();
              navigation.goBack(); // Navigate to previous screen
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Battery Status</Text>
          <Text style={styles.description}>
            Please provide your current battery percentage to help us optimize your route plan.
          </Text>

          <InputField
            label=""
            value={battery}
            onChangeText={setBattery}
            placeholder="Enter Battery Percentage"
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.confirmBtn} onPress={() => onConfirm?.(battery)}>
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default BatteryStatusModal;

const styles = StyleSheet.create({
  fullOverlay: {
    flex: 1,
    backgroundColor: '#BDBDBD',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    borderRadius: 20,
    padding: 20,
    marginTop: 100,
    elevation: 5,
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
