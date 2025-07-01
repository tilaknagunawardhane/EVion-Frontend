import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import colors from '../constants/color';
import fonts from '../constants/fonts';

const ConfirmationModal = ({ visible, onCancel, onConfirm }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Custom Close Button */}
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <Image
              source={require('../assets/Closeaffordance.png')} // Replace with your actual image path
              style={styles.closeIcon}
            />
          </TouchableOpacity>

          <Text style={styles.title}>Save Trip</Text>
          <Text style={styles.message}>
            Would you like to keep this trip in your saved plans?
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>I don’t want</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={onConfirm}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    paddingTop: 30,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 2,
  },
  closeIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 18,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  message: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#eeeeee',
  },
  cancelText: {
    fontFamily: fonts.PlusJakartaSans,
    fontSize: 14,
    color: colors.secondaryText,
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  saveText: {
    fontFamily: fonts.PlusJakartaSansBold,
    fontSize: 14,
    color: colors.background,
  },
});
