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

// Card brand logos
const visaLogo = require('../../../../assets/visa.png');
const mastercardLogo = require('../../../../assets/mastercard.png');
const amexLogo = require('../../../../assets/amex.png');
const defaultCardLogo = require('../../../../assets/credit-card.png');

const AddMoneyScreen = () => {
  const [amount, setAmount] = useState('');
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [loadingCards, setLoadingCards] = useState(true);
  const navigation = useNavigation();
  const { user, isLoading: isUserLoading } = useUserData();
  const router = useRouter();

  const presetAmounts = [500, 1000, 2000, 5000];

  const fetchSavedCards = async () => {
    try {
      setLoadingCards(true);
      // Wait for user to be available
      if (!user?._id) {
        setLoadingCards(false);
        return;
      }

      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/wallet/cards/${user._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch saved cards');
      }

      setSavedCards(result.cards || []);
      
      // Auto-select default card if available
      const defaultCard = result.cards?.find(card => card.is_default);
      if (defaultCard) {
        setSelectedCardId(defaultCard._id);
      }

    } catch (error) {
      console.error('Fetch cards error:', error);
      // Don't show error toast here as it's not critical
    } finally {
      setLoadingCards(false);
    }
  };

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
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/wallet/topup/initiate/${user._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: topUpAmount,
          save_card: saveCard 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to initiate top-up');
      }

      if (result.success) {
        // Navigate to payment webview with PayHere data using expo-router
        router.push({
          pathname: '/pages/Profile/Wallet/PaymentWebView',
          params: {
            paymentData: JSON.stringify(result.payment_data),
            sandbox: String(result.sandbox),
            amount: String(topUpAmount),
          },
        });
        
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Redirecting to payment gateway...',
        });
      }
    } catch (error) {
      console.error('Top-up error:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCardLogo = (cardType) => {
    switch (cardType?.toLowerCase()) {
      case 'visa':
        return visaLogo;
      case 'master':
        return mastercardLogo;
      case 'amex':
        return amexLogo;
      default:
        return defaultCardLogo;
    }
  };

  const formatCardMask = (cardMask) => {
    if (cardMask.includes('•') || cardMask.includes('*')) {
      return cardMask;
    }
    return `•••• ${cardMask.slice(-4)}`;
  };

  useEffect(() => {
    if (user?._id) {
      fetchSavedCards();
    }
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

        {/* Saved Cards Section */}
        {!loadingCards && savedCards.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Saved Payment Methods</Text>
            {savedCards.map((card) => (
              <TouchableOpacity
                key={card._id}
                style={[
                  styles.paymentCard,
                  selectedCardId === card._id && styles.selectedCard,
                ]}
                onPress={() => setSelectedCardId(card._id)}
              >
                <Image source={getCardLogo(card.card_type)} style={styles.cardLogo} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardNumber}>{formatCardMask(card.card_mask)}</Text>
                  <Text style={styles.cardType}>{card.card_type}</Text>
                  {card.is_default && <Text style={styles.defaultText}>Default</Text>}
                </View>
                <View style={styles.radio}>
                  {selectedCardId === card._id && <View style={styles.radioSelected} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Save Card Option */}
        <View style={styles.card}>
          <View style={styles.saveCardRow}>
            <View style={styles.saveCardTextContainer}>
              <Text style={styles.saveCardLabel}>Save this card for future payments</Text>
              <Text style={styles.saveCardSubtext}>
                Your card details will be securely stored with our payment partner
              </Text>
            </View>
            <Switch
              value={saveCard}
              onValueChange={setSaveCard}
              trackColor={{ false: colors.lightGray, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Ionicons name="lock-closed" size={16} color={colors.primary} />
          <Text style={styles.securityText}>
            Your payment is secure and encrypted
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
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.stroke,
    marginBottom: 12,
  },
  selectedCard: {
    backgroundColor: '#F0F9FF',
    borderColor: colors.primary,
  },
  cardLogo: {
    width: 40,
    height: 30,
    resizeMode: 'contain',
    marginRight: 12,
  },
  cardNumber: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 2,
  },
  cardType: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  defaultText: {
    fontSize: 11,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.primary,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.stroke,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  saveCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  saveCardTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  saveCardLabel: {
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 4,
  },
  saveCardSubtext: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    lineHeight: 16,
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