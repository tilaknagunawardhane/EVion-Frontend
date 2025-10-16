import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import axios from 'axios';

import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';
import { API_BASE_URL } from '@env';

// MOCK PAYMENT SCREEN FOR TESTING WHEN PAYHERE IS DOWN
const MockPaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { paymentData, sandbox, amount } = route.params;
  
  const [processing, setProcessing] = useState(false);

  // Simulate successful payment
  const handleMockSuccess = async () => {
    setProcessing(true);
    
    try {
      // Simulate payment gateway delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call your backend notify endpoint (simulate PayHere callback)
      const mockPayHereResponse = {
        merchant_id: paymentData.merchant_id,
        order_id: paymentData.order_id,
        payment_id: `MOCK_${Date.now()}`, // Mock payment ID
        payhere_amount: amount,
        payhere_currency: 'LKR',
        status_code: '2', // Success code
        md5sig: 'mock_hash', // In production, PayHere sends real hash
        custom_1: paymentData.custom_1, // ev_owner_id
        custom_2: paymentData.custom_2, // 'topup'
      };

      // Call your backend
      await axios.post(`${API_BASE_URL}/api/payment/notify`, mockPayHereResponse);
      
      setProcessing(false);
      
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Payment Successful (MOCK)',
        textBody: `LKR ${amount} has been added to your wallet!`,
      });
      
      navigation.replace('Wallet', { refresh: true });
      
    } catch (error) {
      setProcessing(false);
      console.error('Mock payment error:', error);
      
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Failed to process payment. Please try again.',
      });
    }
  };

  // Simulate failed payment
  const handleMockFailure = () => {
    Toast.show({
      type: ALERT_TYPE.DANGER,
      title: 'Payment Failed (MOCK)',
      textBody: 'Payment simulation failed.',
    });
    navigation.goBack();
  };

  // Simulate cancelled payment
  const handleMockCancel = () => {
    Toast.show({
      type: ALERT_TYPE.WARNING,
      title: 'Payment Cancelled (MOCK)',
      textBody: 'Payment was cancelled.',
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mock Payment (Testing)</Text>
      </View>

      {/* Payment Info Card */}
      <View style={styles.content}>
        <View style={styles.warningBanner}>
          <Ionicons name="warning" size={24} color={colors.warning} />
          <Text style={styles.warningText}>
            TESTING MODE - PayHere sandbox is unavailable
          </Text>
        </View>

        <View style={styles.paymentCard}>
          <Text style={styles.cardTitle}>Payment Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValue}>LKR {parseFloat(amount).toFixed(2)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID:</Text>
            <Text style={styles.detailValue}>{paymentData.order_id}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Merchant ID:</Text>
            <Text style={styles.detailValue}>{paymentData.merchant_id}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Sandbox Mode:</Text>
            <Text style={[styles.detailValue, { color: sandbox ? colors.primary : colors.error }]}>
              {sandbox ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>

        {/* Mock Payment Buttons */}
        <View style={styles.buttonContainer}>
          <Text style={styles.instructionText}>
            Simulate payment response:
          </Text>

          <TouchableOpacity
            style={[styles.button, styles.successButton]}
            onPress={handleMockSuccess}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color={colors.white} />
                <Text style={styles.buttonText}>Simulate Success Payment</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.failureButton]}
            onPress={handleMockFailure}
            disabled={processing}
          >
            <Ionicons name="close-circle" size={24} color={colors.white} />
            <Text style={styles.buttonText}>Simulate Failed Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleMockCancel}
            disabled={processing}
          >
            <Ionicons name="arrow-back-circle" size={24} color={colors.white} />
            <Text style={styles.buttonText}>Simulate Cancel Payment</Text>
          </TouchableOpacity>
        </View>

        {/* Info Note */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            This mock screen simulates PayHere responses for testing. 
            In production, users will see the actual PayHere payment page.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightestGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginLeft: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: '#856404',
  },
  paymentCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  successButton: {
    backgroundColor: colors.primary,
  },
  failureButton: {
    backgroundColor: colors.error,
  },
  cancelButton: {
    backgroundColor: colors.secondaryText,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans,
    color: '#1565C0',
    lineHeight: 20,
  },
});

export default MockPaymentScreen;