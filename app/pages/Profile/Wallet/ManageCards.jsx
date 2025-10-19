import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { CardStorageHelper } from '../../../../utils/cardStorageHelper';

import colors from '../../../../constants/color';
import fonts from '../../../../constants/fonts';
import { useRouter } from 'expo-router';

// Card brand logos
const visaLogo = require('../../../../assets/visa.png');
const mastercardLogo = require('../../../../assets/mastercard.png');
const amexLogo = require('../../../../assets/amex.png');
const defaultCardLogo = require('../../../../assets/credit-card.png');

const ManageCardsScreen = () => {
  const navigation = useNavigation();
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Helper function to get card logo based on card type
  const getCardLogo = (cardType) => {
    switch (cardType?.toLowerCase()) {
      case 'visa':
        return visaLogo;
      case 'master':
        return mastercardLogo;
      case 'amex':
        return amexLogo;
      default:
        return defaultCardLogo;
    }
  };

  // Helper function to format card mask
  const formatCardMask = (cardNumber) => {
    if (!cardNumber) return '•••• •••• •••• ••••';
    
    // If it's already masked, return as is
    if (cardNumber.includes('•') || cardNumber.includes('*')) {
      return cardNumber;
    }
    
    // If it's a full card number, mask it
    if (cardNumber.length >= 16) {
      const lastFour = cardNumber.slice(-4);
      return `•••• •••• •••• ${lastFour}`;
    }
    
    // For stored cards with displayNumber
    return cardNumber;
  };

  const loadCards = async () => {
    try {
      setIsLoading(true);
      const savedCards = await CardStorageHelper.getCards();
      setCards(savedCards);
    } catch (error) {
      console.error('Error loading cards:', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Failed to load cards',
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const deleteCard = async (cardId) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to remove this card?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await CardStorageHelper.deleteCard(cardId);
              if (success) {
                Toast.show({
                  type: ALERT_TYPE.SUCCESS,
                  title: 'Success',
                  textBody: 'Card removed successfully',
                });
                loadCards();
              }
            } catch (error) {
              Toast.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: 'Failed to delete card',
              });
            }
          },
        },
      ]
    );
  };

  const setDefaultCard = async (cardId) => {
    try {
      const success = await CardStorageHelper.setDefaultCard(cardId);
      if (success) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Default card updated successfully',
        });
        loadCards();
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Failed to set default card',
      });
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadCards();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.mainTextColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Methods</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading cards...</Text>
        </View>
      </View>
    );
  }

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
        {cards.length > 0 ? (
          cards.map((card) => (
            <View key={card.id} style={[
              styles.card,
              card.isDefault && styles.defaultCard
            ]}>
              <View style={styles.cardLeft}>
                <Image source={getCardLogo(card.type)} style={styles.cardLogo} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardNumber}>
                    {card.displayNumber || formatCardMask(card.cardNumber)}
                  </Text>
                  <Text style={styles.cardType}>{card.type || 'CARD'}</Text>
                  {card.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.cardActions}>
                {!card.isDefault && (
                  <TouchableOpacity 
                    style={styles.iconBtn}
                    onPress={() => setDefaultCard(card.id)}
                  >
                    <MaterialIcons name="star-outline" size={20} color={colors.lightGray} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={styles.iconBtn}
                  onPress={() => deleteCard(card.id)}
                >
                  <MaterialIcons name="delete-outline" size={20} color={colors.lightGray} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="card-outline" size={64} color={colors.lightGray} />
            <Text style={styles.emptyText}>No saved cards</Text>
            <Text style={styles.emptySubtext}>
              Add a card to make faster payments
            </Text>
          </View>
        )}

        {/* Add New Card Button */}
        <TouchableOpacity 
          style={styles.addCardBtn} 
          onPress={() => {
            router.push('/pages/Profile/Wallet/AddNewCard');
          }}
        >
          <Ionicons name="add" size={20} color={colors.white} />
          <Text style={styles.addCardText}>Add New Card</Text>
        </TouchableOpacity>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
          <Text style={styles.securityText}>
            Your card details are securely stored on your device
          </Text>
        </View>
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
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  defaultCard: {
    borderColor: colors.primary,
    borderWidth: 1,
    backgroundColor: '#F0F9FF',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardLogo: {
    width: 40,
    height: 30,
    resizeMode: 'contain',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.mainTextColor,
    marginBottom: 2,
  },
  cardType: {
    fontSize: 13,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  defaultBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  defaultText: {
    fontSize: 10,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.white,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: colors.lightestGray,
  },
  addCardBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  addCardText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSansBold,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: fonts.PlusJakartaSansBold,
    color: colors.secondaryText,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.lightGray,
    textAlign: 'center',
    lineHeight: 20,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  securityText: {
    fontSize: 12,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.primary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: fonts.PlusJakartaSans,
    color: colors.secondaryText,
  },
});

export default ManageCardsScreen;