import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';
import BackIcon from '../../../../assets/back-icon.png';
import Type2Icon from '../../../../assets/type2.png'; 
import WalletIcon from '../../../../assets/wallet.png'; 

const TransactionsHistoryScreen = () => {
  const navigation = useNavigation();

  const transactions = [
    {
      id: 1,
      title: 'Tesla Supercharger-OGF',
      amount: '-LKR 1545.30',
      time: '2 hours ago',
      type: 'debit',
      icon: Type2Icon,
    },
    {
      id: 2,
      title: 'Wallet Top-up',
      amount: '+LKR 1500.00',
      time: 'Yesterday\nVisa ****4532',
      type: 'credit',
      icon: WalletIcon,
    },
    {
      id: 3,
      title: 'ChargePoint - Downtown',
      amount: '-LKR 1223.75',
      time: '3 days ago',
      type: 'debit',
      icon: Type2Icon,
    },
    {
      id: 4,
      title: 'EVgo Station - Airport',
      amount: '-LKR 3110.50',
      time: '1 week ago',
      type: 'debit',
      icon: Type2Icon,
    },
    {
      id: 5,
      title: 'Wallet Top-up',
      amount: '+LKR 4000.00',
      time: 'Yesterday\nVisa ****4532',
      type: 'credit',
      icon: WalletIcon,
    },
    {
      id: 6,
      title: 'EVGo Station - Airport',
      amount: '-LKR 1567.20',
      time: '2 weeks ago',
      type: 'debit',
      icon: Type2Icon,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={BackIcon} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>Transaction History</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Transaction List */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {transactions.map((tx) => (
          <View
            key={tx.id}
            style={[
              styles.card,
              tx.type === 'credit' ? styles.creditCard : styles.debitCard,
            ]}
          >
            <View style={styles.leftSection}>
              <View style={styles.iconContainer}>
                <Image source={tx.icon} style={styles.txIcon} />
              </View>
              <View style={styles.details}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text
                  style={[
                    styles.amount,
                    tx.type === 'credit' ? styles.green : styles.red,
                  ]}
                >
                  {tx.amount}
                </Text>
                <Text style={styles.txTime}>{tx.time}</Text>
              </View>
            </View>
            <View style={styles.rightSection}>
              <Text style={styles.status}>Completed</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 12,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: colors.mainTextColor,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    alignItems: 'flex-start',
  },
  debitCard: {
    backgroundColor: '#FFECEC',
  },
  creditCard: {
    backgroundColor: '#E6FFF0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 32,
    padding: 10,
    marginRight: 12,
  },
  txIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  details: {
    flexShrink: 1,
  },
  txTitle: {
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
  },
  amount: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
    marginTop: 2,
  },
  green: {
    color: 'green',
  },
  red: {
    color: 'red',
  },
  txTime: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginTop: 4,
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  status: {
    fontSize: 12,
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
  },
});

export default TransactionsHistoryScreen;
