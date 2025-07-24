import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';

// Dummy card logos (replace with actual local images if needed)
const visaLogo = require('../../../../assets/visa.png');
const mastercardLogo = require('../../../../assets/mastercard.png');

const ManageCardsScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const cards = [
    {
      id: 1,
      brand: 'Visa',
      last4: '4532',
      expiry: '12/27',
      isDefault: true,
      logo: visaLogo,
    },
    {
      id: 2,
      brand: 'Mastercard',
      last4: '8901',
      expiry: '09/26',
      isDefault: false,
      logo: mastercardLogo,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.mainTextColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {cards.map((card) => (
          <View key={card.id} style={styles.card}>
            <View style={styles.cardLeft}>
              <Image source={card.logo} style={styles.cardLogo} />
              <View>
                <Text style={styles.cardNumber}>•••• •••• •••• {card.last4}</Text>
                <Text style={styles.expiry}>Expires {card.expiry}</Text>
                {card.isDefault && <Text style={styles.defaultText}>Default</Text>}
              </View>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.iconBtn}>
                <MaterialIcons name="edit" size={20} color={colors.lightGray} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <MaterialIcons name="delete" size={20} color={colors.lightGray} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Add New Card Button */}
        <TouchableOpacity style={styles.addCardBtn} onPress={() => router.push('pages/Profile/Wallet/AddNewCard')}  >
          <Ionicons name="add" size={20} color={colors.white} />
          <Text style={styles.addCardText}>Add New Card</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  defaultText: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.primary,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    marginLeft: 8,
  },
  addCardBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  addCardText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSansBold,
    marginLeft: 6,
  },
});

export default ManageCardsScreen;
