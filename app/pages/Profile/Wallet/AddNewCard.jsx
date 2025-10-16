import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import InputField from '../../../../components/InputField';
import CustomButton from '../../../../components/CustomButton';
import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import AppBar from '../../../../components/AppBar';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { API_BASE_URL } from '@env';
import useUserData from '../../../../hooks/useUserData';
import { useRouter } from 'expo-router';

const AddPaymentMethodScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUserData();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19);
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  // Initiate minimal payment to trigger card tokenization
  const initiateCardAddition = async () => {
    try {
      setIsLoading(true);
      if (!user?._id) {
        // user not available yet
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'User not ready',
          textBody: 'Please wait while we load your account information',
        });
        setIsLoading(false);
        return;
      }
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Use minimal amount (100 LKR) just to trigger card saving
      const minimalAmount = 100;

      const response = await fetch(`${API_BASE_URL}/api/wallet/topup/initiate/${user._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: minimalAmount,
          save_card: true 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to initiate card addition');
      }

      if (result.success) {
        // Navigate to PaymentWebView with card saving enabled
        router.push({
          pathname: '/pages/Profile/Wallet/PaymentWebView',
          params: {
            paymentData: JSON.stringify(result.payment_data),
            sandbox: String(result.sandbox),
            amount: String(minimalAmount),
            isAddingCard: 'true', // flag
          },
        });
      }

    } catch (error) {
      console.error('Card addition error:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // Basic validation (optional - for user experience only)
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Invalid Card',
        textBody: 'Please enter a valid 16-digit card number',
      });
      return;
    }

    if (!expiry || expiry.length !== 5) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Invalid Expiry',
        textBody: 'Please enter a valid expiry date (MM/YY)',
      });
      return;
    }

    if (!cvv || cvv.length < 3) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Invalid CVV',
        textBody: 'Please enter a valid CVV',
      });
      return;
    }

    Alert.alert(
      'Add Card Securely',
      'You will be redirected to our secure payment partner to add your card. A temporary authorization of LKR 100 will be made and immediately refunded.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          onPress: initiateCardAddition,
        },
      ]
    );
  };

  const handleQuickAdd = () => {
    // Skip card preview and go directly to payment gateway
    Alert.alert(
      'Quick Card Add',
      'You will be redirected to our secure payment partner to add your card. A temporary authorization of LKR 100 will be made and immediately refunded.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Add Card',
          onPress: initiateCardAddition,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AppBar title="Add New Card" />

      <ScrollView contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Add Option */}
        <TouchableOpacity 
          style={styles.quickAddCard}
          onPress={handleQuickAdd}
          disabled={isLoading}
        >
          <View style={styles.quickAddIcon}>
            <Ionicons name="flash" size={24} color={colors.primary} />
          </View>
          <View style={styles.quickAddContent}>
            <Text style={styles.quickAddTitle}>Quick Add</Text>
            <Text style={styles.quickAddText}>
              Skip preview and go directly to secure payment
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.lightGray} />
        </TouchableOpacity>

        <Text style={styles.divider}>OR</Text>

        {/* Card Preview Section */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>Preview Your Card</Text>
          <Text style={styles.sectionSubtitle}>
            This helps identify your card (optional)
          </Text>

          <InputField
            label="Card Number"
            value={cardNumber}
            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
            placeholder="1234 5678 9012 3456"
            keyboardType="number-pad"
            maxLength={19}
            editable={!isLoading}
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <InputField
                label="Expiry Date"
                value={expiry}
                onChangeText={(text) => setExpiry(formatExpiry(text))}
                placeholder="MM/YY"
                keyboardType="number-pad"
                maxLength={5}
                editable={!isLoading}
              />
            </View>
            <View style={styles.halfWidth}>
              <InputField
                label="CVV"
                value={cvv}
                onChangeText={(text) => setCvv(text.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                editable={!isLoading}
              />
            </View>
          </View>

          <InputField
            label="Cardholder Name"
            value={cardholderName}
            onChangeText={setCardholderName}
            placeholder="John Doe"
            keyboardType="default"
            autoCapitalize="words"
            editable={!isLoading}
          />

          {/* Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => !isLoading && setIsDefault(!isDefault)}
            disabled={isLoading}
          >
            <View style={[
              styles.checkbox, 
              isDefault && styles.checkedBox,
              isLoading && styles.disabledCheckbox
            ]}>
              {isDefault && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={[
              styles.checkboxLabel,
              isLoading && styles.disabledText
            ]}>
              Set as default payment method
            </Text>
          </TouchableOpacity>
        </View>

        {/* Secure Payment Info */}
        <View style={styles.secureBox}>
          <View style={styles.secureHeader}>
            <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
            <Text style={styles.secureTitle}>How Card Addition Works</Text>
          </View>
          <View style={styles.secureFeatures}>
            <View style={styles.featureItem}>
              <Ionicons name="lock-closed" size={14} color={colors.primary} />
              <Text style={styles.featureText}>Redirect to secure payment gateway</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="card" size={14} color={colors.primary} />
              <Text style={styles.featureText}>Enter card details securely</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="key" size={14} color={colors.primary} />
              <Text style={styles.featureText}>Receive secure token (no card storage)</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="refresh" size={14} color={colors.primary} />
              <Text style={styles.featureText}>LKR 100 temporary authorization (refunded)</Text>
            </View>
          </View>
        </View>

        {/* Add Card Button */}
        <CustomButton 
          title={isLoading ? "Redirecting..." : "Continue to Secure Payment"} 
          type="primary" 
          onPress={handleSave}
          disabled={isLoading}
          loading={isLoading}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  quickAddCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  quickAddIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickAddContent: {
    flex: 1,
  },
  quickAddTitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.primary,
    marginBottom: 2,
  },
  quickAddText: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  divider: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.lightGray,
    marginVertical: 16,
  },
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.stroke,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkedBox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  disabledCheckbox: {
    opacity: 0.5,
  },
  checkboxLabel: {
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.mainTextColor,
    flex: 1,
  },
  disabledText: {
    opacity: 0.5,
  },
  secureBox: {
    backgroundColor: '#F8FBFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E1F0FF',
  },
  secureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  secureTitle: {
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.primary,
    marginLeft: 8,
  },
  secureFeatures: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.HighlightText,
    marginLeft: 8,
    flex: 1,
  },
});

export default AddPaymentMethodScreen;