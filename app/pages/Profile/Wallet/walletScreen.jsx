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
import SettingsIcon from '../../../../assets/settings.png';
import ManageCardIcon from '../../../../assets/wallet.png';
import HistoryIcon from '../../../../assets/schedule.png';
import { useRouter } from 'expo-router';


const WalletScreen = () => {
  const navigation = useNavigation(); // ✅ Use hook for safe navigation
  const router = useRouter();

  const transactions = [
    {
      id: 1,
      title: 'ChargingPoint - Galle',
      amount: '- LKR 2,650.60',
      time: '2 hours ago',
      type: 'debit',
    },
    {
      id: 2,
      title: 'Wallet Top-up',
      amount: '+ LKR 14,500.00',
      time: '18 hours ago',
      type: 'credit',
    },
    {
      id: 3,
      title: 'Tesla OneGalleFace Mall',
      amount: '- LKR 1,050.75',
      time: '1 day ago',
      type: 'debit',
    },
    {
      id: 4,
      title: 'ChargingPoint - KCC',
      amount: '- LKR 3,850.25',
      time: '2 days ago',
      type: 'debit',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      {/* 🟢 AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWrapper}>
          <Image source={BackIcon} style={styles.icon} />
        </TouchableOpacity>

        <Text style={styles.appBarTitle}>EV Wallet</Text>

        <TouchableOpacity style={styles.iconWrapper}>
          <Image source={SettingsIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* 🏦 Wallet Header */}
      <View style={styles.walletContainer}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balance}>LKR 13,750.00</Text>
        <TouchableOpacity style={styles.addMoneyBtn}
        onPress={() => router.push('/pages/Profile/Wallet/AddMoney')}
        >
          <Text style={styles.addMoneyText}>Add Money</Text>
        </TouchableOpacity>
      </View>

      {/* ⚡ Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('pages/Profile/Wallet/ManageCards')}
        >
          <Image source={ManageCardIcon} style={styles.actionIconImage} />
          <Text style={styles.actionLabel}>Manage Cards</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('pages/Profile/Wallet/TransactionsHistory')}
        >
          <Image source={HistoryIcon} style={styles.actionIconImage} />
          <Text style={styles.actionLabel}>Transactions History</Text>
        </TouchableOpacity>
      </View>

      {/* 🧾 Recent Transactions */}
      <ScrollView contentContainerStyle={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {transactions.map((item) => (
          <View
            key={item.id}
            style={[
              styles.transactionCard,
              item.type === 'credit' ? styles.creditCard : styles.debitCard,
            ]}
          >
            <View>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.transactionTime}>{item.time}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                item.type === 'credit' ? styles.creditAmount : styles.debitAmount,
              ]}
            >
              {item.amount}
            </Text>
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
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 36,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  appBarTitle: {
    fontSize: 26,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.white,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.white,
  },
  walletContainer: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  balanceLabel: {
    color: colors.lightestGray,
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans,
  },
  balance: {
    color: colors.white,
    fontSize: 28,
    fontFamily: fonts.PlusJakartaSansBold,
    marginVertical: 10,
  },
  addMoneyBtn: {
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 8,
  },
  addMoneyText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  actionCard: {
    backgroundColor: colors.background,
    padding: 16,
    width: '42%',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIconImage: {
    width: 30,
    height: 30,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  actionLabel: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
    textAlign: 'center',
  },
  activityContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    marginBottom: 12,
    color: colors.mainTextColor,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  debitCard: {
    backgroundColor: '#FFECEC',
  },
  creditCard: {
    backgroundColor: colors.bgGreen,
  },
  transactionTitle: {
    fontSize: 15,
    fontFamily: fonts.PlusJakartaSansMedium,
    color: colors.mainTextColor,
  },
  transactionTime: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSansBold,
  },
  debitAmount: {
    color: colors.danger,
  },
  creditAmount: {
    color: colors.primary,
  },
});

export default WalletScreen;
