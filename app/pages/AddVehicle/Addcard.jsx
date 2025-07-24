import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';
import colors from '../../../constants/color';
import fonts from '../../../constants/fonts';
import AppBar from '../../../components/AppBar';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

const AddPaymentMethodScreen = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!cardNumber || !expiry || !cvv) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Missing Fields',
        textBody: 'Please fill in all required fields',
        autoClose: 2000
      });
      return;
    }

    // if (cardNumber.length < 16 || cvv.length < 2) {
    //   Toast.show({
    //     type: ALERT_TYPE.WARNING,
    //     title: 'Invalid Card',
    //     textBody: 'Please enter valid card details',
    //     autoClose: 2000
    //   });
    //   return;
    // }

    setIsLoading(true);

    try {
      const cardData = {
        cardNum: cardNumber,
        expiry,
        cardholderName,
        addedAt: new Date().toISOString()
      };

      await AsyncStorage.setItem('paymentCard', JSON.stringify(cardData));

      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Success',
        textBody: 'Card details saved successfully!',
        autoClose: 1500,
        onHide: () => router.push('/(tabs)/Profile')
      });

    } catch (error) {
      console.error('Save error:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Failed to save card details',
        autoClose: 2000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/(tabs)/Profile');
  };

  return (
    <View style={styles.container}>
      <AppBar />

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.mainContent}>
          <Text style={styles.title}>Add Payment Method</Text>
          <Text style={styles.subText}>
            Please add your payment card.{' '}
            <Text style={styles.highlightText}>All your details are encrypted and safely stored.</Text>
          </Text>

          <InputField
            label="Card Number*"
            value={cardNumber}
            onChangeText={setCardNumber}
            placeholder="•••• •••• •••• ••••"
            keyboardType="number-pad"
            maxLength={19}
            formatText={(text) => {
              // Add spaces every 4 digits for better readability
              return text.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
            }}
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <InputField
                label="Expires*"
                value={expiry}
                onChangeText={(text) => {
                  // Auto-insert slash after 2 digits
                  if (text.length === 2 && !text.includes('/')) {
                    setExpiry(text + '/');
                  } else {
                    setExpiry(text);
                  }
                }}
                placeholder="MM/YY"
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
            <View style={styles.halfWidth}>
              <InputField
                label="CVV*"
                value={cvv}
                onChangeText={setCvv}
                placeholder="•••"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
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
          />

          <View style={styles.footerButtons}>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
          
          <CustomButton 
            title={isLoading ? "Saving..." : "Save"} 
            type="primary" 
            onPress={handleSave} 
            disabled={isLoading}
            loading={isLoading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 24,
    lineHeight: 20,
  },
  highlightText: {
    color: colors.HighlightText,
    fontFamily: fonts.PlusJakartaSansMedium,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  footerButtons: {
    marginTop: 160,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSansMedium,
    marginBottom: 10,
  },

  buttonContainer: {
    marginTop: 32,
    marginBottom: 24,
  },
});

export default AddPaymentMethodScreen;