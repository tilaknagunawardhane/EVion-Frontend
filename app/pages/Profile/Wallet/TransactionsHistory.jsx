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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';

import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';
import BackIcon from '../../../../assets/back-icon.png';
import { API_BASE_URL } from '@env';
import useUserData from '../../../../hooks/useUserData';

const TransactionsHistoryScreen = () => {
  const navigation = useNavigation();
  const { user, isLoading: isUserLoading } = useUserData();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      if (!user?._id) {
        // User not available yet - skip fetching
        setIsLoading(false);
        setRefreshing(false);
        return;
      }
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/wallet/transactions/${user._id}?limit=50`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch transactions');
      }

      setTransactions(result.transactions);

    } catch (error) {
      console.error('Transactions fetch error:', error);
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
      fetchTransactions();
    }
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
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

  const formatTransactionDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
        <View style={styles.appBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={BackIcon} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.title}>Transaction History</Text>
          <View style={{ width: 20 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </View>
    );
  }

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
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <View
              key={transaction._id}
              style={[
                styles.card,
                transaction.amount >= 0 ? styles.creditCard : styles.debitCard,
              ]}
            >
              <View style={styles.leftSection}>
                <View style={styles.iconContainer}>
                  <Text style={styles.iconText}>
                    {getTransactionIcon(transaction.type)}
                  </Text>
                </View>
                <View style={styles.details}>
                  <Text style={styles.txTitle}>
                    {getTransactionTitle(transaction.type, transaction.description)}
                  </Text>
                  <Text
                    style={[
                      styles.amount,
                      { color: getTransactionColor(transaction.type) },
                    ]}
                  >
                    {transaction.amount >= 0 ? '+' : ''}LKR {Math.abs(transaction.amount).toFixed(2)}
                  </Text>
                  <Text style={styles.txTime}>
                    {formatTransactionDate(transaction.createdAt)}
                  </Text>
                </View>
              </View>
              <View style={styles.rightSection}>
                <Text style={styles.status}>
                  {transaction.status === 'completed' ? 'Completed' : transaction.status}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No transactions found</Text>
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
    flexGrow: 1,
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 32,
    padding: 10,
    marginRight: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
});

export default TransactionsHistoryScreen;