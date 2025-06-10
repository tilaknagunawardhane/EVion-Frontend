import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import colors from '../../constants/color';
import fonts from '../../constants/fonts';
import AppBar from '../../components/AppBar';
import { useNavigation } from '@react-navigation/native';


const AddCardScreen = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');

  return (
    <SafeAreaView style={styles.container}>
        <AppBar />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      ></ScrollView>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Add Payment Method</Text>
        <Text style={styles.subtitle}> Please add your payment card.All your details are encrypted and safely stored.</Text>
      </View>
      <View style={styles.form}>
        <InputField
          label="Card Number*"
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder="**** **** **** ****"
          keyboardType="numeric"
        />
        <View style={styles.row}>
          <InputField
            label="Expires*"
            value={expiryDate}
            onChangeText={setExpiryDate}
            placeholder="mm/yy"
            keyboardType="numeric"
            style={styles.halfInput}
          />
          <InputField
            label="CVV*"
            value={cardCvv}
            onChangeText={setCardCvv}
            placeholder="***"
            keyboardType="numeric"
            secureTextEntry
            style={styles.halfInput}
          />
        </View>
        <InputField
          label="Cardholder Name"
          value={cardHolderName}
          onChangeText={setCardHolderName}
          placeholder="John Doe"
          autoCapitalize="words"
        />

        {/* Centered Skip Button */}
        <View style={{ alignItems: 'center', marginVertical: 80}}>
          <CustomButton
            title="Skip for now"
            type="secondary"
            onPress={() => console.log('Skip pressed')}
           
          />
        </View>

        <CustomButton
          title="Save"
          type="primary"
          onPress={() => console.log('Save pressed')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: StatusBar.currentHeight,
  },
  header: {
    padding:16,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginTop: 4,
  },
  form: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.stroke,
    textAlign: 'center',
   
  
  },
});

export default AddCardScreen;