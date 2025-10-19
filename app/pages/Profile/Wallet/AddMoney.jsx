import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';
import { useNavigation } from "@react-navigation/native";
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '@env';
import useUserData from '../../../../hooks/useUserData';

const AddMoneyScreen = () => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const navigation = useNavigation();
  const { user, isLoading: isUserLoading } = useUserData();
  const router = useRouter();

  const presetAmounts = [500, 1000, 2000, 5000];

  const handleAmountPress = (value) => {
    setAmount(value.toString());
  };

  const handleAddMoney = async () => {
    const topUpAmount = parseFloat(amount);
    
    if (!topUpAmount || topUpAmount < 100) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Invalid Amount',
        textBody: 'Minimum top-up amount is LKR 100',
      });
      return;
    }

    try {
      setIsLoading(true);

      // Simulate API call to add money
      const response = await fetch(`${API_BASE_URL}/api/wallet/topup/local/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: topUpAmount
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add money');
      }

      if (result.success) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: `LKR ${topUpAmount.toLocaleString()} added to your wallet successfully!`,
        });
        
        // Navigate back after success
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      }
    } catch (error) {
      console.error('Add money error:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Remove card-related functionality
  }, []);

  const formatAmount = (val) => {
    const num = Number(val || 0);
    return num.toLocaleString('en-LK');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Money</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Amount Input */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Enter Amount</Text>
          <View style={styles.amountBox}>
            <Text style={styles.currencySign}>LKR </Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.secondaryText}
            />
          </View>

          <View style={styles.presetRow}>
            {presetAmounts.map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.presetBtn,
                  amount === value.toString() && styles.presetBtnActive
                ]}
                onPress={() => handleAmountPress(value)}
              >
                <Text style={[
                  styles.presetText,
                  amount === value.toString() && styles.presetTextActive
                ]}>
                  LKR {value.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Method Info */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Payment Method</Text>
          <View style={styles.paymentInfo}>
            <Ionicons name="wallet-outline" size={24} color={colors.primary} />
            <View style={styles.paymentTextContainer}>
              <Text style={styles.paymentTitle}>Direct Wallet Top-up</Text>
              <Text style={styles.paymentSubtitle}>
                Amount will be added directly to your wallet balance
              </Text>
            </View>
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Ionicons name="lock-closed" size={16} color={colors.primary} />
          <Text style={styles.securityText}>
            Your transaction is secure
          </Text>
        </View>
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={[
          styles.addButton,
          (!amount || parseFloat(amount) === 0 || isLoading) && styles.disabledButton,
        ]}
        onPress={handleAddMoney}
        disabled={!amount || parseFloat(amount) === 0 || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Text style={styles.addButtonText}>
            Add LKR {formatAmount(amount)} to Wallet
          </Text>
        )}
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    backgroundColor: colors.lightestGray,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    marginBottom: 12,
    color: colors.mainTextColor,
  },
  card: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.white,
  },
  currencySign: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginRight: 8,
  },
  amountInput: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    flex: 1,
    color: colors.mainTextColor,
    padding: 0,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetBtn: {
    backgroundColor: colors.lightestGray,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    minWidth: '22%',
    alignItems: 'center',
  },
  presetBtnActive: {
    backgroundColor: colors.primary,
  },
  presetText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  presetTextActive: {
    color: colors.white,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  paymentTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  paymentTitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  paymentSubtitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    lineHeight: 18,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  securityText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.primary,
    marginLeft: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: colors.lightGray,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
  },
});

export default AddMoneyScreen;