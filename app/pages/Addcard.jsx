import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import AppBar from '../../components/AppBar';
const AddPaymentMethodScreen = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const handleSave = () => {
    // handle save logic
  };

  const handleSkip = () => {
    // handle skip logic
  };

  return (
    <View style={styles.container}>
    <AppBar />
     
    <ScrollView contentContainerStyle={styles.container}>
       <View style={styles.mainContent}></View>
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
      />

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <InputField
            label="Expires*"
            value={expiry}
            onChangeText={setExpiry}
            placeholder="mm/yy"
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.halfWidth}>
          <InputField
            label="CVV*"
            value={cvv}
            onChangeText={setCvv}
            placeholder="•••"
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

      <TouchableOpacity onPress={handleSkip}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>

      <CustomButton title="Save" onPress={handleSave} />
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansRegular,
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
  skipText: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
    fontFamily: fonts.PlusJakartaSansMedium,
    marginTop: 250, // Increased margin to push down
    marginBottom: 0,
  },
  buttonContainer: {
    marginTop: 32,
    marginBottom: 24,
  },
});

export default AddPaymentMethodScreen;
