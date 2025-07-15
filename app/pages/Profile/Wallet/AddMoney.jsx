import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';

const visaLogo = require('../../../../assets/visa.png');
const mastercardLogo = require('../../../../assets/mastercard.png');

const AddMoneyScreen = () => {
  const [amount, setAmount] = useState('');
  const [selectedCardId, setSelectedCardId] = useState(1);

  const cards = [
    {
      id: 1,
      brand: 'Visa',
      last4: '4532',
      expiry: '12/27',
      logo: visaLogo,
    },
    {
      id: 2,
      brand: 'Mastercard',
      last4: '8901',
      expiry: '09/26',
      logo: mastercardLogo,
    },
  ];

  const presetAmounts = [1000, 3000, 5000, 10000];

  const handleAmountPress = (value) => {
    setAmount(value.toString());
  };

  const handleAddMoney = () => {
    // Handle the actual money addition logic here
  };

  const formatAmount = (val) => {
    const num = Number(val || 0);
    return num.toLocaleString('en-LK');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
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
            <Text style={styles.dollarSign}>LKR </Text>
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
                style={styles.presetBtn}
                onPress={() => handleAmountPress(value)}
              >
                <Text style={styles.presetText}>LKR {value.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Payment Method</Text>
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.paymentCard,
                selectedCardId === card.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedCardId(card.id)}
            >
              <Image source={card.logo} style={styles.cardLogo} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardNumber}>•••• {card.last4}</Text>
                <Text style={styles.expiry}>Expires {card.expiry}</Text>
              </View>
              <View style={styles.radio}>
                {selectedCardId === card.id && <View style={styles.radioSelected} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={[
          styles.addButton,
          (!amount || parseFloat(amount) === 0) && styles.disabledButton,
        ]}
        onPress={handleAddMoney}
        disabled={!amount || parseFloat(amount) === 0}
      >
        <Text style={styles.addButtonText}>
          Add LKR {formatAmount(amount)} to Wallet
        </Text>
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
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSansBold,
    marginBottom: 12,
    color: colors.mainTextColor,
  },
  card: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  dollarSign: {
    fontSize: 22,
    color: '#ADB5BD',
    marginRight: 8,
  },
  amountInput: {
    fontSize: 22,
    fontFamily: fonts.PlusJakartaSansBold,
    flex: 1,
    color: colors.mainTextColor,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetBtn: {
    backgroundColor: '#F1F3F5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  presetText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#DEE2E6',
    marginBottom: 12,
  },
  selectedCard: {
    backgroundColor: '#E6FAF0',
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
  },
  expiry: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
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
  },
  disabledButton: {
    backgroundColor: '#CED4DA',
  },
  addButtonText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSansBold,
  },
});

export default AddMoneyScreen;
