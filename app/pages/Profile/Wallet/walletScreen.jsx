import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';
import BackIcon from '../../../../assets/back-icon.png';
import SettingsIcon from '../../../../assets/settings.png';
import ManageCardIcon from '../../../../assets/wallet.png';
import HistoryIcon from '../../../../assets/schedule.png';
import { API_BASE_URL } from '@env';
import useUserData from '../../../../hooks/useUserData';

const WalletScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, isLoading: isUserLoading } = useUserData();


  const fetchWalletData = async () => {
    try {
      setIsLoading(true);
      // If user not yet available, skip fetching (prevents noisy errors on initial load)
      if (!user?._id) {
        setIsLoading(false);
        setRefreshing(false);
        return;
      }

      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Fetch balance
      const balanceResponse = await fetch(`${API_BASE_URL}/api/wallet/balance/${user._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const balanceResult = await balanceResponse.json();

      if (!balanceResponse.ok) {
        throw new Error(balanceResult.message || 'Failed to fetch balance');
      }

      setBalance(balanceResult.balance);

      // Fetch transactions
      const transactionsResponse = await fetch(`${API_BASE_URL}/api/wallet/transactions/${user._id}?limit=5`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const transactionsResult = await transactionsResponse.json();

      if (!transactionsResponse.ok) {
        throw new Error(transactionsResult.message || 'Failed to fetch transactions');
      }

      setTransactions(transactionsResult.transactions);

    } catch (error) {
      console.error('Wallet data fetch error:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: error.message,
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchWalletData();
    }
  }, [user]);

  useEffect(() => {
    // Recreate listener when navigation or user changes so we only fetch when user is available
    const unsubscribe = navigation.addListener('focus', () => {
      // Refresh wallet data when screen comes into focus (after payment)
      if (user?._id) {
        fetchWalletData();
      }
    });

    return unsubscribe;
  }, [navigation, user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWalletData();
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'topup':
        return '💰';
      case 'booking_charge':
        return '📅';
      case 'charging_charge':
        return '⚡';
      case 'refund_booking':
      case 'refund_charging':
        return '↩️';
      default:
        return '💵';
    }
  };

  const getTransactionColor = (type) => {
    return type.includes('refund') || type === 'topup' ? colors.primary : colors.danger;
  };

  const getTransactionTitle = (type, description) => {
    switch (type) {
      case 'topup':
        return 'Wallet Top-up';
      case 'booking_charge':
        return 'Booking Fee';
      case 'charging_charge':
        return 'Charging Session';
      case 'refund_booking':
        return 'Booking Refund';
      case 'refund_charging':
        return 'Charging Refund';
      default:
        return description || 'Transaction';
    }
  };

  const formatTransactionTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <View style={styles.appBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWrapper}>
            <Image source={BackIcon} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>EV Wallet</Text>
          <TouchableOpacity style={styles.iconWrapper}>
            <Image source={SettingsIcon} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading wallet...</Text>
        </View>
      </View>
    );
  }

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
        <Text style={styles.balance}>LKR {balance.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.addMoneyBtn}
          onPress={() => router.push('pages/Profile/Wallet/AddMoney')}
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
      <ScrollView
        contentContainerStyle={styles.activityContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <View
              key={transaction._id}
              style={[
                styles.transactionCard,
                transaction.amount >= 0 ? styles.creditCard : styles.debitCard,
              ]}
            >
              <View style={styles.transactionLeft}>
                <Text style={styles.transactionIcon}>
                  {getTransactionIcon(transaction.type)}
                </Text>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>
                    {getTransactionTitle(transaction.type, transaction.description)}
                  </Text>
                  <Text style={styles.transactionTime}>
                    {formatTransactionTime(transaction.createdAt)}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: getTransactionColor(transaction.type) }
                ]}
              >
                {transaction.amount >= 0 ? '+' : ''}LKR {Math.abs(transaction.amount).toFixed(2)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No transactions yet</Text>
        )}
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
    flexGrow: 1,
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
    alignItems: 'center',
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
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
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
  emptyText: {
    textAlign: 'center',
    color: colors.secondaryText,
    fontFamily: fonts.PlusJakartaSans,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: 10,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
});

export default WalletScreen;