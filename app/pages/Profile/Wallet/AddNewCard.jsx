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
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { CardStorageHelper } from '../../../../utils/cardStorageHelper';

const AddPaymentMethodScreen = () => {
  const navigation = useNavigation();
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

  const handleSave = async () => {
    // Validate card number
    if (!CardStorageHelper.validateCardNumber(cardNumber)) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Invalid Card',
        textBody: 'Please enter a valid card number',
      });
      return;
    }

    // Validate expiry date
    if (!CardStorageHelper.validateExpiry(expiry)) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Invalid Expiry',
        textBody: 'Please enter a valid expiry date (MM/YY)',
      });
      return;
    }

    // Validate CVV
    if (!cvv || cvv.length < 3) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Invalid CVV',
        textBody: 'Please enter a valid CVV',
      });
      return;
    }

    try {
      setIsLoading(true);

      const cardData = {
        cardNumber: cardNumber.replace(/\s/g, ''),
        expiry,
        cvv,
        cardholderName,
        isDefault,
        lastFour: cardNumber.slice(-4),
        type: CardStorageHelper.getCardType(cardNumber),
        displayNumber: CardStorageHelper.formatCardDisplay(cardNumber)
      };

      const cardId = await CardStorageHelper.saveCard(cardData);
      
      if (cardId) {
        // If this is default, update other cards
        if (isDefault) {
          await CardStorageHelper.setDefaultCard(cardId);
        }

        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Card saved successfully!',
        });
        
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      } else {
        throw new Error('Failed to save card');
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppBar title="Add New Card" />

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Card Details Form */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>Card Details</Text>
          <Text style={styles.sectionSubtitle}>
            Your card details are stored securely on your device
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

          {/* Default Card Checkbox */}
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

        {/* Security Info */}
        <View style={styles.secureBox}>
          <View style={styles.secureHeader}>
            <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
            <Text style={styles.secureTitle}>Secure Storage</Text>
          </View>
          <View style={styles.secureFeatures}>
            <View style={styles.featureItem}>
              <Ionicons name="phone-portrait-outline" size={14} color={colors.primary} />
              <Text style={styles.featureText}>Card details stored locally on your device</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="lock-closed" size={14} color={colors.primary} />
              <Text style={styles.featureText}>Encrypted using secure storage</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="cloud-offline" size={14} color={colors.primary} />
              <Text style={styles.featureText}>No card data sent to our servers</Text>
            </View>
          </View>
        </View>

        {/* Save Card Button */}
        <CustomButton 
          title={isLoading ? "Saving..." : "Save Card"} 
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