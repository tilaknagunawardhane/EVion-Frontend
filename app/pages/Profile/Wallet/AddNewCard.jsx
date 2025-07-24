import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  CheckBox,
  Platform,
} from 'react-native';
import InputField from '../../../../components/InputField';
import CustomButton from '../../../../components/CustomButton';
import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import AppBar from '../../../../components/AppBar';
import { Ionicons } from '@expo/vector-icons';

const AddPaymentMethodScreen = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleSave = () => {
    // handle save logic
  };

  return (
    <View style={styles.container}>
      <AppBar title="Add New Card" />

      <ScrollView contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Card Input Section */}
        <View style={styles.cardContainer}>
          <InputField
            label="Card Number*"
            value={cardNumber}
            onChangeText={setCardNumber}
            placeholder="1234 5678 9012 3456"
            keyboardType="number-pad"
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <InputField
                label="Expiry Date*"
                value={expiry}
                onChangeText={setExpiry}
                placeholder="MM/YY"
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.halfWidth}>
              <InputField
                label="CVV*"
                value={cvv}
                onChangeText={setCvv}
                placeholder="123"
                keyboardType="number-pad"
              />
            </View>
          </View>

          <InputField
            label="Cardholder Name"
            value={cardholderName}
            onChangeText={setCardholderName}
            placeholder="John Doe"
            keyboardType="default"
          />

          {/* Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsDefault(!isDefault)}
          >
            <View style={[styles.checkbox, isDefault && styles.checkedBox]}>
              {isDefault && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>Set as default payment method</Text>
          </TouchableOpacity>
        </View>

        {/* Secure Payment Info */}
        <View style={styles.secureBox}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.secureTitle}>Secure Payment</Text>
            <Text style={styles.secureText}>
              Your card information is encrypted and stored securely.
            </Text>
          </View>
        </View>

        {/* Add Card Button */}
        <CustomButton title="Save Card" type="primary" onPress={handleSave} />
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
  cardContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 84,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS === 'ios' ? 0.05 : 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  halfWidth: {
    width: '48%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkedBox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.mainTextColor,
    fontFamily: fonts.PlusJakartaSans,
  },
  secureBox: {
    flexDirection: 'row',
    backgroundColor: '#EAF4FF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  secureTitle: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.primary,
  },
  secureText: {
    fontSize: 11,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.HighlightText,
    marginTop: 2,
  },
});

export default AddPaymentMethodScreen;
